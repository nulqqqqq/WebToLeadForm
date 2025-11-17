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
            'product'
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

        const recaptchaResponse = window.grecaptcha && window.grecaptcha.getResponse ? window.grecaptcha.getResponse() : '';
        console.log('reCAPTCHA valid:', !!recaptchaResponse);
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
                const cleanPhone = value.replace(/\D/g, '');
                return cleanPhone.length >= 9;
            
            case 'product':
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

        this.addProductCodeField();

        this.submitBtn.disabled = true;
        this.submitBtn.value = 'Отправка...';

        try {
            this.updateCaptchaTimestamp();
            
            const formElement = document.getElementById('webToLeadForm');
            if (formElement && typeof formElement.submit === 'function') {
                formElement.submit();
            } else {
                this.submitFormProgrammatically();
            }
            
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
            this.submitBtn.disabled = false;
            this.submitBtn.value = 'Отправить';
        }
    }

    submitFormProgrammatically() {
        const form = document.getElementById('webToLeadForm');
        if (!form) return;

        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = 'https://nulqqqqq.github.io/WebToLeadForm/';
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
            this.submitBtn.disabled = false;
            this.submitBtn.value = 'Отправить';
        });
    }

    addProductCodeField() {
        const existingField = document.querySelector('input[name="product_code"]');
        if (existingField) {
            existingField.remove();
        }

        const productSelect = document.getElementById('product');
        const productCode = productSelect.value;

        const productCodeField = document.createElement('input');
        productCodeField.type = 'hidden';
        productCodeField.name = 'product_code';
        productCodeField.value = productCode;

        this.form.appendChild(productCodeField);
        
        console.log('Added product_code field:', productCode);
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
    console.log('reCAPTCHA completed');
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