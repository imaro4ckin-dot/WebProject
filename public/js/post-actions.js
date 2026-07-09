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
            const isLiked = likeBtn.classList.contains('like-active');

            if (isLiked) {
                likeBtn.classList.remove('like-active');
                likeBtn.setAttribute('aria-pressed', 'false');
                likeBtn.setAttribute('aria-label', 'Like this post');
                label.textContent = 'Like';
                const current = parseInt(countEl.textContent.replace(/\D/g, ''));
                countEl.textContent = `(${Math.max(0, current - 1)})`;
            } else {
                likeBtn.classList.add('like-active');
                likeBtn.setAttribute('aria-pressed', 'true');
                likeBtn.setAttribute('aria-label', 'Unlike this post');
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
            const isBookmarked = bookmarkBtn.classList.contains('bookmark-active');

            if (isBookmarked) {
                bookmarkBtn.classList.remove('bookmark-active');
                bookmarkBtn.setAttribute('aria-pressed', 'false');
                bookmarkBtn.setAttribute('aria-label', 'Bookmark this post');
                label.textContent = 'Save';
            } else {
                bookmarkBtn.classList.add('bookmark-active');
                bookmarkBtn.setAttribute('aria-pressed', 'true');
                bookmarkBtn.setAttribute('aria-label', 'Remove bookmark');
                label.textContent = 'Saved';
            }
        });
    }
});
