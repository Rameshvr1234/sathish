// Property Detail Page JavaScript

// Image Gallery
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('mainImage');

thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));

        // Add active class to clicked thumbnail
        thumbnail.classList.add('active');

        // Update main image
        mainImage.src = thumbnail.src.replace('w=200&h=150', 'w=800&h=600');

        // Add fade animation
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 100);
    });
});

// Gallery Navigation
const prevBtn = document.querySelector('.gallery-nav.prev');
const nextBtn = document.querySelector('.gallery-nav.next');
let currentIndex = 0;

prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : thumbnails.length - 1;
    thumbnails[currentIndex].click();
});

nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex < thumbnails.length - 1 ? currentIndex + 1 : 0;
    thumbnails[currentIndex].click();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        nextBtn.click();
    }
});

// Fullscreen Gallery
const fullscreenBtn = document.querySelector('.fullscreen-btn');
fullscreenBtn.addEventListener('click', () => {
    // In a real implementation, this would open a lightbox/modal
    alert('Fullscreen gallery would open here with all 20 images');
});

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;

        // Simulate form submission
        setTimeout(() => {
            alert(`Thank you ${name}! Your message has been sent to the property owner.`);
            contactForm.reset();
        }, 500);
    });
}

// EMI Calculator
const emiCalculator = document.querySelector('.emi-card .btn-primary');
if (emiCalculator) {
    emiCalculator.addEventListener('click', (e) => {
        e.preventDefault();

        const loanAmount = parseFloat(document.querySelector('.emi-form input[type="number"]:nth-of-type(1)').value);
        const interestRate = parseFloat(document.querySelector('.emi-form input[type="number"]:nth-of-type(2)').value);
        const tenure = parseFloat(document.querySelector('.emi-form input[type="number"]:nth-of-type(3)').value);

        // EMI Calculation Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
        const monthlyRate = interestRate / (12 * 100);
        const months = tenure * 12;

        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                    (Math.pow(1 + monthlyRate, months) - 1);

        // Update EMI display
        const emiAmount = document.querySelector('.emi-amount');
        emiAmount.textContent = `₹${Math.round(emi).toLocaleString('en-IN')}`;

        // Add animation
        emiAmount.style.transform = 'scale(1.1)';
        setTimeout(() => {
            emiAmount.style.transform = 'scale(1)';
        }, 300);
    });
}

// Action Buttons
const favoriteBtn = document.querySelector('.action-btn:nth-child(1)');
const shareBtn = document.querySelector('.action-btn:nth-child(2)');
const printBtn = document.querySelector('.action-btn:nth-child(3)');

favoriteBtn.addEventListener('click', () => {
    const icon = favoriteBtn.querySelector('i');

    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        favoriteBtn.style.background = 'var(--danger-color)';
        favoriteBtn.style.color = 'var(--white)';
        favoriteBtn.style.borderColor = 'var(--danger-color)';

        // Show toast
        showToast('Added to favorites!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        favoriteBtn.style.background = 'var(--white)';
        favoriteBtn.style.color = 'var(--gray)';
        favoriteBtn.style.borderColor = 'var(--gray-light)';

        showToast('Removed from favorites', 'info');
    }
});

shareBtn.addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'Modern Villa in Saravanampatti',
            text: 'Check out this amazing property!',
            url: window.location.href
        }).catch(err => console.log('Share failed', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success');
    }
});

printBtn.addEventListener('click', () => {
    window.print();
});

// Contact Buttons
const callBtn = document.querySelector('.contact-buttons .btn-outline:nth-child(1)');
const videoCallBtn = document.querySelector('.contact-buttons .btn-outline:nth-child(2)');
const scheduleVisitBtn = document.querySelector('.contact-buttons .btn-outline:nth-child(3)');

callBtn.addEventListener('click', () => {
    window.location.href = 'tel:+919876543210';
});

videoCallBtn.addEventListener('click', () => {
    alert('Video call feature would be integrated with WebRTC or Zoom API');
});

scheduleVisitBtn.addEventListener('click', () => {
    alert('Schedule visit modal would open here');
});

// Report Property
const reportCard = document.querySelector('.report-card');
if (reportCard) {
    reportCard.addEventListener('click', () => {
        const reason = prompt('Please enter the reason for reporting this property:');
        if (reason) {
            alert('Thank you for your report. We will review it shortly.');
        }
    });
}

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Toast notification function (if not already in main script.js)
if (typeof showToast === 'undefined') {
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--${type === 'success' ? 'success' : type === 'info' ? 'primary' : 'warning'}-color);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Animate on scroll for detail cards
const detailCards = document.querySelectorAll('.detail-card');
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

detailCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
    observer.observe(card);
});

console.log('Property Detail Page Loaded');
