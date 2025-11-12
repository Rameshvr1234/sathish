// Services Page JavaScript

// Service Tabs Switching
const serviceTabs = document.querySelectorAll('.service-tab');
const serviceSections = document.querySelectorAll('.service-section');

serviceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        serviceTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        // Hide all sections
        serviceSections.forEach(section => section.classList.remove('active'));
        // Show selected section
        const serviceId = tab.getAttribute('data-service');
        document.getElementById(serviceId).classList.add('active');

        // Smooth scroll to content
        document.querySelector('.services-content').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// EMI Calculator
const loanAmountSlider = document.getElementById('loanAmount');
const interestRateSlider = document.getElementById('interestRate');
const loanTenureSlider = document.getElementById('loanTenure');

const loanAmountValue = document.getElementById('loanAmountValue');
const interestRateValue = document.getElementById('interestRateValue');
const loanTenureValue = document.getElementById('loanTenureValue');

const monthlyEMI = document.getElementById('monthlyEMI');
const totalInterest = document.getElementById('totalInterest');
const totalPayment = document.getElementById('totalPayment');

function calculateEMI() {
    const principal = parseInt(loanAmountSlider.value);
    const rate = parseFloat(interestRateSlider.value);
    const tenure = parseInt(loanTenureSlider.value);

    // Update slider values
    loanAmountValue.textContent = `₹${(principal / 100000).toFixed(0)} Lakh`;
    interestRateValue.textContent = `${rate}%`;
    loanTenureValue.textContent = `${tenure} Years`;

    // Calculate EMI
    const monthlyRate = rate / (12 * 100);
    const months = tenure * 12;

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);

    const totalPaymentAmount = emi * months;
    const totalInterestAmount = totalPaymentAmount - principal;

    // Update display
    monthlyEMI.textContent = `₹${Math.round(emi).toLocaleString('en-IN')}`;
    totalInterest.textContent = `₹${Math.round(totalInterestAmount).toLocaleString('en-IN')}`;
    totalPayment.textContent = `₹${Math.round(totalPaymentAmount).toLocaleString('en-IN')}`;
}

// Add event listeners to sliders
if (loanAmountSlider) {
    loanAmountSlider.addEventListener('input', calculateEMI);
    interestRateSlider.addEventListener('input', calculateEMI);
    loanTenureSlider.addEventListener('input', calculateEMI);

    // Initial calculation
    calculateEMI();
}

// Book Now Buttons
const bookButtons = document.querySelectorAll('.package-card .btn-primary, .package-card .btn-outline');

bookButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const packageCard = button.closest('.package-card');
        const serviceName = packageCard.querySelector('h3').textContent;
        const price = packageCard.querySelector('.package-price').textContent;

        // In real implementation, this would open a booking modal
        if (button.textContent.includes('Get Quote')) {
            alert(`Request for quote: ${serviceName}\n\nOur team will contact you shortly with a detailed quotation.`);
        } else {
            alert(`Booking: ${serviceName}\nPrice: ${price}\n\nRedirecting to booking form...`);
        }
    });
});

// Bank Partner Apply Buttons
const partnerButtons = document.querySelectorAll('.partner-card .btn-outline');

partnerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const bankName = button.closest('.partner-card').querySelector('.partner-logo').textContent;
        alert(`Apply for loan with ${bankName}\n\nYou will be redirected to the loan application form.`);
    });
});

// Smooth scrolling for anchor links
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

// Animate package cards on scroll
const packageCards = document.querySelectorAll('.package-card');
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

packageCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease-out ${index * 0.05}s`;
    observer.observe(card);
});

console.log('Services Page Loaded');
