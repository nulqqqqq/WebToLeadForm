document.getElementById('webToLeadForm').addEventListener('submit', function(e) {
    const emailField = document.getElementById('email');
    const emailValue = emailField.value.trim();

    if (!emailValue.toLowerCase().endsWith('.com')) {
        alert('Please enter an email address with .com domain only');
        emailField.focus();
        e.preventDefault();
        return false;
    }
    
    if (!latinEmailPattern.test(emailValue)) {
        alert('Please use only Latin characters and valid email format (user@domain.com)');
        emailField.focus();
        e.preventDefault();
        return false;
    }

function timestamp() { 
    const response = document.getElementById("g-recaptcha-response"); 
    if (response == null || response.value.trim() === "") {
        const captchaSettings = document.getElementsByName("captcha_settings")[0];
        if (captchaSettings) {
            try {
                const elems = JSON.parse(captchaSettings.value);
                elems["ts"] = JSON.stringify(new Date().getTime());
                captchaSettings.value = JSON.stringify(elems);
            } catch (error) {
                console.error('Error updating captcha timestamp:', error);
            }
        }
    } 
}

document.addEventListener('DOMContentLoaded', function() {
    setInterval(timestamp, 500);
    
    const productSelect = document.getElementById('product_select');
    const productField = document.getElementById('00Ng5000003Yefd');
    const form = document.getElementById('webToLeadForm');
    const submitBtn = document.getElementById('submitBtn');

    if (productSelect && productField) {
        productSelect.addEventListener('change', function() {
            const productCode = this.value;
            productField.value = productCode;
            console.log('Product code selected:', productCode);
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            if (!productField || !productField.value) {
                e.preventDefault();
                alert('Please select the product');
                return;
            }
            
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                e.preventDefault();
                alert('Please pass the reCAPTCHA check.');
                return;
            }
            
        });
    }
}); });