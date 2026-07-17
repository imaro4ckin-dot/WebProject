const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');
const Stamp = require('../models/Stamp');
const sanitizeHtml = require('sanitize-html');

// Белый список разрешённых HTML-тегов и атрибутов для содержимого постов.
// sanitize-html по умолчанию разрешает базовый набор тегов (p, b, i, ul и т.д.).
// Мы расширяем его, добавляя h2, h3, u (подчёркивание) и img (изображения в тексте).
// allowedSchemes: только http/https/mailto — блокируем javascript:, data: и другие опасные схемы.
// Это защита от XSS: даже если пользователь вставит <script> через редактор Quill,
// sanitize-html удалит его перед отображением.
const ALLOWED_HTML = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h2', 'h3', 'u', 'img']),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt'],
        a: ['href', 'name', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
};

/**
 * home — отображает главную страницу с 6 последними постами.
 * При ошибке БД рендерит страницу с пустым списком
 * сайт остаётся доступным, просто без контента).
 */
const home = async (req, res) => {
    try {
        const posts = await Post.getLatest(6);
        res.render('index', { posts });
    } catch (err) {
        console.error(err);
        res.render('index', { posts: [] });
    }
};

/**
 * destinations — страница каталога с фильтрацией по категории и поиском.
 * Параметры приходят из строки запроса: /destinations?category=food&q=paris
 * При ошибке возвращаем пустой список, а не 500 — страница остаётся рабочей.
 */
const destinations = async (req, res) => {
    const { category, q } = req.query;
    try {
        const posts = await Post.getAll(category, q);
        res.render('destinations', { posts, category: category || 'all', q: q || '' });
    } catch (err) {
        console.error(err);
        res.render('destinations', { posts: [], category: 'all', q: '' });
    }
};

/**
 * createPostPage — страница создания нового поста.
 * Передаём post: undefined в шаблон, чтобы форма знала, что режим "создание",
 * а не "редактирование" (в шаблоне create-post.ejs одна форма для обоих случаев).
 */
const createPostPage = (req, res) => {
    if (!req.user) return res.redirect('/login');
    res.render('create-post', { post: undefined });
};

/**
 * editPostPage — страница редактирования существующего поста.
 *
 * Обратная совместимость со старыми числовыми URL:
 * Если в URL числовой ID (например /posts/42/edit) вместо slug,
 * ищем пост по ID и делаем 301-редирект на новый slug-URL.
 * 301 (постоянный редирект) кешируется браузером — ОСТОРОЖНО:
 * если потом slug изменится, браузер может долго использовать старый URL из кеша.
 *
 * getForEditBySlug проверяет и slug, И user_id — нельзя редактировать чужой пост.
 * Если пост не найден (нет прав или не существует) — отдаём 404, а не 403,
 * чтобы не раскрывать информацию о существовании поста другого пользователя.
 */
const editPostPage = async (req, res) => {
    if (!req.user) return res.redirect('/login');
    const { slug } = req.params;
    try {
        let post = await Post.getForEditBySlug(slug, req.user.id);

        // Запасной вариант: числовой ID в URL → перенаправляем на URL с slug
        if (!post && /^\d+$/.test(slug)) {
            const found = await Post.getForEdit(slug, req.user.id);
            if (found) return res.redirect(301, `/posts/${found.slug}/edit`);
        }

        if (!post) return res.status(403).render('404');
        res.render('create-post', { post });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка загрузки редактора поста');
    }
};

/**
 * postDetail — страница отдельного поста.
 *
 * Ключевые моменты:
 *
 * 1. decodeURIComponent: URL может содержать %20 и другие escape-последовательности —
 *    декодируем их перед поиском в БД.
 *
 * 2. Обратная совместимость: если slug выглядит как число (/posts/42),
 *    ищем по ID и делаем 301-редирект на slug-URL.
 *
 * 3. sanitizeHtml применяется к содержимому ПОСЛЕ загрузки из БД,
 *    непосредственно перед передачей в шаблон — это последний рубеж защиты от XSS.
 *
 * 4. Статус liked/bookmarked проверяем только для авторизованных пользователей
 *    (req.user существует). Для гостей оба флага остаются false.
 */
const postDetail = async (req, res) => {
    const slug = decodeURIComponent(req.params.slug);
    try {
        let post = await Post.getBySlug(slug);

        // Запасной вариант: если параметр — числовой ID (старые ссылки), ищем по ID и перенаправляем
        if (!post && /^\d+$/.test(slug)) {
            post = await Post.getById(slug);
            if (post) return res.redirect(301, `/posts/${post.slug}`);
        }

        if (!post) return res.status(404).render('404');
        // Увеличиваем счётчик просмотров — не await, не критично, не блокируем рендер
        await Post.incrementViews(post.id);

        // Очищаем HTML перед отображением — защита от XSS-атак через содержимое поста
        post.content = sanitizeHtml(post.content, ALLOWED_HTML);

        const comments = await Comment.getByPost(post.id);

        let liked = false;
        let bookmarked = false;
        if (req.user) {
            // Делаем два запроса к БД только для авторизованных — оптимизация для гостей
            liked = await Like.check(post.id, req.user.id);
            bookmarked = await Bookmark.check(post.id, req.user.id);
        }

        const likeCount = await Like.count(post.id);

        res.render('post', { post, comments, liked, bookmarked, likeCount });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка загрузки поста');
    }
};

/**
 * userProfilePage — публичная страница профиля пользователя.
 * Доступна всем (не требует авторизации) — это открытая страница блога.
 * Загружает посты и штампы паспорта (достижения) для указанного пользователя.
 */
const userProfilePage = async (req, res) => {
    const { id } = req.params;
    try {
        const profileUser = await User.getById(id);
        if (!profileUser) return res.status(404).render('404');

        const posts = await Post.getByUser(id);

        // Получаем ВСЕ штампы (включая незаработанные) — шаблон покажет их серыми
        const passportStamps = await Stamp.getAllForUser(id);

        // Загружаем закладки только если авторизованный пользователь смотрит свой профиль.
        // Чужие закладки не показываем — приватная информация.
        // Для гостей и чужих профилей — пустой массив, без запроса к БД.
        let bookmarks = [];
        if (req.user && req.user.id === profileUser.id) {
            bookmarks = await Bookmark.getByUser(id);
        }

        res.render('profile', { profileUser, posts, passportStamps, bookmarks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка загрузки профиля');
    }
};

module.exports = { home, destinations, createPostPage, editPostPage, postDetail, userProfilePage };
