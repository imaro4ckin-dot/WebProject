/**
 * COMMENT HANDLER with Fetch API
 * Submits comments to the backend and renders them instantly.
 * Requires POST_ID to be defined in the page before this script loads.
 */
function initComments() {
    const form = document.getElementById('commentForm');
    const list = document.getElementById('commentList');
    const postId = typeof POST_ID !== 'undefined' ? POST_ID : null;

    if (!form || !list || !postId) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const commentInput = document.getElementById('userComment');
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
                renderComment("You", text, "bg-blue-600", "Just now", list);
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

function renderComment(name, text, color, time, list) {
    const commentDiv = document.createElement('div');
    commentDiv.className = "flex gap-4 border-b border-gray-100 pb-4";
    commentDiv.innerHTML = `
        <div class="w-10 h-10 ${color} rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0">
            ${name.charAt(0).toUpperCase()}
        </div>
        <div class="flex-1">
            <p class="font-bold text-gray-900">${name}
                <span class="text-xs font-normal text-gray-500 ml-2">${time}</span>
            </p>
            <p class="text-gray-600">${text}</p>
        </div>
    `;
    list.prepend(commentDiv);
}

document.addEventListener('DOMContentLoaded', initComments);
