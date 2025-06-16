// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Quote Modal Functions
const modal = document.getElementById('quoteModal');
const closeBtn = document.querySelector('.close');

function openQuoteModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeQuoteModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeQuoteModal();
    }
});

// Form Submission Handler
async function submitForm(formData, formElement) {
    try {
        // Show loading state
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Pabbly webhook URL - Replace with your actual webhook URL
        const webhookUrl = 'https://connect.pabbly.com/workflow/sendwebhookdata/YOUR_WEBHOOK_ID';
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                service: formData.get('service'),
                message: formData.get('message'),
                timestamp: new Date().toISOString(),
                source: 'Website Contact Form'
            })
        });

        if (response.ok) {
            // Success
            showNotification('Thank you! Your quote request has been submitted. We\'ll contact you within 24 hours.', 'success');
            formElement.reset();
            if (modal.style.display === 'block') {
                closeQuoteModal();
            }
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Sorry, there was an error submitting your request. Please call us directly at (951) 977-6607.', 'error');
    } finally {
        // Reset button state
        const submitBtn = formElement.querySelector('button[type="submit"]');
        submitBtn.textContent = submitBtn.textContent.includes('Submit') ? 'Submit Quote Request' : 'Get Free Quote';
        submitBtn.disabled = false;
    }
}

// Handle main contact form
document.getElementById('quoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await submitForm(formData, e.target);
});

// Handle modal form
document.getElementById('modalQuoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await submitForm(formData, e.target);
});

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 3000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            .notification-success {
                border-left: 4px solid #10b981;
            }
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                color: #374151;
            }
            .notification-success .fa-check-circle {
                color: #10b981;
            }
            .notification-error .fa-exclamation-circle {
                color: #ef4444;
            }
            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                margin-left: auto;
                padding: 4px;
            }
            .notification-close:hover {
                color: #374151;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .testimonial, .gallery-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Phone number formatting
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
        }
        e.target.value = value;
    });
});

// Preload critical images
const criticalImages = [
    'logo.png',
    'team-photo.png'
];

criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

// Add loading states for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Skip the about section team photo, gallery images, and logo images - let them display immediately
        if (img.closest('.about-image') || img.closest('.gallery-item') || img.closest('.logo') || img.closest('.footer-logo')) {
            img.style.opacity = '1';
            return;
        }
        
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            // Fallback for missing images
            img.style.display = 'none';
        });
        
        // Set initial opacity for smooth loading (except about image and gallery images)
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});