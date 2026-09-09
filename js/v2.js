/**
 * Alejandro Vacaro - V2 Prototype JavaScript
 * - Hero Variant Switcher (Options A, B, C)
 * - IntersectionObserver reveal animations
 * - Mobile navigation menu toggle
 * - Lucide icons initializer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Hero Variant Switcher Logic
  const switchButtons = document.querySelectorAll('[data-hero-target]');
  const heroVariants = document.querySelectorAll('.hero-variant');
  const heroDescription = document.getElementById('hero-variant-desc');

  const variantDescriptions = {
    A: "Alternativa A: Foco profesional y editorial en análisis funcional, optimización de procesos y tecnología.",
    B: "Alternativa B: Foco narrativo y personal en la historia, la curiosidad y el plot twist vocacional.",
    C: "Alternativa C: Equilibrio entre la disciplina técnica y la perspectiva humana del recorrido."
  };

  function activateHeroVariant(variantKey) {
    // Update buttons
    switchButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-hero-target') === variantKey;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Update variants
    heroVariants.forEach(variant => {
      const isTarget = variant.getAttribute('data-hero-variant') === variantKey;
      if (isTarget) {
        variant.style.display = 'block';
        setTimeout(() => {
          variant.classList.add('active');
        }, 20);
      } else {
        variant.classList.remove('active');
        setTimeout(() => {
          if (!variant.classList.contains('active')) {
            variant.style.display = 'none';
          }
        }, 300);
      }
    });

    // Update description text if present
    if (heroDescription && variantDescriptions[variantKey]) {
      heroDescription.textContent = variantDescriptions[variantKey];
    }

    // Re-trigger Lucide icons in newly displayed variant
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Store preference in sessionStorage
    try {
      sessionStorage.setItem('ale_hero_variant', variantKey);
    } catch (e) {
      // Ignore if cookies/storage blocked
    }
  }

  // Attach click listeners to switcher buttons
  switchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-hero-target');
      activateHeroVariant(target);
    });
  });

  // Check URL params (?hero=A / B / C) or stored preference
  const urlParams = new URLSearchParams(window.location.search);
  const heroFromUrl = urlParams.get('hero')?.toUpperCase();
  const heroFromStorage = sessionStorage.getItem('ale_hero_variant');

  if (['A', 'B', 'C'].includes(heroFromUrl)) {
    activateHeroVariant(heroFromUrl);
  } else if (['A', 'B', 'C'].includes(heroFromStorage)) {
    activateHeroVariant(heroFromStorage);
  } else {
    // Default to Option C (Equilibrio) as recommended, or A
    activateHeroVariant('C');
  }

  // 3. Scroll Reveal with IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 4. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  if (mobileMenuBtn && mobileMenuDrawer) {
    const toggleMenu = (open) => {
      if (open) {
        mobileMenuDrawer.classList.remove('hidden');
        setTimeout(() => mobileMenuDrawer.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenuDrawer.classList.add('opacity-0');
        setTimeout(() => {
          mobileMenuDrawer.classList.add('hidden');
          document.body.style.overflow = '';
        }, 250);
      }
    };

    mobileMenuBtn.addEventListener('click', () => toggleMenu(true));
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => toggleMenu(false));
    }

    // Close mobile menu on clicking any link inside
    mobileMenuDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // 5. Header scroll elevation
  const header = document.getElementById('v2-navbar');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('shadow-sm');
      } else {
        header.classList.remove('shadow-sm');
      }
    }, { passive: true });
  }
});
