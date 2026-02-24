// Generate a unique reference ID
function generateRefId() {
    return 'REF' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Validate M-Pesa phone number format
function isValidPhoneNumber(phone) {
    const phoneRegex = /^254[0-9]{9}$/;
    return phoneRegex.test(phone);
}

// Handle form submission
document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get phone number
    const mpesaPhone = document.getElementById('mpesaPhone').value.trim();

    // Validation
    if (!isValidPhoneNumber(mpesaPhone)) {
        showAlert('Please enter a valid phone number (format: 254XXXXXXXXX)', 'error');
        return;
    }

    // Process payment
    processPayment(mpesaPhone);
});

function processPayment(mpesaPhone) {
    const button = document.querySelector('.btn-primary');
    const originalText = button.textContent;

    // Show loading state
    button.disabled = true;
    button.textContent = 'Initiating Payment...';

    // Send request to backend to initiate payment with Pesapal
    initiateMpesaPayment(mpesaPhone)
        .then(response => {
            if (response.success) {
                const refId = response.reference || generateRefId();
                
                // Hide form and show redirect message
                document.getElementById('paymentForm').style.display = 'none';
                document.getElementById('successMessage').classList.remove('hidden');
                document.getElementById('refId').textContent = refId;

                // Update success message for Pesapal redirect
                const heading = document.querySelector('.success-message h2');
                if (heading) heading.textContent = 'Redirecting to Payment...';
                
                const desc = document.querySelector('.success-message p:first-of-type');
                if (desc) desc.textContent = 'You will be redirected to complete your payment securely with Pesapal';

                console.log('Payment initiated:', {
                    phone: mpesaPhone,
                    amount: 'KSH 30',
                    reference: refId,
                    timestamp: new Date().toISOString()
                });
            } else {
                showAlert(response.error || 'Failed to initiate payment. Please try again.', 'error');
                button.disabled = false;
                button.textContent = originalText;
            }
        })
        .catch(error => {
            console.error('Payment error:', error);
            showAlert('Error: ' + error.message, 'error');
            button.disabled = false;
            button.textContent = originalText;
        });
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

// Send payment data to backend to initiate Pesapal payment
function initiateMpesaPayment(phoneNumber) {
    // This calls your backend which uses Pesapal to process payment
    // Make sure your backend URL is correct
    
    return fetch('/api/pesapal/initiate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            amount: 30,
            currency: 'KSH',
            recipientNumber: '254746630940',
            timestamp: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Backend response:', data);
        
        if (data.success && data.paymentUrl) {
            // Redirect to Pesapal payment page
            setTimeout(() => {
                window.location.href = data.paymentUrl;
            }, 1500);
            
            return {
                success: true,
                reference: data.reference,
                message: 'Redirecting to payment...'
            };
        }
        
        return data;
    })
    .catch(error => {
        console.error('Network error:', error);
        showAlert('Error: ' + error.message, 'error');
        throw error;
    });
}

// Real-time phone number validation
document.getElementById('mpesaPhone').addEventListener('input', function() {
    // Allow only numbers
    this.value = this.value.replace(/[^0-9]/g, '');
    
    // Auto-format if valid length
    if (this.value.length === 12) {
        this.classList.remove('error');
    }
});

document.getElementById('mpesaPhone').addEventListener('blur', function() {
    if (this.value && !isValidPhoneNumber(this.value)) {
        this.classList.add('error');
    }
});

// Focus on phone input on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mpesaPhone').focus();
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

