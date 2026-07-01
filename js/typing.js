/**
 * typing.js
 * Typing / deleting animation that cycles through an array of role strings,
 * creating the classic "typewriter" effect in the hero section.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    /* -------------------------------------------------- *
     *  Target element
     * -------------------------------------------------- */
    var typingEl = document.getElementById('typing-text');
    if (!typingEl) return;

    /* -------------------------------------------------- *
     *  Configuration
     * -------------------------------------------------- */
    var strings = [
      'Full-Stack Developer',
      'Problem Solver',
      'UI/UX Enthusiast',
      'Tech Explorer',
      'Open Source Contributor'
    ];

    var TYPE_SPEED   = 80;    // ms per character typed
    var DELETE_SPEED  = 40;   // ms per character deleted
    var PAUSE_AFTER_TYPE   = 2000; // ms to wait with full string visible
    var PAUSE_AFTER_DELETE = 500;  // ms to wait before typing next string

    /* -------------------------------------------------- *
     *  State
     * -------------------------------------------------- */
    var stringIndex = 0;   // which string we are on
    var charIndex   = 0;   // how many characters are currently shown
    var isDeleting  = false;

    /* -------------------------------------------------- *
     *  Core typing function (self-scheduling via setTimeout)
     * -------------------------------------------------- */
    function type() {
      var currentString = strings[stringIndex];

      if (isDeleting) {
        // Remove one character
        charIndex--;
        typingEl.textContent = currentString.substring(0, charIndex);

        if (charIndex === 0) {
          // Finished deleting — move to the next string
          isDeleting = false;
          stringIndex = (stringIndex + 1) % strings.length;
          setTimeout(type, PAUSE_AFTER_DELETE);
          return;
        }

        setTimeout(type, DELETE_SPEED);
      } else {
        // Add one character
        charIndex++;
        typingEl.textContent = currentString.substring(0, charIndex);

        if (charIndex === currentString.length) {
          // Finished typing — pause, then start deleting
          isDeleting = true;
          setTimeout(type, PAUSE_AFTER_TYPE);
          return;
        }

        setTimeout(type, TYPE_SPEED);
      }
    }

    // Begin the animation
    type();
  });
})();
