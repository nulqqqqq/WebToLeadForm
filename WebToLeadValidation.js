class WebToLeadForm {
    constructor() {
        this.form = document.getElementById('webToLeadForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.init();
    }

    init() {
        this.form.addEventListener('input', this.validateForm.bind(this));
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        this.validateForm();
    }

    validateForm() {
        const fields = [
            'company',
            'first_name',
            'last_name',
            'email',
            'phone',
            'product_code'
        ];

        let isValid = true;

        fields.forEach(field => {
            const element = document.getElementById(field);
            const errorElement = document.getElementById(field + '_error');
            
            if (element) {
                const fieldValid = this.validateField(field, element.value);
                this.toggleError(element, errorElement, fieldValid);
                
                if (!fieldValid) {
                    isValid = false;
                }
            }
        });

        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            isValid = false;
        }

        this.submitBtn.disabled = !isValid;
        return isValid;
    }

    validateField(fieldName, value) {
        switch (fieldName) {
            case 'company':
                return value.trim().length > 0;
            
            case 'first_name':
            case 'last_name':
                return value.trim().length >= 2;
            
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            
            case 'phone':
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                return phoneRegex.test(value.replace(/\s/g, ''));
            
            case 'product_code':
                return value !== '';
            
            default:
                return true;
        }
    }

    toggleError(element, errorElement, isValid) {
        if (isValid) {
            element.classList.remove('error');
            if (errorElement) errorElement.style.display = 'none';
        } else {
            element.classList.add('error');
            if (errorElement) errorElement.style.display = 'block';
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            alert('Пожалуйста, заполните все поля правильно и пройдите проверку reCAPTCHA.');
            return;
        }

        this.submitBtn.disabled = true;
        this.submitBtn.value = 'Отправка...';

        try {
            this.updateCaptchaTimestamp();
            
            this.form.submit();
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
            this.submitBtn.disabled = false;
            this.submitBtn.value = 'Отправить';
        }
    }

    updateCaptchaTimestamp() {
        var response = document.getElementById("g-recaptcha-response"); 
        if (response == null || response.value.trim() == "") {
            var elems = JSON.parse(document.getElementsByName("captcha_settings")[0].value);
            elems["ts"] = JSON.stringify(new Date().getTime());
            document.getElementsByName("captcha_settings")[0].value = JSON.stringify(elems);
        }
    }
}

function recaptchaCallback() {
    const form = document.getElementById('webToLeadForm');
    if (form) {
        form.dispatchEvent(new Event('input'));
    }
}

function timestamp() { 
    var response = document.getElementById("g-recaptcha-response"); 
    if (response == null || response.value.trim() == "") {
        var elems = JSON.parse(document.getElementsByName("captcha_settings")[0].value);
        elems["ts"] = JSON.stringify(new Date().getTime());
        document.getElementsByName("captcha_settings")[0].value = JSON.stringify(elems);
    } 
}

document.addEventListener('DOMContentLoaded', function() {
    new WebToLeadForm();
    setInterval(timestamp, 500);
});