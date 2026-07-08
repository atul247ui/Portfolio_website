/**
 * main.js
 * Global initialisations: scroll-reveal animations, back-to-top button,
 * contact form validation with toast notifications, and footer year.
 */

emailjs.init({
    publicKey: "YOUR_PUBLIC_KEY"
});


(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ================================================== *
     *  1. Scroll Reveal (one-time entrance animations)
     * ================================================== */
    var revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealElements.length) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // animate only once
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    }

    /* ================================================== *
     *  2. Back to Top Button
     * ================================================== */
    var backToTop = document.getElementById('back-to-top');

    if (backToTop) {
      backToTop.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ================================================== *
     *  3. Contact Form — validation & toast notification
     * ================================================== */
    var contactForm = document.getElementById('contact-form');

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Grab field values and trim whitespace
        var nameField    = contactForm.querySelector('[name="name"]');
        var emailField   = contactForm.querySelector('[name="email"]');
        var messageField = contactForm.querySelector('[name="message"]');

        var name    = nameField    ? nameField.value.trim()    : '';
        var email   = emailField   ? emailField.value.trim()   : '';
        var message = messageField ? messageField.value.trim() : '';

        /* ---------- Basic validation ---------- */
        if (!name) {
          showToast('Please enter your name.', 'error');
          return;
        }
        if (!email || !isValidEmail(email)) {
          showToast('Please enter a valid email address.', 'error');
          return;
        }
        if (!message) {
          showToast('Please enter a message.', 'error');
          return;
        }

        /* ---------- Success ---------- */
        showToast('Message sent successfully! 🚀', 'success');
        contactForm.reset();
      });
    }

    /**
     * Minimal email check: non-empty string with @ and a dot after @.
     * @param {string} email
     * @returns {boolean}
     */
    function isValidEmail(email) {
      var atIndex  = email.indexOf('@');
      if (atIndex < 1) return false; // @ must exist and not be first char

      var domain = email.substring(atIndex + 1);
      var dotIndex = domain.indexOf('.');
      // dot must exist and not be first/last char in domain part
      return dotIndex > 0 && dotIndex < domain.length - 1;
    }

    /**
     * Display a toast notification at the bottom-right of the viewport.
     * Auto-dismisses after 3 seconds.
     *
     * @param {string} message  The text to display.
     * @param {string} type     'success' or 'error' — controls accent colour.
     */
    function showToast(message, type) {
      // Create the toast element
      var toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.setAttribute('role', 'alert');

      // Accent border colour
      var borderColor = type === 'success'
        ? '#00e676'   // green for success
        : '#ff5252';  // red for errors

      // Apply glass-card styling inline so it works without extra CSS
      toast.style.cssText = [
        'position: fixed',
        'bottom: 32px',
        'right: 32px',
        'z-index: 10000',
        'padding: 16px 24px',
        'min-width: 280px',
        'max-width: 420px',
        'border-radius: 12px',
        'border-left: 4px solid ' + borderColor,
        'background: rgba(15, 15, 35, 0.85)',
        'backdrop-filter: blur(16px)',
        '-webkit-backdrop-filter: blur(16px)',
        'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4)',
        'color: #e0e0e0',
        'font-family: inherit',
        'font-size: 0.95rem',
        'line-height: 1.5',
        'opacity: 0',
        'transform: translateY(20px)',
        'transition: opacity 0.35s ease, transform 0.35s ease'
      ].join('; ');

      toast.textContent = message;
      document.body.appendChild(toast);

      // Trigger entrance animation on next frame
      requestAnimationFrame(function () {
        toast.style.opacity   = '1';
        toast.style.transform = 'translateY(0)';
      });

      // Auto-dismiss after 3 seconds
      setTimeout(function () {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateY(20px)';

        // Remove from DOM after the fade-out transition completes
        setTimeout(function () {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 400);
      }, 3000);
    }

    /* ================================================== *
     *  4. Footer Year
     * ================================================== */
    var yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  });
})();
