/**
 * ALEJANDRO VACARO - PERSONAL WEBSITE INTERACTION ENGINE
 * UX/UI Interactive behaviors, animations, scrollspy, contact form & micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Toast Notification Manager
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'info', iconName = 'info', duration = 4000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4F653" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4F653" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="flex-shrink-0">${iconSvg}</div>
      <div class="flex-1 font-medium text-sm text-slate-100">${message}</div>
      <button class="text-slate-400 hover:text-white transition-colors ml-2 focus:outline-none" aria-label="Cerrar notificación">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });

    toastContainer.appendChild(toast);

    const timer = setTimeout(() => {
      removeToast(toast);
    }, duration);

    function removeToast(el) {
      clearTimeout(timer);
      el.classList.add('hide');
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }
  }

  window.showToast = showToast;

  // 2. Navbar Scroll State & ScrollSpy
  const navbar = document.getElementById('main-navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}` || (currentSectionId === '' && href === '#inicio')) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // 3. Mobile Navigation Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileDrawer?.classList.remove('translate-x-full');
    mobileBackdrop?.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    mobileDrawer?.classList.add('translate-x-full');
    mobileBackdrop?.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }

  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileBackdrop?.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // 4. Custom Interactive Cursor (Desktop)
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursorDot = document.createElement('div');
    const cursorRing = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    cursorRing.className = 'custom-cursor-ring';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover expansions on strictly interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [data-copy-text], [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('custom-cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('custom-cursor-hover'));
    });
  }

  // 5. Contact Form UX & Confetti
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    if (!nameInput?.value.trim() || !emailInput?.value.trim() || !messageInput?.value.trim()) {
      showToast('Por favor completa los campos requeridos para enviar tu mensaje.', 'warning');
      return;
    }

    // Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Enviando mensaje...</span>
      `;
    }

    setTimeout(() => {
      // Trigger celebratory confetti if library is available
      if (window.confetti) {
        window.confetti({
          particleCount: 110,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#D4F653', '#0E1116', '#FFFFFF', '#60A5FA']
        });
      }

      showToast(`¡Gracias ${nameInput.value.split(' ')[0]}! Tu mensaje ha sido recibido. Me pondré en contacto contigo a la brevedad.`, 'success', 'check', 5000);

      contactForm.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>¡Mensaje Enviado con Éxito!</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        `;
        setTimeout(() => {
          submitBtn.innerHTML = `
            <span>Enviar Mensaje</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          `;
        }, 3000);
      }
    }, 1200);
  });

  // 6. CV Download & Interactive Actions
  const cvButtons = document.querySelectorAll('.action-cv-download');
  cvButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('📄 Descargando Currículum Vitae de Alejandro Vacaro en formato PDF...', 'success', 'file-text', 4000);
    });
  });

  // 7. Copy to Clipboard Action
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`📋 Copiado al portapapeles: "${textToCopy}"`, 'success', 'copy', 3000);
        }).catch(() => {
          showToast(`Contacto: ${textToCopy}`, 'info');
        });
      }
    });
  });

  // 8. Back to Top Smooth Scroll
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn?.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    } else {
      backToTopBtn?.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 9. Interactive Story Timeline Active Highlight
  const timelineCards = document.querySelectorAll('.story-card');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.25
  };

  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-story');
      }
    });
  }, observerOptions);

  timelineCards.forEach((card) => {
    storyObserver.observe(card);
  });
});
