/**
 * navigation.js
 * Handles the navigation bar: scroll effects, active-section tracking,
 * smooth-scroll anchor links, and the mobile hamburger menu.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    /* -------------------------------------------------- *
     *  Cache DOM references
     * -------------------------------------------------- */
    var navbar    = document.getElementById('navbar');
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks  = document.querySelector('.nav-links');
    var allLinks  = document.querySelectorAll('.nav-links a');
    var sections  = document.querySelectorAll('section[id]');

    var NAVBAR_HEIGHT = 80; // px offset for smooth scroll

    /* ================================================== *
     *  1. Scroll Effect — add/remove .scrolled on navbar
     * ================================================== */
    var scrollTicking = false;

    function onScroll() {
      if (!navbar) return;

      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    /** Throttle scroll handler to one call per animation frame. */
    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        requestAnimationFrame(function () {
          onScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Run once on load in case the page is already scrolled
    onScroll();

    /* ================================================== *
     *  2. Active Section Tracking via IntersectionObserver
     * ================================================== */
    if ('IntersectionObserver' in window && sections.length && allLinks.length) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');

            // Remove .active from every nav link
            allLinks.forEach(function (link) {
              link.classList.remove('active');
            });

            // Add .active to the matching link
            var matchingLink = document.querySelector('.nav-links a[href="#' + id + '"]');
            if (matchingLink) {
              matchingLink.classList.add('active');
            }
          }
        });
      }, {
        // A section must be at least 30% visible to count
        threshold: 0.3
      });

      sections.forEach(function (section) {
        sectionObserver.observe(section);
      });
    }

    /* ================================================== *
     *  3. Smooth Scroll for Nav Links
     * ================================================== */
    allLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return; // external link

        e.preventDefault();

        var target = document.getElementById(href.substring(1));
        if (!target) return;

        var top = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_HEIGHT;

        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });

        // On mobile, close the menu after selecting a link
        closeMenu();
      });
    });

    /* ================================================== *
     *  4. Mobile Menu Toggle
     * ================================================== */

    /** Open or close the mobile menu. */
    function toggleMenu() {
      if (!navToggle || !navLinks) return;

      var isOpen = navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');

      // Prevent background scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    /** Explicitly close the mobile menu. */
    function closeMenu() {
      if (!navToggle || !navLinks) return;

      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (navToggle) {
      navToggle.addEventListener('click', function (e) {
        e.stopPropagation(); // prevent the outside-click listener from firing
        toggleMenu();
      });
    }

    /* ---- Close on outside click ---- */
    document.addEventListener('click', function (e) {
      if (!navLinks || !navLinks.classList.contains('active')) return;

      // If the click target is inside the menu or the toggle, ignore
      var insideMenu   = navLinks.contains(e.target);
      var insideToggle = navToggle && navToggle.contains(e.target);

      if (!insideMenu && !insideToggle) {
        closeMenu();
      }
    });

    /* ---- Close on Escape key ---- */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        closeMenu();
      }
    });
  });
})();
