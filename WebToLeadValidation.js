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
            'product' // Валидируем по ID поля в форме
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
                // Улучшенная валидация для белорусских номеров
                const phoneRegex = /^[\+]?375[0-9\s\-\(\)]{9,}$/;
                const cleanPhone = value.replace(/\s|\(|\)|-/g, '');
                return phoneRegex.test(cleanPhone);
            
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

        // Создаем скрытое поле для product_code перед отправкой
        this.addProductCodeField();

        this.submitBtn.disabled = true;
        this.submitBtn.value = 'Отправка...';

        try {
            this.updateCaptchaTimestamp();
            
            // Небольшая задержка для гарантии добавления поля
            setTimeout(() => {
                this.form.submit();
            }, 100);
            
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
            this.submitBtn.disabled = false;
            this.submitBtn.value = 'Отправить';
        }
    }

    addProductCodeField() {
        // Удаляем предыдущее скрытое поле если оно есть
        const existingField = document.querySelector('input[name="product_code"]');
        if (existingField) {
            existingField.remove();
        }

        // Получаем значение из select
        const productSelect = document.getElementById('product');
        const productCode = productSelect.value;

        // Создаем скрытое поле для product_code
        const productCodeField = document.createElement('input');
        productCodeField.type = 'hidden';
        productCodeField.name = 'product_code';
        productCodeField.value = productCode;

        // Добавляем поле в форму
        this.form.appendChild(productCodeField);
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