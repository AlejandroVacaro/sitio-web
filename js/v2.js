/**
 * ==============================================================================
 * ALEJANDRO VACARO - SITIO PERSONAL V2
 * Script de interacciones, animaciones, scrollytelling Apple-grade y timeline
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. INICIALIZAR ICONOS LUCIDE
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // ============================================================================
  // 2. ELEMENTOS PRINCIPALES
  // ============================================================================
  const mainHeader = document.getElementById('main-header');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  
  // Conóceme Apple Stage
  const conocemeSection = document.getElementById('conoceme');
  const stageCard = document.querySelector('.conoceme-apple-stage-card');
  const appleBeats = document.querySelectorAll('.apple-story-beat');
  const progressFill = document.getElementById('story-progress-fill');
  const prevBtn = document.getElementById('story-prev-btn');
  const nextBtn = document.getElementById('story-next-btn');

  // Timeline elements
  const timelineContainer = document.getElementById('timeline-container');
  const timelineRailFill = document.getElementById('timeline-rail-fill');
  const timelineRows = document.querySelectorAll('.timeline-alt-row');

  // Secciones a observar para la Navbar activa
  const navSections = [
    { id: 'home', el: document.getElementById('home') },
    { id: 'conoceme', el: document.getElementById('conoceme') },
    { id: 'experiencia', el: document.getElementById('experiencia') },
    { id: 'formacion', el: document.getElementById('formacion') },
    { id: 'contacto', el: document.getElementById('contacto') }
  ].filter(s => s.el !== null);

  const navLinks = document.querySelectorAll('.header-v2 .nav-link');
  let isTicking = false;

  // ============================================================================
  // 3. CONÓCEME: CONTROLADOR NARRATIVO (FLECHAS + WHEEL DENTRO DE LA TARJETA)
  // ============================================================================
  let currentBeatIndex = 0;
  const totalBeats = appleBeats.length;

  function updateArrows() {
    if (prevBtn) prevBtn.disabled = (currentBeatIndex === 0);
    if (nextBtn) nextBtn.disabled = (currentBeatIndex >= totalBeats - 1);
  }

  function goToBeat(index) {
    if (index < 0 || index >= totalBeats) return;
    currentBeatIndex = index;

    appleBeats.forEach((beat, idx) => {
      if (idx === currentBeatIndex) {
        beat.classList.remove('is-exiting');
        beat.classList.add('is-active');
      } else if (idx < currentBeatIndex) {
        beat.classList.remove('is-active');
        beat.classList.add('is-exiting');
      } else {
        beat.classList.remove('is-active');
        beat.classList.remove('is-exiting');
      }
    });

    if (progressFill && totalBeats > 0) {
      const fillPercent = Math.min(100, Math.max(3, ((currentBeatIndex + 1) / totalBeats) * 100));
      progressFill.style.width = `${fillPercent}%`;
    }

    updateArrows();
  }

  // Inicializar estado de flechas y primer beat
  updateArrows();

  // A. Eventos de click en las flechas inferior derecha
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentBeatIndex > 0) {
        goToBeat(currentBeatIndex - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentBeatIndex < totalBeats - 1) {
        goToBeat(currentBeatIndex + 1);
      }
    });
  }

  // B. Scroll controlado: SOLO cuando el mouse está DENTRO del recuadro
  // Si está por fuera, el scroll total de la página sigue su camino normal.
  if (stageCard) {
    let wheelAccumulator = 0;
    let isWheelThrottled = false;
    let wheelResetTimer = null;

    stageCard.addEventListener('wheel', (e) => {
      // 1. Si está en la primera frase y scrollea hacia arriba, permitir que la página suba
      if (currentBeatIndex === 0 && e.deltaY < 0) {
        return;
      }
      // 2. Si está en la última frase y scrollea hacia abajo, permitir que la página baje
      if (currentBeatIndex >= totalBeats - 1 && e.deltaY > 0) {
        return;
      }

      // 3. Dentro del rango narrativo, capturar el scroll para alternar frases
      e.preventDefault();

      wheelAccumulator += e.deltaY;

      if (wheelResetTimer) clearTimeout(wheelResetTimer);
      wheelResetTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 180);

      const THRESHOLD = 28;

      if (!isWheelThrottled) {
        if (wheelAccumulator > THRESHOLD) {
          if (currentBeatIndex < totalBeats - 1) {
            goToBeat(currentBeatIndex + 1);
            wheelAccumulator = 0;
            isWheelThrottled = true;
            setTimeout(() => { isWheelThrottled = false; }, 360);
          }
        } else if (wheelAccumulator < -THRESHOLD) {
          if (currentBeatIndex > 0) {
            goToBeat(currentBeatIndex - 1);
            wheelAccumulator = 0;
            isWheelThrottled = true;
            setTimeout(() => { isWheelThrottled = false; }, 360);
          }
        }
      }
    }, { passive: false });

    // Soporte táctil / swipe horizontal en móviles
    let touchStartX = 0;
    let touchStartY = 0;

    stageCard.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    stageCard.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0 && currentBeatIndex < totalBeats - 1) {
          goToBeat(currentBeatIndex + 1);
        } else if (diffX > 0 && currentBeatIndex > 0) {
          goToBeat(currentBeatIndex - 1);
        }
      }
    }, { passive: true });
  }


  // ============================================================================
  // 4. CONTROLADOR DE SCROLL PRINCIPAL DE LA PÁGINA
  // ============================================================================
  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - windowHeight;

    // A. Barra de progreso superior
    if (scrollProgressBar && docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      scrollProgressBar.style.width = `${progress}%`;
    }

    // B. Header: Transparencia Glassmorphism Apple al scroll > 20px
    if (mainHeader) {
      if (scrollY > 20) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    // C. Navbar: Detección de Sección Activa y Tema Adaptativo
    const scanLine = windowHeight * 0.35;
    let activeSectionId = 'home';

    navSections.forEach(section => {
      const rect = section.el.getBoundingClientRect();
      if (rect.top <= scanLine && rect.bottom > scanLine) {
        activeSectionId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + activeSectionId) {
        link.classList.add('active-section');
      } else {
        link.classList.remove('active-section');
      }
    });

    // Tema oscuro adaptativo de la navbar sobre Conóceme o Contacto
    if (mainHeader) {
      if (activeSectionId === 'conoceme' || activeSectionId === 'contacto') {
        mainHeader.classList.add('header-dark-theme');
      } else {
        mainHeader.classList.remove('header-dark-theme');
      }
    }

    // E. Mi Experiencia: Línea naranja que se despinta al scrollear hacia abajo
    if (timelineContainer && timelineRailFill) {
      const tlRect = timelineContainer.getBoundingClientRect();
      const tlTop = tlRect.top;
      const tlHeight = tlRect.height;
      const scanPoint = windowHeight * 0.55;

      if (tlTop >= scanPoint) {
        // 100% pintada de naranja
        timelineRailFill.style.top = '0%';
        timelineRailFill.style.height = '100%';
        timelineRows.forEach(row => {
          const node = row.querySelector('.timeline-center-node');
          if (node) node.classList.add('is-active');
        });
      } else {
        // Se va despintando desde arriba hacia abajo
        const scrolledDistance = scanPoint - tlTop;
        const unpaintPercent = Math.min(100, Math.max(0, (scrolledDistance / tlHeight) * 100));

        timelineRailFill.style.top = `${unpaintPercent}%`;
        timelineRailFill.style.height = `${100 - unpaintPercent}%`;

        timelineRows.forEach(row => {
          const node = row.querySelector('.timeline-center-node');
          if (node) {
            const nodeRect = node.getBoundingClientRect();
            if (nodeRect.top < scanPoint) {
              node.classList.remove('is-active');
            } else {
              node.classList.add('is-active');
            }
          }
        });
      }
    }

    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      requestAnimationFrame(onScroll);
      isTicking = true;
    }
  }, { passive: true });

  onScroll();


  // ============================================================================
  // 5. MENÚ MÓVIL (DRAWER - CON TOGGLE EN HAMBURGUESA Y NAVBAR SIEMPRE VISIBLE)
  // ============================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = mobileMenuDrawer ? mobileMenuDrawer.querySelectorAll('a') : [];

  function isMobileMenuOpen() {
    return mobileMenuDrawer && 
           !mobileMenuDrawer.classList.contains('hidden') && 
           mobileMenuDrawer.classList.contains('is-open');
  }

  function updateMobileMenuIcon(isOpen) {
    if (!mobileMenuBtn) return;
    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    mobileMenuBtn.innerHTML = isOpen 
      ? '<i data-lucide="x" class="w-6 h-6"></i>' 
      : '<i data-lucide="menu" class="w-6 h-6"></i>';
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function openMobileMenu() {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.remove('hidden');
    void mobileMenuDrawer.offsetWidth;
    mobileMenuDrawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    updateMobileMenuIcon(true);
  }

  function closeMobileMenu() {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.remove('is-open');
    updateMobileMenuIcon(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!isMobileMenuOpen()) {
        mobileMenuDrawer.classList.add('hidden');
      }
    }, 320);
  }

  function toggleMobileMenu() {
    if (isMobileMenuOpen()) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  // ============================================================================
  // 6. HERO PHOTO 3D TILT
  // ============================================================================
  const heroPhotoWrapper = document.getElementById('hero-photo-wrapper');
  if (heroPhotoWrapper && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const maxTilt = 1.5;

    heroPhotoWrapper.addEventListener('mousemove', (e) => {
      const rect = heroPhotoWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const rotateY = (percentX * maxTilt).toFixed(2);
      const rotateX = (-percentY * maxTilt).toFixed(2);

      heroPhotoWrapper.style.transition = 'transform 0.15s ease-out';
      heroPhotoWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    heroPhotoWrapper.addEventListener('mouseleave', () => {
      heroPhotoWrapper.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      heroPhotoWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }


  // ============================================================================
  // 7. CINTA HORIZONTAL ANIMADA (ENGINE CONTINUO)
  // ============================================================================
  const marqueeContainer = document.getElementById('hero-marquee');
  const marqueeTrack = document.getElementById('cinta-track');
  const group1 = document.getElementById('cinta-group-1');

  if (marqueeContainer && marqueeTrack && group1) {
    let groupWidth = group1.offsetWidth || 2000;
    let currentOffset = 0;
    let lastTime = performance.now();
    let isRunning = true;
    let isDragging = false;
    let startPointerX = 0;
    let dragStartOffset = 0;
    let touchResumeTimer = null;
    let speedFactor = 1.0;
    let targetSpeedFactor = 1.0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LOOP_DURATION_MS = 40000;

    function measureWidth() {
      const w = group1.offsetWidth;
      if (w > 0) {
        groupWidth = w;
      }
    }

    measureWidth();
    window.addEventListener('load', measureWidth);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureWidth);
    }
    window.addEventListener('resize', measureWidth);

    function tick(now) {
      const dt = now - lastTime;
      lastTime = now;

      if (speedFactor !== targetSpeedFactor) {
        const step = dt / 350;
        if (speedFactor < targetSpeedFactor) {
          speedFactor = Math.min(targetSpeedFactor, speedFactor + step);
        } else {
          speedFactor = Math.max(targetSpeedFactor, speedFactor - step);
        }
      }

      if (!isDragging && isRunning && !prefersReducedMotion && groupWidth > 0) {
        const baseSpeed = groupWidth / LOOP_DURATION_MS;
        const effectiveSpeed = baseSpeed * speedFactor;
        currentOffset = (currentOffset + effectiveSpeed * dt) % groupWidth;
        marqueeTrack.style.transform = `translate3d(-${currentOffset}px, 0, 0)`;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    marqueeContainer.addEventListener('mouseenter', () => {
      targetSpeedFactor = 0;
    });

    marqueeContainer.addEventListener('mouseleave', () => {
      if (!isDragging) {
        targetSpeedFactor = 1.0;
      }
    });

    marqueeContainer.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startPointerX = e.clientX;
      dragStartOffset = currentOffset;
      speedFactor = 0;
      targetSpeedFactor = 0;

      if (touchResumeTimer) {
        clearTimeout(touchResumeTimer);
        touchResumeTimer = null;
      }

      marqueeTrack.classList.add('is-dragging');
      try {
        marqueeTrack.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    marqueeContainer.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startPointerX;
      let newOffset = (dragStartOffset - deltaX) % groupWidth;
      if (newOffset < 0) {
        newOffset += groupWidth;
      }
      currentOffset = newOffset;
      marqueeTrack.style.transform = `translate3d(-${currentOffset}px, 0, 0)`;
    });

    function endDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      marqueeTrack.classList.remove('is-dragging');

      try {
        if (marqueeTrack.hasPointerCapture(e.pointerId)) {
          marqueeTrack.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}

      if (e.pointerType === 'touch') {
        touchResumeTimer = setTimeout(() => {
          targetSpeedFactor = 1.0;
        }, 1500);
      } else {
        if (!marqueeContainer.matches(':hover')) {
          targetSpeedFactor = 1.0;
        }
      }
    }

    marqueeContainer.addEventListener('pointerup', endDrag);
    marqueeContainer.addEventListener('pointercancel', endDrag);
  }


  // ============================================================================
  // 8. MI EXPERIENCIA & MI FORMACIÓN: OVERLAYS INTERACTIVOS
  // ============================================================================
  const interactiveCards = document.querySelectorAll('.formacion-card-v2, .timeline-exp-card');

  interactiveCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const isExpanded = card.classList.contains('is-expanded');
      
      if (isExpanded) {
        card.classList.remove('is-expanded');
        card.setAttribute('aria-expanded', 'false');
      } else {
        const parent = card.closest('.timeline-container-alt') || card.closest('.formacion-container-v2');
        if (parent) {
          parent.querySelectorAll('.is-expanded').forEach(c => {
            c.classList.remove('is-expanded');
            c.setAttribute('aria-expanded', 'false');
          });
        }
        card.classList.add('is-expanded');
        card.setAttribute('aria-expanded', 'true');
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.formacion-card-v2') && !e.target.closest('.timeline-exp-card')) {
      interactiveCards.forEach(card => {
        card.classList.remove('is-expanded');
        card.setAttribute('aria-expanded', 'false');
      });
    }
  });


  // ============================================================================
  // 9. TOAST NOTIFICATIONS & FORMULARIO DE CONTACTO AJAX
  // ============================================================================
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `px-5 py-3.5 rounded-xl shadow-xl text-sm font-sans font-medium flex items-center gap-3 transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto ${
      type === 'success' 
        ? 'bg-[#2D3142] text-[#F5F2EC] border border-[#EF8354]/40' 
        : 'bg-red-900/90 text-white border border-red-500/50'
    }`;

    const iconHtml = type === 'success'
      ? `<svg class="w-5 h-5 text-[#EF8354] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
      : `<svg class="w-5 h-5 text-red-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

    toast.innerHTML = `${iconHtml}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }

  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const honeyField = contactForm.querySelector('input[name="_honey"]');
      if (honeyField && honeyField.value.trim() !== '') {
        return;
      }

      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2">⏳</span>
        <span>Enviando...</span>
      `;

      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject') || 'Contacto desde sitio web',
        message: formData.get('message'),
        _captcha: 'false',
        _template: 'table'
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/avacaro@outlook.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          // Lanza animación de confeti
          triggerCelebrationConfetti();

          showToast('Mensaje enviado. Gracias por escribir.', 'success');
          contactForm.reset();

          // Cambiar el recuadro a mensaje de agradecimiento
          const formMainState = document.getElementById('form-main-state');
          const formSuccessState = document.getElementById('form-success-state');
          if (formMainState && formSuccessState) {
            formMainState.style.display = 'none';
            formSuccessState.classList.remove('hidden');
            void formSuccessState.offsetWidth;
            formSuccessState.classList.remove('opacity-0', 'scale-95');
            formSuccessState.classList.add('opacity-100', 'scale-100');
          }
        } else {
          throw new Error('Error en el servidor');
        }
      } catch (error) {
        showToast('No pude enviar el mensaje. Probá de nuevo o escribime por email.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      }
    });

    // Botón para volver a enviar otro mensaje
    const sendAnotherBtn = document.getElementById('send-another-btn');
    if (sendAnotherBtn) {
      sendAnotherBtn.addEventListener('click', () => {
        const formMainState = document.getElementById('form-main-state');
        const formSuccessState = document.getElementById('form-success-state');
        if (formMainState && formSuccessState) {
          formSuccessState.classList.remove('opacity-100', 'scale-100');
          formSuccessState.classList.add('opacity-0', 'scale-95');
          setTimeout(() => {
            formSuccessState.classList.add('hidden');
            formMainState.style.display = '';
          }, 300);
        }
      });
    }
  }


  // ============================================================================
  // 10. ANIMACIÓN DE CONFETI CELEBRATORIO
  // ============================================================================
  function triggerCelebrationConfetti() {
    if (typeof window.confetti === 'function') {
      // Ráfaga múltiple estilo fuegos artificiales
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#EF8354', '#F5F2EC', '#2D3142', '#FFD166', '#FFFFFF']
      };

      function fire(particleRatio, opts) {
        window.confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }

  // ============================================================================
  // 11. COPIAR EMAIL AL PORTAPAPELES
  // ============================================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText('avacaro@outlook.com');
        showToast('Correo avacaro@outlook.com copiado al portapapeles.', 'success');
        const icon = document.getElementById('copy-email-icon');
        if (icon) {
          icon.setAttribute('data-lucide', 'check');
          if (window.lucide) window.lucide.createIcons();
          setTimeout(() => {
            icon.setAttribute('data-lucide', 'copy');
            if (window.lucide) window.lucide.createIcons();
          }, 2000);
        }
      } catch (err) {
        showToast('Email: avacaro@outlook.com', 'success');
      }
    });
  }

  // ============================================================================
  // 12. BOTÓN FLOTANTE 'VOLVER ARRIBA' (Aparece ÚNICAMENTE en Contáctame y Footer)
  // ============================================================================
  const scrollToTopWrap = document.getElementById('scroll-to-top-wrap');
  const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
  const contactoSection = document.getElementById('contacto');

  function updateFloatingButton() {
    if (!scrollToTopWrap) return;
    
    let isVisible = false;
    if (contactoSection) {
      const rect = contactoSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Aparece únicamente cuando el inicio de Contáctame entra en el viewport (sección visible)
      // y se mantiene activo a lo largo de Contáctame y el Footer
      if (rect.top <= windowHeight * 0.75) {
        isVisible = true;
      }
    }

    if (isVisible) {
      scrollToTopWrap.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      scrollToTopWrap.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    } else {
      scrollToTopWrap.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      scrollToTopWrap.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    }
  }

  window.addEventListener('scroll', updateFloatingButton, { passive: true });
  window.addEventListener('resize', updateFloatingButton, { passive: true });
  updateFloatingButton();

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
