/**
 * COMMENT HANDLER with Fetch API
 * Manages the submission of comments to the backend database.
 */
function initComments() {
    const form = document.getElementById('commentForm');
    const list = document.getElementById('commentList');

    // We still need the post ID to know which URL to send the comment to.
    // We assume POST_KEY is defined in your EJS file (e.g., const POST_KEY = <%= post.id %>;)
    const postId = typeof POST_KEY !== 'undefined' ? POST_KEY : null;

    if (!form || !list || !postId) return;

    // Handle new comment submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const commentInput = document.getElementById('userComment');
        const text = commentInput.value;

        try {
            // 1. Send the comment to your backend
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // We use 'body' to match your database column exactly
                body: JSON.stringify({ body: text })
            });

            // 2. Check the bouncer! (401 means not logged in)
            if (response.status === 401) {
                alert("You must be logged in to leave a comment!");
                return;
            }

            if (response.ok) {
                // 3. Success! Render it to the screen instantly so the user doesn't have to refresh
                renderComment("You", text, "bg-blue-600", "Just now", list, true);

                // Cleanup
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

// Function to inject the comment HTML into the list instantly
function renderComment(name, text, color, time, list, isNew = false) {
    const commentDiv = document.createElement('div');
    commentDiv.className = "flex gap-4 border-b border-gray-100 pb-4";

    if (isNew) commentDiv.classList.add('animate-pulse');

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

    // Newest comments go to the top
    list.prepend(commentDiv);
}

document.addEventListener('DOMContentLoaded', initComments);