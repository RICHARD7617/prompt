// Generate a unique reference ID
function generateRefId() {
    return 'REF' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Validate M-Pesa PIN format
function isValidPin(pin) {
    const pinRegex = /^[0-9]{4}$/;
    return pinRegex.test(pin);
}

// Handle form submission
document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get PIN value
    const mpesaPin = document.getElementById('mpesaPin').value.trim();

    // Validation
    if (!isValidPin(mpesaPin)) {
        showAlert('Please enter a valid 4-digit M-Pesa PIN', 'error');
        return;
    }

    // Process payment
    processPayment(mpesaPin);
});

function processPayment(mpesaPin) {
    const button = document.querySelector('.btn-primary');
    const originalText = button.textContent;

    // Show loading state
    button.disabled = true;
    button.textContent = 'Processing...';

    // Simulate payment processing (2-3 seconds)
    setTimeout(() => {
        const refId = generateRefId();
        
        // Hide form and show success message
        document.getElementById('paymentForm').style.display = 'none';
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('refId').textContent = refId;

        // Log payment details (in real scenario, send to server)
        console.log('M-Pesa Payment Processed:', {
            amount: 'KSH 30',
            reference: refId,
            timestamp: new Date().toISOString()
        });

        // You can send this data to your backend
        sendPaymentToServer({
            amount: 30,
            currency: 'KSH',
            reference: refId,
            paymentMethod: 'M-Pesa',
            recipientNumber: '254746630940',
            timestamp: new Date().toISOString()
        });
    }, 2000);
}

function resetForm() {
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentForm').style.display = 'block';
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('mpesaPin').focus();
}

function showAlert(message, type) {
    // Create a simple alert (you can enhance this with a modal)
    alert(message);
}

// Send payment data to server (replace with your actual endpoint)
function sendPaymentToServer(paymentData) {
    // Example using fetch API
    // Uncomment and modify the URL to your actual backend endpoint
    
    /*
    fetch('/api/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Payment confirmed by server:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Payment processed locally (server not configured)', 'info');
    });
    */

    console.log('Payment data ready to send:', paymentData);
}

// Real-time PIN validation
document.getElementById('mpesaPin').addEventListener('input', function() {
    // Convert to numbers only
    this.value = this.value.replace(/[^0-9]/g, '');
    
    // Validate length
    if (this.value.length === 4) {
        this.classList.remove('error');
    }
});

document.getElementById('mpesaPin').addEventListener('blur', function() {
    if (this.value && !isValidPin(this.value)) {
        this.classList.add('error');
    }
});

// Focus on PIN input on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mpesaPin').focus();
});

// Add error styling
const style = document.createElement('style');
style.textContent = `
    input.error {
        border-color: #f44336 !important;
        background-color: #ffebee !important;
    }
`;
document.head.appendChild(style);

