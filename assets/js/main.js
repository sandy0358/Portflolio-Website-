// Initial setup
document.body.style.visibility = 'hidden';

// Function to handle image loading errors
function handleImageError(img) {
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Handle all images
    document.querySelectorAll('img').forEach(img => {
        img.onerror = () => handleImageError(img);
    });

    // Get all necessary elements
    const preloader = document.querySelector('.preloader');
    const body = document.body;
    const menuBtn = document.querySelector('.menu-btn');
    const navItems = document.querySelector('.nav-items');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const skillsSection = document.querySelector('.skills');
    const progressBars = document.querySelectorAll('.progress');
    let menuOpen = false;

    // Initialize AOS with a delay
    setTimeout(() => {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            disable: 'mobile'
        });
    }, 100);

    // Show content and hide preloader
    function showContent() {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
        body.style.visibility = 'visible';
        AOS.refresh();
    }

    // Handle page load
    if (document.readyState === 'complete') {
        showContent();
    } else {
        window.addEventListener('load', () => {
            setTimeout(showContent, 500);
        });
    }

    // Mobile Menu Toggle
    function toggleMenu() {
        menuOpen = !menuOpen;
        menuBtn.classList.toggle('open');
        navItems.classList.toggle('active');
        body.style.overflow = menuOpen ? 'hidden' : '';
    }

    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (menuOpen && !e.target.closest('.nav-items') && !e.target.closest('.menu-btn')) {
            toggleMenu();
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                if (menuOpen) {
                    toggleMenu();
                }
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Navigation Link
    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // Skills Progress Animation
    function showProgress() {
        progressBars.forEach(progress => {
            const value = progress.dataset.value || progress.style.width;
            progress.style.width = '0';
            setTimeout(() => {
                progress.style.width = value;
            }, 100);
        });
    }

    // Testimonials
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonialItems.forEach((item, i) => {
            item.style.opacity = i === index ? '1' : '0';
            item.style.transform = i === index ? 'translateX(0)' : 'translateX(100px)';
        });
    }

    // Initialize testimonials
    showTestimonial(currentTestimonial);

    // Auto-advance testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // Event Listeners
    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('scroll', () => {
        const sectionPos = skillsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;
        if (sectionPos < screenPos) {
            showProgress();
        }
    });

    // Form Validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            if (validateForm(name, email, subject, message)) {
                showFormMessage('Message sent successfully!', 'success');
                contactForm.reset();
            }
        });
    }

    // Initialize first load
    setActiveLink();
    document.querySelector('.filter-btn[data-filter="all"]').click();
});

// Helper Functions
function validateForm(name, email, subject, message) {
    let isValid = true;
    [name, email, subject, message].forEach(field => {
        field.classList.remove('error');
    });

    if (name.value.trim() === '') {
        showError(name, 'Name is required');
        isValid = false;
    }

    if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
    }

    if (subject.value.trim() === '') {
        showError(subject, 'Subject is required');
        isValid = false;
    }

    if (message.value.trim() === '') {
        showError(message, 'Message is required');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
        field.classList.remove('error');
    }, 3000);
}

function showFormMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    document.querySelector('.contact-form').appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
} 