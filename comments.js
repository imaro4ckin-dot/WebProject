//Manages the submission and display of new comments for the session.

/**
 * COMMENT HANDLER with LocalStorage
 * Manages the submission, display, and persistence of comments.
 */
function initComments() {
    const form = document.getElementById('commentForm');
    const list = document.getElementById('commentList');

    // Use the POST_KEY defined in the HTML script tag to keep comments unique to the post
    // If POST_KEY isn't found, it falls back to a generic 'general_comments'
    const STORAGE_KEY = (typeof POST_KEY !== 'undefined') ? `comments_${POST_KEY}` : 'comments_general';

    if (!form || !list) return;

// 1. Load existing comments from localStorage on page load ---
    const savedComments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    if (savedComments.length > 0) {
        // Remove the "No comments" placeholder if there's data
        const noComments = document.getElementById('noComments');
        if (noComments) noComments.remove();

        // Render each saved comment
        savedComments.forEach(data => {
            renderComment(data.name, data.text, data.color, data.time, list);
        });
    }

    //  2. Handle new comment submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('userName');
        const commentInput = document.getElementById('userComment');

        // Colors for variety
        const colors = ['bg-blue-800', 'bg-red-500', 'bg-green-600', 'bg-purple-600', 'bg-orange-500'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const timeString = new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });

        const newComment = {
            name: nameInput.value,
            text: commentInput.value,
            color: randomColor,
            time: timeString
        };

        // Render to UI
        renderComment(newComment.name, newComment.text, newComment.color, "Just now", list, true);

        // Save to LocalStorage
        savedComments.push(newComment);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedComments));

        // Cleanup
        const noComments = document.getElementById('noComments');
        if (noComments) noComments.remove();
        form.reset();
    });
}

//function to inject the comment HTML into the list

function renderComment(name, text, color, time, list, isNew = false) {
    const commentDiv = document.createElement('div');
    commentDiv.className = "flex gap-4 border-b border-gray-100 pb-4";

    // Add a little fade-in effect for newly added comments
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