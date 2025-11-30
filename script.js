// ============================================================================
// SMOOTH SCROLLING & NAVIGATION
// ============================================================================

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const headerOffset = 80;
        const elementPosition = targetSection.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// ============================================================================
// SCROLL PROGRESS INDICATOR
// ============================================================================

const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${progress}%`;
});

// ============================================================================
// HEADER SCROLL BEHAVIOR
// ============================================================================

const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
        header.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
    } else {
        header.style.boxShadow = 'none';
        header.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
    }
    
    lastScroll = currentScroll;
});

// ============================================================================
// SCROLL TO TOP FUNCTIONALITY
// ============================================================================

const scrollToTopBtn = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================================================

const observerOptions = {
    root: null,
    rootMargin: '-50px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(element => {
    observer.observe(element);
});

// ============================================================================
// TYPING ANIMATION FOR HERO SECTION
// ============================================================================

const texts = [
    "Data Analyst",
    "Tech Enthusiast",
    "Problem Solver",
    "AI Explorer",
    "Car Enthusiast"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let erasingDelay = 50;
let newTextDelay = 2000;

function typeAnimation() {
    const typedTextSpan = document.querySelector('.typed-text');
    if (!typedTextSpan) return;
    
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => {
            isDeleting = true;
        }, newTextDelay);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }
    
    setTimeout(typeAnimation, isDeleting ? erasingDelay : typingDelay);
}

window.addEventListener('load', () => {
    typeAnimation();
});

// ============================================================================
// CUSTOM CURSOR
// ============================================================================

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (cursorDot && cursorOutline) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
        
        setTimeout(() => {
            cursorOutline.style.left = mouseX + 'px';
            cursorOutline.style.top = mouseY + 'px';
        }, 50);
    }
});

document.addEventListener('mouseleave', () => {
    if (cursorDot && cursorOutline) {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    }
});

// ============================================================================
// FORM VALIDATION AND SUBMISSION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const button = form.querySelector('.submit-btn');
        
        let isValid = true;
        
        const existingMessages = form.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Validate inputs
        if (nameInput.value.length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
            isValid = false;
        } else {
            removeError(nameInput);
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            removeError(emailInput);
        }
        
        if (messageInput.value.length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            removeError(messageInput);
        }
        
        if (isValid) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
            button.disabled = true;
            
            const formData = {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            };
            
            try {
                const apiUrl = window.location.hostname.includes('render.com')
                    ? 'https://portfolio-backend-xl61.onrender.com/api/contact'
                    : 'http://localhost:3000/api/contact';
                    
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || data.details || 'Failed to send message');
                }

                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>Message sent successfully!</span>
                `;
                form.insertBefore(successMessage, button);
                form.reset();

            } catch (error) {
                console.error('Error sending message:', error);
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Error: ${error.message}</span>
                `;
                form.insertBefore(errorMessage, button);
            } finally {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }
    });
});

function showError(input, message) {
    const formGroup = input.parentElement;
    const errorDiv = formGroup.querySelector('.validation-message') || document.createElement('div');
    errorDiv.className = 'validation-message';
    errorDiv.textContent = message;
    if (!formGroup.querySelector('.validation-message')) {
        formGroup.appendChild(errorDiv);
    }
    formGroup.classList.add('error');
}

function removeError(input) {
    const formGroup = input.parentElement;
    const errorDiv = formGroup.querySelector('.validation-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    formGroup.classList.remove('error');
}

// ============================================================================
// CREATIVE PROJECT CAROUSEL
// ============================================================================

const carouselTrack = document.querySelector('.carousel-track');
const projectCards = document.querySelectorAll('.project-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const indicators = document.querySelectorAll('.indicator');

let currentIndex = 0;
let autoScrollInterval;
let isTransitioning = false;

function updateCarousel() {
    if (isTransitioning) return;
    isTransitioning = true;

    // Remove active class from all cards and indicators
    projectCards.forEach(card => card.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));

    // Add active class to current card and indicator
    projectCards[currentIndex].classList.add('active');
    indicators[currentIndex].classList.add('active');

    // Calculate the offset - move track so active card is centered
    const offset = -(currentIndex * 100);
    carouselTrack.style.transform = `translateX(${offset}%)`;

    setTimeout(() => {
        isTransitioning = false;
    }, 600);
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % projectCards.length;
    updateCarousel();
    resetAutoScroll();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
    updateCarousel();
    resetAutoScroll();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetAutoScroll();
}

function startAutoScroll() {
    autoScrollInterval = setInterval(nextSlide, 5000);
}

function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
}

// Event listeners
if (prevBtn) prevBtn.addEventListener('click', prevSlide);
if (nextBtn) nextBtn.addEventListener('click', nextSlide);

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// Pause on hover
if (carouselTrack) {
    carouselTrack.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    carouselTrack.addEventListener('mouseleave', startAutoScroll);
}

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoScrollInterval);
    });

    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoScroll();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    updateCarousel();
});

// Initialize carousel
if (carouselTrack && projectCards.length > 0) {
    updateCarousel();
    startAutoScroll();
}

// ============================================================================
// GALLERY LIGHTBOX
// ============================================================================

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.querySelector('.lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('.gallery-overlay h3').textContent;
            const description = item.querySelector('.gallery-overlay p').textContent;
            
            lightboxContent.src = img.src;
            lightboxCaption.innerHTML = `<strong>${title}</strong><br>${description}`;
            lightbox.classList.add('active');
        });
    });
    
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
}

// ============================================================================
// GALLERY FILTER
// ============================================================================

const filterBtns = document.querySelectorAll('.filter-btn');
const filteredItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            filteredItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Set 'all' as default
    filterBtns[0].classList.add('active');
}

// ============================================================================
// PARTICLE CANVAS ANIMATION
// ============================================================================

const particleCanvas = document.getElementById('particle-canvas');
if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    const particles = [];
    
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    
    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.fadeSpeed = Math.random() * 0.02 + 0.01;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > particleCanvas.width) this.x = 0;
            if (this.x < 0) this.x = particleCanvas.width;
            if (this.y > particleCanvas.height) this.y = 0;
            if (this.y < 0) this.y = particleCanvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Resize handler
    window.addEventListener('resize', () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    });
}

// ============================================================================
// CONTACT CARD HOVER EFFECTS
// ============================================================================

document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.contact-icon i');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(8deg)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.contact-icon i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0)';
        }
    });
});

// ============================================================================
// PAGE LOAD ANIMATIONS
// ============================================================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
