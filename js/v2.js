/**
 * Alejandro Vacaro - V2 Interactive Script (Polished)
 * - Lucide Icons Initializer
 * - Scroll Progress Bar (2px coral)
 * - Header Compacting on Scroll (>100px)
 * - Hero Photo 3D Tilt (rAF, desktop only, max 2deg)
 * - "Cómo pienso" 7 Verbs Sticky & Autonomous Micro-Animations
 * - Plot Twist Narrative Sequence (4 steps, progressive dark shift)
 * - Chapter 4 Convergence Animation (Negocio -> <- Tech)
 * - Constellation Hover Connections
 * - Mobile Navigation Menu Drawer
 * - FormSubmit Validation & Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // =========================================================================
  // 1. INITIALIZE LUCIDE ICONS (36)
  // =========================================================================
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // =========================================================================
  // 2. SCROLL PROGRESS BAR (44) & HEADER SCROLLED (43)
  // =========================================================================
  const progressBar = document.getElementById('scroll-progress-bar');
  const mainHeader = document.getElementById('main-header');

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Progress Bar
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }

    // 43. Header compacting (>100px reduce from 72px to 58px)
    if (mainHeader) {
      if (scrollTop > 100) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // =========================================================================
  // 3. HERO PHOTO 3D TILT (16)
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
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      const transX = (currentY / 2) * 3;
      const transY = (-currentX / 2) * 3;

      heroPhotoWrapper.style.transform = `perspective(800px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translate(${transX.toFixed(1)}px, ${transY.toFixed(1)}px)`;

      if (Math.abs(targetX - currentX) > 0.04 || Math.abs(targetY - currentY) > 0.04) {
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
  // 4. "CÓMO PIENSO" STICKY VERBS & AUTONOMOUS MICRO-ANIMATIONS (10, 11, 12)
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

  let currentActiveVerb = 'ENTENDER';

  function setVerb(verbKey) {
    if (currentActiveVerb === verbKey) return;
    currentActiveVerb = verbKey;

    const data = verbMetadata[verbKey];
    if (!data || !stickyWord) return;

    stickyWord.style.opacity = '0';
    stickyWord.style.transform = 'translateY(-14px)';

    setTimeout(() => {
      stickyWord.textContent = verbKey;
      if (stickyNumber) stickyNumber.textContent = data.number;
      if (verbVisualContainer) verbVisualContainer.innerHTML = data.htmlVisual;

      stickyWord.style.opacity = '1';
      stickyWord.style.transform = 'translateY(0)';
    }, 180);
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
      rootMargin: '-25% 0px -40% 0px',
      threshold: 0.1
    });

    stepItems.forEach(item => stepObserver.observe(item));
  }

  // 12. CAMBIAR: cada 5-6s cambia brevemente a Instrument Serif Italic durante 500ms
  if (!prefersReducedMotion) {
    setInterval(() => {
      if (currentActiveVerb === 'CAMBIAR' && stickyWord) {
        stickyWord.style.fontFamily = "var(--font-serif)";
        stickyWord.style.fontStyle = "italic";
        stickyWord.style.color = "var(--coral-glow)";
        setTimeout(() => {
          stickyWord.style.fontFamily = "";
          stickyWord.style.fontStyle = "";
          stickyWord.style.color = "";
        }, 550);
      }
    }, 5500);
  }

  // =========================================================================
  // 5. PLOT TWIST SECUENCIA EXACTA (18, 19)
  // =========================================================================
  const twistBlock = document.getElementById('plot-twist-narrative');
  const step1 = document.getElementById('twist-step-1');
  const step2 = document.getElementById('twist-step-2');
  const step3 = document.getElementById('twist-step-3');
  const step4 = document.getElementById('twist-step-4');

  function handleTwistScroll() {
    if (!twistBlock || !step1 || !step2 || !step3 || !step4) return;
    const rect = twistBlock.getBoundingClientRect();
    const scrollableDist = rect.height - window.innerHeight;
    if (scrollableDist <= 0) return;

    const progress = Math.min(Math.max(-rect.top / scrollableDist, 0), 1);

    if (progress <= 0.25) {
      // Step 1
      step1.style.opacity = '1';
      step1.style.transform = 'translateY(0)';
      step2.style.opacity = '0';
      step2.style.transform = 'translateY(24px)';
      step3.style.opacity = '0';
      step3.style.transform = 'translateY(24px)';
      step4.style.opacity = '0';
      step4.style.transform = 'translateY(24px)';
      twistBlock.classList.remove('is-dark');
    } else if (progress <= 0.50) {
      // Step 2
      step1.style.opacity = '0';
      step1.style.transform = 'translateY(-18px)';
      step2.style.opacity = '1';
      step2.style.transform = 'translateY(0)';
      step3.style.opacity = '0';
      step3.style.transform = 'translateY(24px)';
      step4.style.opacity = '0';
      step4.style.transform = 'translateY(24px)';
      twistBlock.classList.remove('is-dark');
    } else if (progress <= 0.75) {
      // Step 3 (Adiviná)
      step1.style.opacity = '0';
      step2.style.opacity = '0';
      step2.style.transform = 'translateY(-18px)';
      step3.style.opacity = '1';
      step3.style.transform = 'translateY(0)';
      step4.style.opacity = '0';
      step4.style.transform = 'translateY(24px)';
      twistBlock.classList.remove('is-dark');
    } else {
      // Step 4 (Hoy trabajo... + Fondo oscuro)
      step1.style.opacity = '0';
      step2.style.opacity = '0';
      step3.style.opacity = '0';
      step3.style.transform = 'translateY(-18px)';
      step4.style.opacity = '1';
      step4.style.transform = 'translateY(0)';
      twistBlock.classList.add('is-dark');
    }
  }

  if (window.innerWidth >= 768) {
    window.addEventListener('scroll', handleTwistScroll, { passive: true });
    handleTwistScroll();
  }

  // =========================================================================
  // 6. CAPÍTULO 4 CONVERGENCE ANIMATION (24)
  // =========================================================================
  const convergeTrigger = document.getElementById('chapter-converge-trigger');
  const convergeBox = document.getElementById('converge-container');

  if (convergeTrigger && convergeBox && 'IntersectionObserver' in window) {
    const convergeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          convergeBox.classList.add('in-view');
        }
      });
    }, { threshold: 0.35 });

    convergeObserver.observe(convergeTrigger);
  }

  // =========================================================================
  // 7. CONSTELACIÓN INTERACCIÓN (28, 29)
  // =========================================================================
  const constelacionNodes = document.querySelectorAll('.constelacion-node');
  const constelacionLines = document.querySelectorAll('.constelacion-line');

  constelacionNodes.forEach((node, idx) => {
    node.addEventListener('mouseenter', () => {
      if (constelacionLines[idx]) {
        constelacionLines[idx].style.opacity = '1';
        constelacionLines[idx].style.strokeWidth = '2.5px';
      }
    });

    node.addEventListener('mouseleave', () => {
      if (constelacionLines[idx]) {
        constelacionLines[idx].style.opacity = '';
        constelacionLines[idx].style.strokeWidth = '';
      }
    });
  });

  // =========================================================================
  // 8. MOBILE MENU DRAWER (47)
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
  // 9. FORM HANDLING (38)
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
          formStatus.className = 'text-xs text-rose-400 mt-2 font-medium';
        }
        return;
      }

      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Enviando...</span>';
      }
    });
  }
});
