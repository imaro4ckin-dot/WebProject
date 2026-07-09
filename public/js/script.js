
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


    // 2. Accessible Lightbox
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


    // 3. Contact/Booking Form Submission

    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm && successMessage) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the page from reloading
            contactForm.style.display = 'none'; // Hide the form
            successMessage.removeAttribute('hidden'); // Show the success message
        });
    }

});