/**
 * POST ACTIONS — Like & Bookmark
 * Wires up the like and bookmark buttons on the post page to the real API.
 * Requires POST_ID to be defined in the page before this script loads.
 */
document.addEventListener('DOMContentLoaded', () => {
    const likeBtn     = document.getElementById('likeBtn');
    const bookmarkBtn = document.getElementById('bookmarkBtn');

    if (likeBtn) {
        likeBtn.addEventListener('click', async () => {
            const res = await fetch(`/api/posts/${POST_ID}/like`, { method: 'POST' });
            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) return;

            const label   = document.getElementById('likeLabel');
            const countEl = document.getElementById('likeCount');
            const isLiked = likeBtn.dataset.liked === 'true';

            if (isLiked) {
                likeBtn.dataset.liked = 'false';
                likeBtn.className = likeBtn.className
                    .replace('bg-terracotta text-white border-terracotta', 'bg-white text-stone-600 border-stone-200 hover:border-terracotta hover:text-terracotta');
                label.textContent = 'Like';
                const current = parseInt(countEl.textContent.replace(/\D/g, ''));
                countEl.textContent = `(${Math.max(0, current - 1)})`;
            } else {
                likeBtn.dataset.liked = 'true';
                likeBtn.className = likeBtn.className
                    .replace('bg-white text-stone-600 border-stone-200 hover:border-terracotta hover:text-terracotta', 'bg-terracotta text-white border-terracotta');
                label.textContent = 'Liked';
                const current = parseInt(countEl.textContent.replace(/\D/g, ''));
                countEl.textContent = `(${current + 1})`;
            }
        });
    }

    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', async () => {
            const res = await fetch(`/api/posts/${POST_ID}/bookmark`, { method: 'POST' });
            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) return;

            const label        = document.getElementById('bookmarkLabel');
            const isBookmarked = bookmarkBtn.dataset.bookmarked === 'true';

            if (isBookmarked) {
                bookmarkBtn.dataset.bookmarked = 'false';
                bookmarkBtn.className = bookmarkBtn.className
                    .replace('bg-forest text-white border-forest', 'bg-white text-stone-600 border-stone-200 hover:border-forest hover:text-forest');
                label.textContent = 'Save';
            } else {
                bookmarkBtn.dataset.bookmarked = 'true';
                bookmarkBtn.className = bookmarkBtn.className
                    .replace('bg-white text-stone-600 border-stone-200 hover:border-forest hover:text-forest', 'bg-forest text-white border-forest');
                label.textContent = 'Saved';
            }
        });
    }
});
