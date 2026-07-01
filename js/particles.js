/**
 * particles.js
 * Lightweight floating particle canvas animation for the hero section.
 * Renders translucent circles that drift and connect with faint lines
 * when close to each other, creating a constellation-like network effect.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    /* -------------------------------------------------- *
     *  Canvas & Context
     * -------------------------------------------------- */
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* -------------------------------------------------- *
     *  Configuration
     * -------------------------------------------------- */
    var PARTICLE_COUNT = 70;            // 60-80 range, 70 is a nice middle ground
    var MIN_RADIUS     = 1;
    var MAX_RADIUS     = 3;
    var MIN_OPACITY    = 0.1;
    var MAX_OPACITY    = 0.4;
    var MIN_SPEED      = 0.2;
    var MAX_SPEED      = 0.8;
    var CONNECT_DIST   = 120;           // px – draw a line when closer
    var CONNECT_DIST2  = CONNECT_DIST * CONNECT_DIST; // squared for fast comparison

    /* -------------------------------------------------- *
     *  State
     * -------------------------------------------------- */
    var particles  = [];
    var animId     = null;
    var isPaused   = false;
    var resizeTimer = null;

    /* -------------------------------------------------- *
     *  Utility helpers
     * -------------------------------------------------- */
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    /* -------------------------------------------------- *
     *  Resize handler (debounced 200ms)
     * -------------------------------------------------- */
    function setCanvasSize() {
      canvas.width  = canvas.parentElement ? canvas.parentElement.offsetWidth  : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        setCanvasSize();
        initParticles(); // re-scatter within new bounds
      }, 200);
    }

    window.addEventListener('resize', onResize);
    setCanvasSize();

    /* -------------------------------------------------- *
     *  Particle constructor
     * -------------------------------------------------- */
    function Particle() {
      this.x       = rand(0, canvas.width);
      this.y       = rand(0, canvas.height);
      this.radius  = rand(MIN_RADIUS, MAX_RADIUS);
      this.opacity = rand(MIN_OPACITY, MAX_OPACITY);

      // Random direction vector
      var angle  = rand(0, Math.PI * 2);
      var speed  = rand(MIN_SPEED, MAX_SPEED);
      this.vx    = Math.cos(angle) * speed;
      this.vy    = Math.sin(angle) * speed;

      // Slight blue tint for some particles, pure white for others
      var blue   = Math.random() > 0.5;
      this.color = blue
        ? 'rgba(160, 200, 255, ' + this.opacity + ')'
        : 'rgba(255, 255, 255, ' + this.opacity + ')';
    }

    /**
     * Move the particle and wrap around edges so
     * particles never disappear off-screen.
     */
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap horizontally
      if (this.x < -this.radius) {
        this.x = canvas.width + this.radius;
      } else if (this.x > canvas.width + this.radius) {
        this.x = -this.radius;
      }

      // Wrap vertically
      if (this.y < -this.radius) {
        this.y = canvas.height + this.radius;
      } else if (this.y > canvas.height + this.radius) {
        this.y = -this.radius;
      }
    };

    /** Draw the particle as a filled circle. */
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    };

    /* -------------------------------------------------- *
     *  Initialise / re-initialise particles
     * -------------------------------------------------- */
    function initParticles() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    /* -------------------------------------------------- *
     *  Draw connecting lines between nearby particles
     * -------------------------------------------------- */
    function connectParticles() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist2 = dx * dx + dy * dy;

          if (dist2 < CONNECT_DIST2) {
            // Opacity falls off linearly with distance
            var dist    = Math.sqrt(dist2);
            var opacity = (1 - dist / CONNECT_DIST) * 0.25;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(160, 200, 255, ' + opacity + ')';
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    /* -------------------------------------------------- *
     *  Animation loop
     * -------------------------------------------------- */
    function animate() {
      if (isPaused) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      connectParticles();

      animId = requestAnimationFrame(animate);
    }

    // Kick off
    animate();

    /* -------------------------------------------------- *
     *  Pause when tab is hidden to save CPU/battery
     * -------------------------------------------------- */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        isPaused = true;
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      } else {
        isPaused = false;
        animate();
      }
    });
  });
})();
