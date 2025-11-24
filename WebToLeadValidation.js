function timestamp() { 
    const captchaSettings = document.getElementsByName("captcha_settings")[0];
    if (captchaSettings) {
        try {
            const elems = JSON.parse(captchaSettings.value);
            elems["ts"] = new Date().getTime(); 
            captchaSettings.value = JSON.stringify(elems);
        } catch (error) {
            console.error('Error updating captcha timestamp:', error);
        }
    } 
}


document.addEventListener('DOMContentLoaded', function() {

    const productSelect = document.getElementById('product_select');
    const productField = document.getElementById('00Ng5000003Yefd');
    const form = document.getElementById('webToLeadForm');


    if (productSelect && productField) {
        productField.value = productSelect.value;
        
        productSelect.addEventListener('change', function() {
            const productCode = this.value;
            productField.value = productCode;
            console.log('Product code selected:', productCode);
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
ы
            timestamp();
            
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
            
            console.log("All checks have been completed. The form will be sent.");
        });
    }
});