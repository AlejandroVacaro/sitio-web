/**
 * Alejandro Vacaro - V2 Narrative System Script
 * - Lucide Icons Initialization
 * - Scroll Progress Bar
 * - Header Scroll Compacting (>80px -> 56px + shadow)
 * - Mobile Menu Drawer
 * - Hero Photo 3D Tilt (Desktop only, max 1.5deg, return 700ms)
 * - Cinta Animada (40s loop, draggable, pause on hover, resume on mouseleave)
 * - Recurso Editorial (5 words staggered reveal)
 * - Conóceme (Narrative steps observer, dark background transition, Adiviná)
 * - Mi Experiencia (Timeline progress line + card reveals)
 * - Accessibility: Prefers-reduced-motion support
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // =========================================================================
  // 1. LUCIDE ICONS (Secciones 19, 20, 69)
  // =========================================================================
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // =========================================================================
  // 2. SCROLL PROGRESS BAR & HEADER SCROLLED (Secciones 4, 43)
  // =========================================================================
  const progressBar = document.getElementById('scroll-progress-bar');
  const mainHeader = document.getElementById('main-header');

  function handleWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Progress Bar
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }

    // Header compacting: scroll > 80px -> 56px + shadow (Sección 4)
    if (mainHeader) {
      if (scrollTop > 80) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    // Timeline progress line
    updateTimelineProgress();
  }

  window.addEventListener('scroll', handleWindowScroll, { passive: true });
  handleWindowScroll();

  // =========================================================================
  // 3. MOBILE MENU DRAWER (Sección 74)
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
  // 4. HERO PHOTO 3D TILT (Sección 24: max 1.5deg, return 700ms)
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

      // Max: rotateX 1.5deg, rotateY 1.5deg, translate 3px
      targetX = -((y - centerY) / centerY) * 1.5;
      targetY = ((x - centerX) / centerX) * 1.5;

      heroPhotoWrapper.style.transition = '';

      if (!rAFId) {
        rAFId = requestAnimationFrame(updateTilt);
      }
    });

    function updateTilt() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      const transX = (currentY / 1.5) * 3;
      const transY = (-currentX / 1.5) * 3;

      heroPhotoWrapper.style.transform = `perspective(800px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translate(${transX.toFixed(1)}px, ${transY.toFixed(1)}px)`;

      if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
        rAFId = requestAnimationFrame(updateTilt);
      } else {
        rAFId = null;
      }
    }

    heroPhotoWrapper.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      if (rAFId) {
        cancelAnimationFrame(rAFId);
        rAFId = null;
      }
      heroPhotoWrapper.style.transition = 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)';
      heroPhotoWrapper.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translate(0px, 0px)';
      setTimeout(() => {
        heroPhotoWrapper.style.transition = '';
      }, 700);
    });
  }

  // =========================================================================
  // 5. CINTA ANIMADA HORIZONTAL (Secciones 26-29)
  // 40s loop, draggable con pointer capture, hover pausa, mouseleave reanuda
  // =========================================================================
  const cintaBand = document.getElementById('hero-marquee');
  const cintaTrack = document.getElementById('cinta-track');

  if (cintaBand && cintaTrack) {
    const groups = cintaTrack.querySelectorAll('.cinta-group');
    let groupWidth = 0;

    function updateCintaWidth() {
      if (groups.length > 0) {
        groupWidth = groups[0].getBoundingClientRect().width;
        while (groupWidth > 0 && cintaTrack.children.length * groupWidth < window.innerWidth + 2 * groupWidth) {
          const clone = groups[0].cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          cintaTrack.appendChild(clone);
        }
      }
    }

    updateCintaWidth();
    window.addEventListener('resize', updateCintaWidth, { passive: true });

    function getBaseSpeed() {
      if (prefersReducedMotion) return 0;
      return groupWidth > 0 ? groupWidth / 40 : 45; // 40s duración (Sección 29)
    }

    let baseSpeed = getBaseSpeed();
    let currentSpeed = baseSpeed;
    let offset = 0;
    let isHovered = false;
    let isDragging = false;
    let pointerLastX = 0;
    let pointerLastTime = 0;
    let velocityX = 0;
    let inertiaDist = 0;
    let inertiaVelocity = 0;
    let touchResumeTimer = null;
    let lastFrameTime = performance.now();

    function cintaStep(now) {
      const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;
      baseSpeed = getBaseSpeed();

      if (!isDragging) {
        // Inercia sutil si se soltó con flick
        if (Math.abs(inertiaDist) > 0.5) {
          const step = inertiaVelocity * dt;
          offset += step;
          inertiaDist -= step;
          inertiaVelocity *= Math.pow(0.04, dt);
          if (Math.abs(inertiaDist) <= 0.5) {
            inertiaDist = 0;
            inertiaVelocity = 0;
          }
        }

        if (!prefersReducedMotion) {
          if (isHovered) {
            // Desaceleración suave ~300ms
            if (currentSpeed > 0) {
              const decelRate = (baseSpeed || 45) / 0.3;
              currentSpeed = Math.max(0, currentSpeed - decelRate * dt);
            }
          } else {
            // Aceleración suave ~500ms hasta baseSpeed
            if (currentSpeed < baseSpeed) {
              const accelRate = (baseSpeed || 45) / 0.5;
              currentSpeed = Math.min(baseSpeed, currentSpeed + accelRate * dt);
            }
          }

          offset -= currentSpeed * dt;
        }
      }

      // Loop infinito por módulo
      if (groupWidth > 0) {
        while (offset <= -groupWidth) {
          offset += groupWidth;
        }
        while (offset > 0) {
          offset -= groupWidth;
        }
      }

      cintaTrack.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
      requestAnimationFrame(cintaStep);
    }

    requestAnimationFrame(cintaStep);

    // Hover
    cintaBand.addEventListener('mouseenter', (e) => {
      if (e.pointerType === 'mouse' || !e.pointerType) {
        isHovered = true;
      }
    });

    cintaBand.addEventListener('mouseleave', (e) => {
      if (e.pointerType === 'mouse' || !e.pointerType) {
        if (!isDragging) {
          isHovered = false;
        }
      }
    });

    // Pointer Drag
    cintaBand.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.button !== undefined) return;
      isDragging = true;
      isHovered = true;
      pointerLastX = e.clientX;
      pointerLastTime = performance.now();
      velocityX = 0;
      inertiaDist = 0;
      inertiaVelocity = 0;

      if (touchResumeTimer) {
        clearTimeout(touchResumeTimer);
        touchResumeTimer = null;
      }

      cintaBand.classList.add('is-dragging');
      try {
        cintaBand.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    cintaBand.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const currentX = e.clientX;
      const deltaX = currentX - pointerLastX;
      const now = performance.now();
      const timeDelta = now - pointerLastTime;

      offset += deltaX;

      if (timeDelta > 5) {
        velocityX = (deltaX / timeDelta) * 1000;
        pointerLastX = currentX;
        pointerLastTime = now;
      }
    });

    function endCintaDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      cintaBand.classList.remove('is-dragging');
      try {
        cintaBand.releasePointerCapture(e.pointerId);
      } catch (err) {}

      // Flick suave 20-30px max
      if (Math.abs(velocityX) > 150) {
        const sign = Math.sign(velocityX);
        const dist = Math.min(Math.max(Math.abs(velocityX) * 0.04, 15), 30);
        inertiaDist = sign * dist;
        inertiaVelocity = sign * dist * 4;
      } else {
        inertiaDist = 0;
        inertiaVelocity = 0;
      }

      if (e.pointerType === 'touch') {
        touchResumeTimer = setTimeout(() => {
          isHovered = false;
        }, 1500);
      } else {
        const rect = cintaBand.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          isHovered = true;
        } else {
          isHovered = false;
        }
      }
    }

    cintaBand.addEventListener('pointerup', endCintaDrag);
    cintaBand.addEventListener('pointercancel', endCintaDrag);
    cintaBand.addEventListener('dragstart', (e) => e.preventDefault());
  }

  // =========================================================================
  // 6. RECURSO EDITORIAL (Secciones 30-32)
  // Stagger 100ms, 900ms duration, trigger once
  // =========================================================================
  const recursoContainer = document.getElementById('recurso-editorial-container');
  if (recursoContainer && 'IntersectionObserver' in window) {
    const editorialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          recursoContainer.classList.add('editorial-in-view');
          editorialObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    editorialObserver.observe(recursoContainer);
  }

  // =========================================================================
  // 7. CONÓCEME - EXPERIENCIA NARRATIVA POR SCROLL (Secciones 33-42)
  // Transición de fondo a #2D3142 en momento de duelo y retorno a #F5F2EC
  // =========================================================================
  const conocemeSection = document.getElementById('conoceme');
  const narrativeSteps = document.querySelectorAll('.narrative-step, .narrative-adivina');

  if ('IntersectionObserver' in window) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');

          // Transición de fondo en momentos sensibles (Sección 38)
          if (conocemeSection) {
            if (entry.target.classList.contains('trigger-dark-mood') || entry.target.classList.contains('in-dark-mood')) {
              conocemeSection.classList.add('dark-mood');
            } else if (entry.target.classList.contains('trigger-light-mood')) {
              conocemeSection.classList.remove('dark-mood');
            }
          }
        }
      });
    }, {
      rootMargin: '-15% 0px -25% 0px',
      threshold: 0.15
    });

    narrativeSteps.forEach(step => stepObserver.observe(step));
  } else {
    narrativeSteps.forEach(step => step.classList.add('in-view'));
  }

  // =========================================================================
  // 8. MI EXPERIENCIA - TIMELINE ANIMATION (Secciones 44-45)
  // =========================================================================
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineFill = document.getElementById('timeline-progress-fill');
  const timelineContainer = document.getElementById('timeline-container');

  if (timelineItems.length > 0 && 'IntersectionObserver' in window) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      rootMargin: '0px 0px -18% 0px',
      threshold: 0.1
    });

    timelineItems.forEach(item => timelineObserver.observe(item));
  } else {
    timelineItems.forEach(item => item.classList.add('in-view'));
  }

  function updateTimelineProgress() {
    if (!timelineContainer || !timelineFill) return;
    const rect = timelineContainer.getBoundingClientRect();
    const windowH = window.innerHeight;
    
    // Si el contenedor está en viewport
    if (rect.top <= windowH * 0.7 && rect.bottom >= windowH * 0.3) {
      const totalDist = rect.height;
      const scrolledDist = (windowH * 0.7) - rect.top;
      const pct = Math.min(Math.max((scrolledDist / totalDist) * 100, 0), 100);
      timelineFill.style.height = `${pct.toFixed(1)}%`;
    } else if (rect.top > windowH * 0.7) {
      timelineFill.style.height = '0%';
    } else if (rect.bottom < windowH * 0.3) {
      timelineFill.style.height = '100%';
    }
  }

});
