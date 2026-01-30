/**
 * Enhanced Form Validation
 * Real-time validation with visual feedback
 */

(function() {
    'use strict';

    // Validation patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\+\-\(\)]+$/,
        name: /^[a-zA-ZäöüÄÖÜß\s\-]{2,}$/
    };

    // Error messages
    const messages = {
        required: 'Dieses Feld ist erforderlich',
        email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        phone: 'Bitte geben Sie eine gültige Telefonnummer ein',
        name: 'Bitte geben Sie einen gültigen Namen ein',
        minLength: (min) => `Mindestens ${min} Zeichen erforderlich`
    };

    // Create validation feedback element
    const createFeedback = (message, isValid) => {
        const feedback = document.createElement('div');
        feedback.className = `form-feedback ${isValid ? 'valid' : 'invalid'}`;
        feedback.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                ${isValid
                    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>'
                    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'}
            </svg>
            <span>${message}</span>
        `;
        return feedback;
    };

    // Validate single field
    const validateField = (input) => {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return true;

        // Remove existing feedback
        const existingFeedback = formGroup.querySelector('.form-feedback');
        if (existingFeedback) existingFeedback.remove();

        const value = input.value.trim();
        const type = input.type;
        const isRequired = input.hasAttribute('required');
        let isValid = true;
        let message = '';

        // Required check
        if (isRequired && !value) {
            isValid = false;
            message = messages.required;
        }
        // Email validation
        else if (type === 'email' && value && !patterns.email.test(value)) {
            isValid = false;
            message = messages.email;
        }
        // Phone validation
        else if (type === 'tel' && value && !patterns.phone.test(value)) {
            isValid = false;
            message = messages.phone;
        }
        // Name validation
        else if (input.name === 'name' && value && !patterns.name.test(value)) {
            isValid = false;
            message = messages.name;
        }
        // Textarea min length
        else if (input.tagName === 'TEXTAREA' && value && value.length < 10) {
            isValid = false;
            message = messages.minLength(10);
        }
        // Valid input
        else if (value) {
            isValid = true;
            message = 'Sieht gut aus!';
        }

        // Update input styling
        if (value) {
            input.classList.toggle('valid', isValid);
            input.classList.toggle('invalid', !isValid);
            input.setAttribute('aria-invalid', (!isValid).toString());

            // Add feedback
            if (message) {
                const feedback = createFeedback(message, isValid);
                formGroup.appendChild(feedback);
            }
        } else {
            input.classList.remove('valid', 'invalid');
            input.removeAttribute('aria-invalid');
        }

        return isValid;
    };

    // Initialize form validation
    const initFormValidation = () => {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            const inputs = form.querySelectorAll('input:not([type="checkbox"]), textarea, select');

            // Real-time validation on blur
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));

                // Live validation while typing (debounced)
                let timeout;
                input.addEventListener('input', () => {
                    clearTimeout(timeout);
                    if (input.classList.contains('invalid') || input.classList.contains('valid')) {
                        timeout = setTimeout(() => validateField(input), 500);
                    }
                });

                // Add aria-describedby for accessibility
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    const label = formGroup.querySelector('label');
                    if (label && !label.id) {
                        const id = `label-${Math.random().toString(36).substr(2, 9)}`;
                        label.id = id;
                        input.setAttribute('aria-labelledby', id);
                    }
                }
            });

            // Form submission validation
            form.addEventListener('submit', (e) => {
                let isFormValid = true;
                const firstInvalidInput = null;

                inputs.forEach(input => {
                    const isValid = validateField(input);
                    if (!isValid) {
                        isFormValid = false;
                        if (!firstInvalidInput) {
                            firstInvalidInput = input;
                        }
                    }
                });

                if (!isFormValid) {
                    e.preventDefault();

                    // Focus first invalid input
                    if (firstInvalidInput) {
                        firstInvalidInput.focus();
                        firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Show error message
                    showFormMessage('Bitte überprüfen Sie Ihre Eingaben', 'error');
                } else {
                    // Show loading state
                    const submitBtn = form.querySelector('[type="submit"]');
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = `
                            <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle>
                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
                            </svg>
                            <span>Wird gesendet...</span>
                        `;
                    }
                }
            });
        });
    };

    // Show form-level message
    const showFormMessage = (message, type = 'success') => {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.setAttribute('role', 'alert');
        messageEl.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                ${type === 'success'
                    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
                    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'}
            </svg>
            <span>${message}</span>
        `;

        const form = document.querySelector('form');
        if (form) {
            form.insertBefore(messageEl, form.firstChild);
            setTimeout(() => {
                messageEl.style.opacity = '0';
                setTimeout(() => messageEl.remove(), 300);
            }, 5000);
        }
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormValidation);
    } else {
        initFormValidation();
    }
})();
