/**
 * COMMENT HANDLER
 * Manages the submission and display of new comments for the session.
 */
function initComments() {
    const form = document.getElementById('commentForm');
    const list = document.getElementById('commentList');
    const noComments = document.getElementById('noComments');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('userName');
        const commentInput = document.getElementById('userComment');

        // Create the comment container
        const commentDiv = document.createElement('div');
        commentDiv.className = "flex gap-4 border-b border-gray-100 pb-4 transition-opacity duration-500";

        // Generate a random color for the avatar background
        const colors = ['bg-blue-800', 'bg-red-500', 'bg-green-600', 'bg-purple-600'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        commentDiv.innerHTML = `
            <div class="w-10 h-10 ${randomColor} rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0">
                ${nameInput.value.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1">
                <p class="font-bold text-gray-900">${nameInput.value} 
                    <span class="text-xs font-normal text-gray-500 ml-2">Just now</span>
                </p>
                <p class="text-gray-600">${commentInput.value}</p>
            </div>
        `;

        // Remove the "No comments" placeholder if it's there
        if (noComments && noComments.parentNode) {
            noComments.remove();
        }

        // Add to the top of the list
        list.prepend(commentDiv);

        // Clear input fields
        form.reset();
    });
}

document.addEventListener('DOMContentLoaded', initComments);