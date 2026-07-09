
document.addEventListener('DOMContentLoaded', () => {

    // ─── Scroll-reveal (IntersectionObserver) ────────────────────────────────
    // Cards and sections get a .reveal class added via JS so they only animate
    // when they actually enter the viewport, not on first paint.
    const revealEls = document.querySelectorAll('.card, .team-card, .spotlight, .contact-panel');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // stagger siblings by 80 ms each
                    const siblings = Array.from(entry.target.parentElement.children);
                    const idx = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${idx * 80}ms`;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealEls.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    } else {
        // Fallback: just show everything
        revealEls.forEach(el => el.classList.add('is-visible', 'reveal'));
    }

    // ─── Card 3-D tilt on mouse move ─────────────────────────────────────────
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 … 0.5
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // 1. Mobile Menu Toggle
    const menuToggle  = document.getElementById('mobile-menu-btn');
    const mobileMenu  = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }


    // 2. Destination/Gallery Filters

    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active styling and reset ARIA state for all buttons
            filterBtns.forEach(b => {
                b.classList.remove('bg-blue-800', 'text-white');
                b.classList.add('bg-white', 'text-blue-800');
                b.setAttribute('aria-pressed', 'false');
            });

            // Apply active styling and set ARIA state for the clicked button
            btn.classList.remove('bg-white', 'text-blue-800');
            btn.classList.add('bg-blue-800', 'text-white');
            btn.setAttribute('aria-pressed', 'true');

            // Show or hide gallery items based on their data-category matching the button's data-filter
            const filterValue = btn.getAttribute('data-filter');
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    // 3. Accessible Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    const triggers = document.querySelectorAll('.lightbox-trigger, .gallery-img');

    // Attach click and keyboard events to all  images
    triggers.forEach(trigger => {
        const openLightbox = () => {
            if (lightbox && lightboxImg) {
                lightbox.classList.remove('hidden');
                lightbox.classList.add('flex');
                lightboxImg.src = trigger.src; // Transfer image source to lightbox
                lightboxImg.alt = trigger.alt; // Transfer alt text for accessibility
            }
        };

        // Open lightbox on mouse click
        trigger.addEventListener('click', openLightbox);

        // Open lightbox when pressing 'Enter' (for keyboard navigation users)
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                openLightbox();
            }
        });
    });

    // Close the lightbox when clicking the 'X' button
    if (closeLightboxBtn && lightbox) {
        closeLightboxBtn.addEventListener('click', () => {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
        });
    }

    // Close the lightbox when clicking anywhere on the dark background overlay
    if (lightbox) {
        window.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('hidden');
                lightbox.classList.remove('flex');
            }
        });
    }


    // 4. Contact/Booking Form Submission

    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm && successMessage) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the page from reloading
            contactForm.style.display = 'none'; // Hide the form
            successMessage.removeAttribute('hidden'); // Show the success message
        });
    }


    // 5. Blog Comments Form

    const commentForm = document.getElementById('commentForm');
    const commentNameInput = document.getElementById('commentName');
    const commentTextInput = document.getElementById('commentText');
    const commentList = document.getElementById('commentList');

    if (commentForm && commentList) {
        commentForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the page from reloading

            // Get the values entered by the user
            const name = commentNameInput.value;
            const text = commentTextInput.value;

            // Create a new container div for the comment and apply Tailwind classes
            const newComment = document.createElement('div');
            newComment.className = 'border-b border-gray-100 pb-4';

            // Insert the user's name and comment text into the HTML structure
            newComment.innerHTML = `
                <p class="font-bold text-gray-800">${name} <span class="text-sm text-gray-500 font-normal ml-2">Just now</span></p>
                <p class="text-gray-600 mt-1">${text}</p>
            `;

            // Append the new comment to the bottom of the comment list
            commentList.appendChild(newComment);

            // Clear the form fields for the next comment
            commentForm.reset();
        });
    }

});