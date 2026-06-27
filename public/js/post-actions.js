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

            const data = await res.json();
            const label     = document.getElementById('likeLabel');
            const countEl   = document.getElementById('likeCount');
            const isLiked   = likeBtn.classList.contains('bg-blue-600');

            if (isLiked) {
                // Unlike
                likeBtn.classList.replace('bg-blue-600', 'bg-blue-100');
                likeBtn.classList.replace('text-white', 'text-blue-800');
                label.textContent = 'Like';
                const current = parseInt(countEl.textContent.replace(/\D/g, ''));
                countEl.textContent = `(${Math.max(0, current - 1)})`;
            } else {
                // Like
                likeBtn.classList.replace('bg-blue-100', 'bg-blue-600');
                likeBtn.classList.replace('text-blue-800', 'text-white');
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

            const label     = document.getElementById('bookmarkLabel');
            const isBookmarked = bookmarkBtn.classList.contains('bg-yellow-400');

            if (isBookmarked) {
                bookmarkBtn.classList.replace('bg-yellow-400', 'bg-yellow-100');
                bookmarkBtn.classList.replace('text-white', 'text-yellow-800');
                label.textContent = 'Save';
            } else {
                bookmarkBtn.classList.replace('bg-yellow-100', 'bg-yellow-400');
                bookmarkBtn.classList.replace('text-yellow-800', 'text-white');
                label.textContent = 'Saved';
            }
        });
    }
});
