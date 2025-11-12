// Real-time signup validation (by-TN) – no 'var', JS linked with 'defer'
/**
 * validateField(inputEl, errorEl, customCheck?)
 * - Clears prior errors/classes
 * - Runs customCheck (optional) to setCustomValidity with custom logic
 * - Runs native .checkValidity()
 * - Updates error <span> and .valid/.invalid classes
 */
const validateField = (inputEl, errorEl, customCheck) => {
  // Clear previous state
  inputEl.setCustomValidity('');
  inputEl.classList.remove('valid', 'invalid');
  errorEl.textContent = '';

  // If empty & required, set a custom message early for clearer UX
  if (inputEl.required && !inputEl.value.trim()) {
    inputEl.setCustomValidity('This field is required.');
  }

  // Run any custom logic (e.g., username rules, matching passwords)
  if (typeof customCheck === 'function') {
    customCheck(inputEl);
  }

  // Trigger built-in validation
  if (!inputEl.checkValidity()) {
    errorEl.textContent = inputEl.validationMessage;
    inputEl.classList.add('invalid');
    return false;
  } else {
    inputEl.classList.add('valid');
    return true;
  }
};

// ---------- Specific validators ----------
const usernameRules = (inputEl) => {
  // If already invalid from required, skip extra messages
  if (!inputEl.value.trim()) return;
  const re = /^[A-Za-z0-9_]{3,16}$/;
  if (!re.test(inputEl.value)) {
    inputEl.setCustomValidity(
      '3–16 chars; letters, numbers, and underscores only.'
    );
  }
};

const emailRules = (inputEl) => {
  if (!inputEl.value.trim()) return;
  // Let type="email" do the heavy lifting; add friendly copy if invalid
  if (inputEl.validity.typeMismatch) {
    inputEl.setCustomValidity('Please enter a valid email address.');
  }
};

const passwordRules = (inputEl) => {
  if (!inputEl.value.trim()) return;
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+=]{8,}$/;
  if (!re.test(inputEl.value)) {
    inputEl.setCustomValidity(
      'Min 8 chars with at least 1 letter and 1 number.'
    );
  }
};

const confirmPasswordRules = (confirmEl) => {
  const pwdEl = document.getElementById('password');
  if (!confirmEl.value.trim()) return;
  if (confirmEl.value !== pwdEl.value) {
    confirmEl.setCustomValidity('Passwords do not match.');
  }
};

// ---------- Wire up events ----------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const successMsg = document.getElementById('successMsg');

  // Inputs + error spans
  const username = document.getElementById('username');
  const usernameErr = document.getElementById('usernameError');

  const email = document.getElementById('email');
  const emailErr = document.getElementById('emailError');

  const password = document.getElementById('password');
  const passwordErr = document.getElementById('passwordError');

  const confirmPassword = document.getElementById('confirmPassword');
  const confirmPasswordErr = document.getElementById('confirmPasswordError');

  // Real-time validation listeners
  username.addEventListener('input', () =>
    validateField(username, usernameErr, usernameRules)
  );

  email.addEventListener('input', () =>
    validateField(email, emailErr, emailRules)
  );

  password.addEventListener('input', () => {
    validateField(password, passwordErr, passwordRules);
    // Also re-check confirm field if user changes main password
    if (confirmPassword.value) {
      validateField(confirmPassword, confirmPasswordErr, confirmPasswordRules);
    }
  });

  confirmPassword.addEventListener('input', () =>
    validateField(confirmPassword, confirmPasswordErr, confirmPasswordRules)
  );

  // Submit handler: re-validate all; show success or prompt to fix errors
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.textContent = '';

    const uOK = validateField(username, usernameErr, usernameRules);
    const eOK = validateField(email, emailErr, emailRules);
    const pOK = validateField(password, passwordErr, passwordRules);
    const cOK = validateField(confirmPassword, confirmPasswordErr, confirmPasswordRules);

    if (uOK && eOK && pOK && cOK) {
      successMsg.textContent = '✅ Account created successfully!';
      form.reset();

      // Clear classes so the next typing starts fresh
      [username, email, password, confirmPassword].forEach((el) =>
        el.classList.remove('valid', 'invalid')
      );
    } else {
      alert('Please fix the highlighted errors and try again.');
    }
  });
});