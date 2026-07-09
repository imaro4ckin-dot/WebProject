/**
 * COMMENT HANDLER with Fetch API
 * Submits comments to the backend and renders them instantly.
 * Requires POST_ID, CURRENT_USER_ID, and CURRENT_USERNAME to be defined in the page before this script loads.
 */
function updateCommentCount(delta) {
    const heading = document.getElementById('commentsHeading');
    if (!heading) return;
    const match = heading.textContent.match(/\d+/);
    const current = match ? parseInt(match[0]) : 0;
    const next = Math.max(0, current + delta);
    heading.textContent = `Comments (${next})`;
}

function initComments() {
    const form   = document.getElementById('commentForm');
    const list   = document.getElementById('commentList');
    const postId = typeof POST_ID !== 'undefined' ? POST_ID : null;

    if (!list || !postId) return;

    // Delete comment (delegated listener)
    list.addEventListener('click', async (e) => {
        const btn = e.target.closest('.delete-comment-btn');
        if (!btn) return;
        if (!confirm('Delete this comment?')) return;
        const commentId = btn.dataset.commentId;
        const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
        if (res.ok) {
            const commentEl = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
            if (commentEl) commentEl.remove();
            updateCommentCount(-1);
        } else {
            alert('Failed to delete comment.');
        }
    });

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Support both old id "userComment" and new id "commentBody"
        const commentInput = document.getElementById('commentBody') || document.getElementById('userComment');
        const text = commentInput.value.trim();
        if (!text) return;

        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body: text })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                const data = await response.json();
                const displayName = typeof CURRENT_USERNAME !== 'undefined' ? CURRENT_USERNAME : 'You';
                renderComment(displayName, text, "Just now", list, data.commentId);
                updateCommentCount(+1);
                const noComments = document.getElementById('noComments');
                if (noComments) noComments.remove();
                form.reset();
            } else {
                alert("Failed to save the comment. Please try again.");
            }
        } catch (error) {
            console.error("Server error:", error);
            alert("Could not connect to the server.");
        }
    });
}

function renderComment(name, text, time, list, commentId) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.dataset.commentId = commentId || '';
    commentDiv.innerHTML = `
        <div class="avatar">${name.charAt(0).toUpperCase()}</div>
        <div class="comment-body">
            <strong>${name}</strong>
            <span class="meta">${time}</span>
            <button class="delete-comment-btn btn btn-danger btn-sm" style="float:right; margin-top:-2px;" data-comment-id="${commentId || ''}">Delete</button>
            <p>${text}</p>
        </div>
    `;
    list.prepend(commentDiv);
}

document.addEventListener('DOMContentLoaded', initComments);

