document.addEventListener('DOMContentLoaded', () => {

    // 1. Accessible Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
            navLinks.classList.toggle('flex-col');
            navLinks.classList.toggle('absolute');
            navLinks.classList.toggle('top-16');
            navLinks.classList.toggle('left-0');
            navLinks.classList.toggle('w-full');
            navLinks.classList.toggle('bg-blue-800');
            navLinks.classList.toggle('p-4');

            // Update aria-expanded state for screen readers
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // 2. Destination Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-blue-800', 'text-white');
                b.classList.add('bg-white', 'text-blue-800');
                b.setAttribute('aria-pressed', 'false'); // Update ARIA state
            });

            btn.classList.remove('bg-white', 'text-blue-800');
            btn.classList.add('bg-blue-800', 'text-white');
            btn.setAttribute('aria-pressed', 'true'); // Update ARIA state

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

    // 3. Accessible Lightbox Effect
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    triggers.forEach(trigger => {
        // Function to handle opening the lightbox
        const openLightbox = () => {
            if (lightbox && lightboxImg) {
                lightbox.classList.remove('hidden');
                lightbox.classList.add('flex');
                lightboxImg.src = trigger.src;
                lightboxImg.alt = trigger.alt;
            }
        };

        // Open via mouse click
        trigger.addEventListener('click', openLightbox);

        // Open via keyboard (Enter key) to hit operable standards
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                openLightbox();
            }
        });
    });

    if (closeLightboxBtn && lightbox) {
        closeLightboxBtn.addEventListener('click', () => {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
        });
    }

    if (lightbox) {
        window.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('hidden');
                lightbox.classList.remove('flex');
            }
        });
    }

    // 4. Basic Form Submission (Contact & Book pages)
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm && successMessage) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            contactForm.style.display = 'none';
            successMessage.removeAttribute('hidden');
        });
    }
});