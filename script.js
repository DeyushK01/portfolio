// Smooth scroll for navigation
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

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-color), var(--accent-secondary));
    z-index: 1001;
    transition: width 0.2s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${progress}%`;
});

// Header scroll behavior
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add box shadow and background opacity based on scroll
    if (currentScroll > 50) {
        header.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
        header.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
    } else {
        header.style.boxShadow = 'none';
        header.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    }
    
    lastScroll = currentScroll;
});

// Scroll to top functionality
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

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('skill-category')) {
                animateSkillCategory(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all sections and skill items
document.querySelectorAll('section, .skill-category').forEach(element => {
    observer.observe(element);
});

// Animate skill categories with a stagger effect
function animateSkillCategory(category) {
    const items = category.querySelectorAll('li');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// Enhance skill category animations
document.querySelectorAll('.skill-category').forEach(category => {
    category.addEventListener('mouseenter', () => {
        const items = category.querySelectorAll('li');
        items.forEach((item, index) => {
            item.style.transform = 'translateX(10px)';
            item.style.transition = `transform 0.3s ease ${index * 0.1}s`;
        });
    });
    
    category.addEventListener('mouseleave', () => {
        const items = category.querySelectorAll('li');
        items.forEach(item => {
            item.style.transform = 'translateX(0)';
        });
    });
});

// Initialize skill items style
document.querySelectorAll('.skill-category li').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.3s ease';
});

// Typing effect for hero section
function typeEffect(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    
    typing();
}

// Apply typing effect to hero section
window.addEventListener('load', () => {
    const heroText = document.querySelector('#hero p');
    if (heroText) {
        typeEffect(heroText, heroText.textContent);
    }
});

// Form validation and submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const button = form.querySelector('.submit-btn');
        
        let isValid = true;
        
        // Clear any existing messages
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

                // Show success message
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
                    <span>Error sending message: ${error.message}</span>
                `;
                form.insertBefore(errorMessage, button);
            } finally {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }
    });
});

// Helper functions for showing/removing errors
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

// Contact cards hover effect
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelector('.contact-icon i').style.transform = 'scale(1.2) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.querySelector('.contact-icon i').style.transform = 'scale(1) rotate(0)';
    });
});

// Typing effect text content
const texts = [
    "Data Analyst",
    "Tech Enthusiast",
    "Problem Solver",
    "Car Enthusiast",
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let erasingDelay = 50;
let newTextDelay = 2000;

function typeAnimation() {
    const typedTextSpan = document.querySelector('.typed-text');
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        // Pause at end of typing
        setTimeout(() => {
            isDeleting = true;
        }, newTextDelay);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }
    
    setTimeout(typeAnimation, isDeleting ? erasingDelay : typingDelay);
}

// Start the typing animation when the page loads
window.addEventListener('load', () => {
    typeAnimation();
});

// Custom cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

document.addEventListener('mousemove', (e) => {
    if (cursorDot && cursorOutline) {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        // Add slight delay to outline for smooth effect
        setTimeout(() => {
            cursorOutline.style.left = e.clientX + 'px';
            cursorOutline.style.top = e.clientY + 'px';
        }, 50);
    }
});

// Project Carousel
const projectGrid = document.querySelector('.project-grid');
let currentPosition = 0;
const projectCards = document.querySelectorAll('.project-card');
const cardWidth = 300 + 32; // card width + gap
let autoScrollInterval;
let isPaused = false;

let lastTouchTime = 0;
let touchVelocity = 0;
let isTransitioning = false;

function slideProjects(direction, options = {}) {
    if (isTransitioning && !options.ignoreTransition) return;
    
    const totalWidth = cardWidth * projectCards.length;
    const transitionDuration = options.duration || 0.5;
    const transitionTiming = options.timing || 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    
    isTransitioning = true;
    currentPosition += (direction === 'next' ? -cardWidth : cardWidth) * (options.multiplier || 1);

    projectGrid.style.transition = `transform ${transitionDuration}s ${transitionTiming}`;
    projectGrid.style.transform = `translate3d(${currentPosition}px, 0, 0)`;

    // Check if we need to reset position
    setTimeout(() => {
        if (direction === 'next' && currentPosition <= -(totalWidth + cardWidth * 2)) {
            // Reset to start
            projectGrid.style.transition = 'none';
            currentPosition = -cardWidth * 3;
            projectGrid.style.transform = `translate3d(${currentPosition}px, 0, 0)`;
        } else if (direction === 'prev' && currentPosition >= -cardWidth * 2) {
            // Reset to end
            projectGrid.style.transition = 'none';
            currentPosition = -(totalWidth - cardWidth * 3);
            projectGrid.style.transform = `translate3d(${currentPosition}px, 0, 0)`;
        }
        
        // Allow next transition after reset
        setTimeout(() => {
            isTransitioning = false;
        }, 50);
    }, transitionDuration * 1000);
}

function setupInfiniteScroll() {
    if (projectGrid && projectCards.length) {
        // Enable hardware acceleration
        projectGrid.style.transform = 'translate3d(0, 0, 0)';
        projectGrid.style.backfaceVisibility = 'hidden';
        projectGrid.style.perspective = '1000px';
        
        // Clone cards for infinite effect
        const cardsToClone = Array.from(projectCards).slice(0, 3);
        cardsToClone.forEach(card => {
            const clone = card.cloneNode(true);
            projectGrid.appendChild(clone);
        });

        const lastCardsToClone = Array.from(projectCards).slice(-3);
        lastCardsToClone.reverse().forEach(card => {
            const clone = card.cloneNode(true);
            projectGrid.insertBefore(clone, projectGrid.firstChild);
        });

        currentPosition = -cardWidth * 3;
        projectGrid.style.transform = `translate3d(${currentPosition}px, 0, 0)`;
    }
}

function createCarouselControls() {
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.innerHTML = `
        <button class="prev-btn" aria-label="Previous project">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="next-btn" aria-label="Next project">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    document.querySelector('#projects').appendChild(controls);
    
    controls.querySelector('.prev-btn').addEventListener('click', () => {
        pauseAutoScroll();
        slideProjects('prev');
    });
    
    controls.querySelector('.next-btn').addEventListener('click', () => {
        pauseAutoScroll();
        slideProjects('next');
    });
}

function startAutoScroll() {
    if (!autoScrollInterval && !isPaused) {
        autoScrollInterval = setInterval(() => {
            slideProjects('next');
        }, 3000); // Scroll every 3 seconds
    }
}

function pauseAutoScroll() {
    isPaused = true;
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
    
    // Resume after 5 seconds of inactivity
    setTimeout(() => {
        isPaused = false;
        startAutoScroll();
    }, 5000);
}

// Initialize carousel
if (projectGrid && projectCards.length) {
    setupInfiniteScroll();
    createCarouselControls();
    
    startAutoScroll();
    
    projectGrid.addEventListener('mouseenter', pauseAutoScroll);
    projectGrid.addEventListener('mouseleave', () => {
        isPaused = false;
        startAutoScroll();
    });
    
    // Enhanced touch support with velocity
    let touchStartX = 0;
    let touchStartTime = 0;
    let lastTouchX = 0;
    let isDragging = false;
    let startPosition = 0;

    projectGrid.addEventListener('touchstart', e => {
        if (isTransitioning) return;
        
        isDragging = true;
        touchStartX = e.touches[0].clientX;
        lastTouchX = touchStartX;
        touchStartTime = Date.now();
        startPosition = currentPosition;
        
        projectGrid.style.transition = 'none';
        pauseAutoScroll();
    });

    projectGrid.addEventListener('touchmove', e => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const diff = touch.clientX - touchStartX;
        const now = Date.now();
        
        // Calculate velocity
        touchVelocity = (touch.clientX - lastTouchX) / (now - lastTouchTime);
        lastTouchX = touch.clientX;
        lastTouchTime = now;

        // Update position with resistance at edges
        currentPosition = startPosition + diff;
        projectGrid.style.transform = `translate3d(${currentPosition}px, 0, 0)`;
        
        // Prevent default scrolling
        e.preventDefault();
    });

    projectGrid.addEventListener('touchend', e => {
        if (!isDragging) return;
        isDragging = false;

        const touchEndX = e.changedTouches[0].clientX;
        const timeDiff = Date.now() - touchStartTime;
        const distance = touchEndX - touchStartX;
        
        // Use velocity to determine number of slides to move
        const velocity = Math.abs(touchVelocity);
        let slidesToMove = 1;
        
        if (velocity > 1.5) slidesToMove = 2;
        if (velocity > 2.5) slidesToMove = 3;

        if (Math.abs(distance) > 50 || velocity > 0.8) {
            slideProjects(
                distance < 0 ? 'next' : 'prev',
                {
                    multiplier: slidesToMove,
                    duration: 0.3 + (slidesToMove * 0.1),
                    timing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
                }
            );
        } else {
            // Snap back to original position
            projectGrid.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
            projectGrid.style.transform = `translate3d(${startPosition}px, 0, 0)`;
            currentPosition = startPosition;
        }
    });

    // Handle edge cases
    projectGrid.addEventListener('transitionend', () => {
        isTransitioning = false;
    });
}