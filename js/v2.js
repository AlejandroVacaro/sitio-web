/**
 * Alejandro Vacaro - V2 Interactive Script
 * Pure Vanilla JavaScript:
 * - Scroll Progress Indicator (2px coral)
 * - Hero Photo 3D Tilt (rAF, desktop only, max 2deg)
 * - Horizontal Typography Scroll Sync
 * - "Cómo pienso" 7 Verbs Sticky Controller & Microinteractions
 * - Plot Twist Narrative Sequence
 * - "Lo que hago" Node Animation
 * - Mobile Navigation Menu
 * - Reveal Observer (IntersectionObserver)
 * - Form Validation & Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // =========================================================================
  // 1. SCROLL PROGRESS BAR (44)
  // =========================================================================
  const progressBar = document.getElementById('scroll-progress-bar');
  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // =========================================================================
  // 2. HERO PHOTO 3D TILT INTERACTION (16)
  // =========================================================================
  const heroPhotoWrapper = document.getElementById('hero-photo-wrapper');
  if (heroPhotoWrapper && isDesktopPointer && !prefersReducedMotion) {
    let rAFId = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    heroPhotoWrapper.addEventListener('mousemove', (e) => {
      const rect = heroPhotoWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max: rotateX 2deg, rotateY 2deg, translate 3px
      targetX = -((y - centerY) / centerY) * 2;
      targetY = ((x - centerX) / centerX) * 2;

      if (!rAFId) {
        rAFId = requestAnimationFrame(updateTilt);
      }
    });

    function updateTilt() {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      const transX = (currentY / 2) * 3;
      const transY = (-currentX / 2) * 3;

      heroPhotoWrapper.style.transform = `perspective(800px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translate(${transX.toFixed(1)}px, ${transY.toFixed(1)}px)`;

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rAFId = requestAnimationFrame(updateTilt);
      } else {
        rAFId = null;
      }
    }

    heroPhotoWrapper.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      heroPhotoWrapper.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
      heroPhotoWrapper.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translate(0px, 0px)';
      setTimeout(() => {
        heroPhotoWrapper.style.transition = '';
      }, 500);
    });
  }

  // =========================================================================
  // 3. HORIZONTAL TYPOGRAPHY SCROLL TRANSITION (18)
  // =========================================================================
  const scrollTypoStrip = document.getElementById('scroll-typography-content');
  if (scrollTypoStrip && !prefersReducedMotion) {
    let lastScrollY = window.scrollY;
    let typoOffset = 0;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Move slowly with scroll
      typoOffset -= delta * 0.45;
      scrollTypoStrip.style.transform = `translateX(${typoOffset}px)`;
    }, { passive: true });
  }

  // =========================================================================
  // 4. "CÓMO PIENSO" STICKY VERBS & MICROINTERACTIONS (20, 21, 22)
  // =========================================================================
  const stickyNumber = document.getElementById('sticky-verb-number');
  const stickyWord = document.getElementById('sticky-verb-word');
  const verbVisualContainer = document.getElementById('verb-micro-visual-container');
  const stepItems = document.querySelectorAll('.pienso-step-item');

  const verbMetadata = {
    ENTENDER: {
      number: '01',
      htmlVisual: '<div class="micro-entender-line"></div>'
    },
    PREGUNTAR: {
      number: '02',
      htmlVisual: '<div class="micro-preguntar-mark">?</div>'
    },
    CONECTAR: {
      number: '03',
      htmlVisual: '<div class="micro-conectar-wrap"><span class="micro-conectar-dot"></span><span class="micro-conectar-line"></span><span class="micro-conectar-dot"></span></div>'
    },
    ORDENAR: {
      number: '04',
      htmlVisual: '<div class="micro-ordenar-wrap"><div class="micro-ordenar-bar"></div><div class="micro-ordenar-bar"></div><div class="micro-ordenar-bar"></div></div>'
    },
    PROBAR: {
      number: '05',
      htmlVisual: '<div class="micro-probar-circle"></div>'
    },
    DESTRABAR: {
      number: '06',
      htmlVisual: '<div class="micro-destrabar-wrap"><div class="micro-destrabar-seg"></div><div class="micro-destrabar-seg"></div></div>'
    },
    CAMBIAR: {
      number: '07',
      htmlVisual: ''
    }
  };

  let currentActiveVerb = null;

  function setVerb(verbKey) {
    if (currentActiveVerb === verbKey) return;
    currentActiveVerb = verbKey;

    const data = verbMetadata[verbKey];
    if (!data) return;

    if (stickyWord) {
      stickyWord.style.opacity = '0';
      stickyWord.style.transform = 'translateY(-16px)';

      setTimeout(() => {
        stickyWord.textContent = verbKey;
        if (stickyNumber) stickyNumber.textContent = data.number;
        if (verbVisualContainer) verbVisualContainer.innerHTML = data.htmlVisual;

        // Specific handling for CAMBIAR (font transition)
        if (verbKey === 'CAMBIAR') {
          stickyWord.classList.add('is-cambiar-serif');
        } else {
          stickyWord.classList.remove('is-cambiar-serif');
        }

        stickyWord.style.opacity = '1';
        stickyWord.style.transform = 'translateY(0)';

        // Trigger micro-visual active animation
        setTimeout(() => {
          if (verbVisualContainer) {
            verbVisualContainer.classList.add('active-verb');
          }
        }, 30);
      }, 200);
    }
  }

  if (stepItems.length > 0 && 'IntersectionObserver' in window) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const verb = entry.target.getAttribute('data-verb');
          setVerb(verb);
        }
      });
    }, {
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    });

    stepItems.forEach(item => stepObserver.observe(item));
  }

  // =========================================================================
  // 5. PLOT TWIST NARRATIVE MOMENT (29, 30)
  // =========================================================================
  const twistContainer = document.getElementById('plot-twist-narrative');
  const twistStep1 = document.getElementById('twist-step-1');
  const twistStep2 = document.getElementById('twist-step-2');
  const twistStep3 = document.getElementById('twist-step-3');

  if (twistContainer && !prefersReducedMotion && window.innerWidth >= 768) {
    window.addEventListener('scroll', () => {
      const rect = twistContainer.getBoundingClientRect();
      const containerHeight = rect.height;
      const scrollPos = -rect.top;
      const progress = Math.min(Math.max(scrollPos / (containerHeight - window.innerHeight), 0), 1);

      if (progress > 0 && progress < 1) {
        if (progress < 0.35) {
          twistStep1.style.opacity = '1';
          twistStep2.style.opacity = '0';
          twistStep3.style.opacity = '0';
          twistContainer.classList.remove('is-dark');
        } else if (progress < 0.7) {
          twistStep1.style.opacity = '0';
          twistStep2.style.opacity = '1';
          twistStep3.style.opacity = '0';
          twistContainer.classList.remove('is-dark');
        } else {
          twistStep1.style.opacity = '0';
          twistStep2.style.opacity = '0';
          twistStep3.style.opacity = '1';
          twistContainer.classList.add('is-dark');
        }
      }
    }, { passive: true });
  }

  // =========================================================================
  // 6. GENERAL REVEALS (42)
  // =========================================================================
  const revealGroups = document.querySelectorAll('.reveal-group');
  if (revealGroups.length > 0 && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealGroups.forEach(rg => revealObserver.observe(rg));
  } else {
    revealGroups.forEach(rg => rg.classList.add('revealed'));
  }

  // =========================================================================
  // 7. MOBILE MENU DRAWER (7)
  // =========================================================================
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuDrawer = document.getElementById('mobile-menu-drawer');
  const menuClose = document.getElementById('mobile-menu-close');

  if (menuBtn && menuDrawer) {
    const toggleMenu = (open) => {
      if (open) {
        menuDrawer.classList.remove('hidden');
        setTimeout(() => menuDrawer.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
      } else {
        menuDrawer.classList.add('opacity-0');
        setTimeout(() => {
          menuDrawer.classList.add('hidden');
          document.body.style.overflow = '';
        }, 250);
      }
    };

    menuBtn.addEventListener('click', () => toggleMenu(true));
    if (menuClose) menuClose.addEventListener('click', () => toggleMenu(false));

    menuDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleMenu(false));
    });
  }

  // =========================================================================
  // 8. CONTACT FORM HANDLING WITH FORMSUBMIT (37, 38)
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const nameInput = document.getElementById('nombre');
      const emailInput = document.getElementById('email');
      const msgInput = document.getElementById('mensaje');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
        e.preventDefault();
        if (formStatus) {
          formStatus.textContent = 'Por favor completá todos los campos.';
          formStatus.className = 'text-xs text-rose-500 mt-2 font-medium';
        }
        return;
      }

      // If valid, button shows feedback
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Enviando...</span>';
      }
    });
  }
});
