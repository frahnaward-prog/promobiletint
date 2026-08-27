(() => {
  'use strict';

  const qs = selector => document.querySelector(selector);
  const qsa = selector => Array.from(document.querySelectorAll(selector));

  const debounce = (callback, delay = 100) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => callback(...args), delay);
    };
  };

  const initMobileNavigation = () => {
    const menuToggle = qs('.menu-toggle');
    const navMenu = qs('.nav-menu');

    if (!(menuToggle && navMenu)) {
      return;
    }

    const closeNavigation = () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };

    const openNavigation = () => {
      menuToggle.classList.add('active');
      navMenu.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    };

    const toggleNavigation = () => {
      if (navMenu.classList.contains('active')) {
        closeNavigation();
      } else {
        openNavigation();
      }
    };

    menuToggle.addEventListener('click', toggleNavigation);

    navMenu.addEventListener('click', event => {
      if (event.target.closest('a')) {
        closeNavigation();
      }
    });

    document.addEventListener('click', event => {
      if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
        closeNavigation();
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeNavigation();
      }
    });

    qsa('.nav-areas-toggle').forEach(toggle => {
      toggle.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const item = toggle.closest('.nav-areas');
        const isOpen = item.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    });
  };

  const initStickyHeader = () => {
    const header = qs('.header');
    if (!header) return;

    let isTicking = false;

    const updateHeader = () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
      isTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateHeader);
      }
    }, { passive: true });
  };

  const initSmoothScroll = () => {
    qsa('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', event => {
        const targetId = anchor.getAttribute('href');
        const target = targetId && qs(targetId);

        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  };

  const initScrollReveal = () => {
    const sections = qsa('section');
    if (!sections.length || !window.IntersectionObserver) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    sections.forEach(section => {
      section.classList.add('hidden');
      revealObserver.observe(section);
    });
  };

  const initCounters = () => {
    const counters = qsa('.counter');
    if (!counters.length || !window.IntersectionObserver) return;

    const animateCounter = counter => {
      const targetValue = Number(counter.textContent.replace(/\D/g, '')) || 0;
      const suffix = counter.textContent.replace(/[0-9]/g, '');
      let currentValue = Number(counter.dataset.count || 0);
      const step = Math.max(1, Math.ceil(targetValue / 60));

      const update = () => {
        currentValue = Math.min(currentValue + step, targetValue);
        counter.dataset.count = currentValue;
        counter.textContent = `${currentValue}${suffix}`;

        if (currentValue < targetValue) {
          requestAnimationFrame(update);
        }
      };

      update();
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(counter => counterObserver.observe(counter));
  };

  const initSalePopup = () => {
    const overlay = qs('#saleOverlay');
    const popup = qs('.sale-popup');
    const closeBtn = qs('#closeSale');
    if (!(overlay && popup && closeBtn && window.localStorage)) return;
    if (qs('.contact-form')) return;

    const STORAGE_KEY = 'proMobileTintSalePopup';
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const lastShown = Number(localStorage.getItem(STORAGE_KEY));
    const now = Date.now();

    if (Number.isNaN(lastShown) || now - lastShown > ONE_DAY) {
      window.setTimeout(() => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        localStorage.setItem(STORAGE_KEY, String(now));
      }, window.matchMedia('(max-width: 767px)').matches ? 12000 : 8000);
    }

    const closePopup = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closePopup);

    overlay.addEventListener('click', event => {
      if (event.target === overlay) {
        closePopup();
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closePopup();
      }
    });
  };

  const initComparisonSlider = () => {
    const slider = qs('#premiumSlider');
    if (!slider) return;

    const afterWrap = slider.querySelector('.premium-compare__image-wrap');
    const handle = slider.querySelector('.premium-compare__handle');
    const hint = slider.querySelector('.premium-compare__hint');
    const labelNow = value => {
      handle.setAttribute('aria-valuenow', String(Math.round(value)));
      handle.dataset.position = String(value);
    };

    if (!(afterWrap && handle)) return;

    let isDragging = false;
    let frame = null;
    let sliderRect = slider.getBoundingClientRect();
    let currentPercent = 50;
    const localKey = 'proMobileTintCompareHint';

    const setPosition = percent => {
      currentPercent = Math.max(0, Math.min(100, percent));
      afterWrap.style.width = `${currentPercent}%`;
      handle.style.left = `${currentPercent}%`;
      labelNow(currentPercent);
    };

    const updateRect = () => {
      sliderRect = slider.getBoundingClientRect();
    };

    const animateTo = (targetPercent, duration = 260) => {
      const start = currentPercent;
      const delta = targetPercent - start;
      const startTime = performance.now();

      const loop = now => {
        const progress = Math.min(1, (now - startTime) / duration);
        setPosition(start + delta * easeOutQuint(progress));

        if (progress < 1) {
          frame = requestAnimationFrame(loop);
        }
      };

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(loop);
    };

    const easeOutQuint = t => 1 - Math.pow(1 - t, 5);

    const pointerToPercent = event => {
      const clientX = event.clientX ?? (event.touches && event.touches[0]?.clientX);
      if (typeof clientX !== 'number') return currentPercent;
      const position = Math.max(0, Math.min(clientX - sliderRect.left, sliderRect.width));
      return sliderRect.width ? (position / sliderRect.width) * 100 : currentPercent;
    };

    const startDrag = event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      isDragging = true;
      handle.classList.add('dragging');
      updateRect();
      hint?.classList.add('hidden');
      localStorage.setItem(localKey, 'true');
      event.preventDefault();
      if (typeof slider.setPointerCapture === 'function' && event.pointerId != null) {
        slider.setPointerCapture(event.pointerId);
      }
      setPosition(pointerToPercent(event));
    };

    const endDrag = event => {
      if (!isDragging) return;
      isDragging = false;
      handle.classList.remove('dragging');
      if (typeof slider.releasePointerCapture === 'function' && event.pointerId != null) {
        slider.releasePointerCapture(event.pointerId);
      }
    };

    const moveDrag = event => {
      if (!isDragging) return;
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPosition(pointerToPercent(event)));
    };

    const keyControl = event => {
      if (document.activeElement !== handle) return;
      const step = event.shiftKey ? 10 : 2;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        setPosition(currentPercent - step);
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        setPosition(currentPercent + step);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        setPosition(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        setPosition(100);
      }
    };

    const handleInteraction = () => {
      hint?.classList.add('hidden');
      localStorage.setItem(localKey, 'true');
    };

    const onResize = () => {
      updateRect();
      setPosition(currentPercent);
    };

    slider.addEventListener('pointerdown', startDrag, { passive: false });
    window.addEventListener('pointermove', moveDrag, { passive: false });
    window.addEventListener('pointerup', endDrag, { passive: true });
    window.addEventListener('pointercancel', endDrag, { passive: true });
    handle.addEventListener('keydown', keyControl, { passive: true });
    handle.addEventListener('focus', handleInteraction, { passive: true });
    handle.addEventListener('pointerenter', handleInteraction, { passive: true });
    handle.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('resize', debounce(onResize, 120), { passive: true });

    if (!localStorage.getItem(localKey)) {
      setTimeout(() => animateTo(55, 260), 300);
      setTimeout(() => animateTo(50, 260), 700);
    }

    setPosition(50);
  };

  const initTintVisualizer = () => {
    const buttons = qsa('.shade-btn');
    const preview = qs('#tintPreview');
    const title = qs('#shadeTitle');
    const description = qs('#shadeDescription');

    if (!buttons.length || !(preview && title && description)) return;

    const resetActiveState = activeButton => {
      buttons.forEach(button => button.classList.toggle('active', button === activeButton));
    };

    const updatePreview = button => {
      const src = button.dataset.img;
      const alt = button.dataset.title || '';
      const desc = button.dataset.desc || '';
      if (!src) return;

      preview.style.opacity = '0';
      preview.style.transform = 'translateY(0)';

      const handleLoad = () => {
        preview.style.opacity = '1';
        preview.removeEventListener('load', handleLoad);
      };

      preview.addEventListener('load', handleLoad);
      preview.src = src;
      preview.alt = alt;
      title.textContent = alt;
      description.textContent = desc;
    };

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        resetActiveState(button);
        updatePreview(button);
      });
    });
  };

  const initContactForm = () => {
    const form = qs('.contact-form');
    const formMessage = qs('#formMessage');
    if (!form || !formMessage) return;

    const showMessage = (message, isError = false) => {
      formMessage.textContent = message;
      formMessage.style.color = isError ? '#f47777' : 'var(--gold)';
    };

    const validateEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const validatePhone = value => /^\+?[0-9\s().-]{7,20}$/.test(value);

    form.addEventListener('submit', event => {
      event.preventDefault();

      const fields = Array.from(form.querySelectorAll('input, select, textarea'));
      let firstInvalid = null;
      let isValid = true;

      fields.forEach(field => {
        field.classList.remove('input-error');
        const value = field.value.trim();

        if (field.required && !value) {
          isValid = false;
          field.classList.add('input-error');
          firstInvalid = firstInvalid || field;
        }

        if (field.type === 'email' && value && !validateEmail(value)) {
          isValid = false;
          field.classList.add('input-error');
          firstInvalid = firstInvalid || field;
        }

        if (field.type === 'tel' && value && !validatePhone(value)) {
          isValid = false;
          field.classList.add('input-error');
          firstInvalid = firstInvalid || field;
        }
      });

      if (!isValid) {
        showMessage('Please complete all required fields with valid information.', true);

        if (firstInvalid) {
          firstInvalid.focus();
        }

        return;
      }

      showMessage(
        'Thank you! Your quote request has been submitted. We will contact you shortly.',
        false
      );

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'quote_form_submit', {
          event_category: 'lead',
          event_label: 'Quote Form Submitted',
          value: 1
        });
      }

      form.reset();
    });
  };


  /*==================================================
    FAQ ACCORDION
  ==================================================*/

  const initFaqAccordion = () => {
    const faqItems = qsa('.faq-item');

    if (!faqItems.length) return;

    faqItems.forEach(item => {

      const answer = item.querySelector('p');

      if (!answer) return;

      answer.style.display = 'none';
      item.setAttribute('aria-expanded', 'false');

      item.addEventListener('click', () => {

        const isOpen = answer.style.display === 'block';

        faqItems.forEach(otherItem => {

          const otherAnswer = otherItem.querySelector('p');

          if (otherAnswer) {
            otherAnswer.style.display = 'none';
            otherItem.setAttribute('aria-expanded', 'false');
          }

        });

        if (!isOpen) {
          answer.style.display = 'block';
          item.setAttribute('aria-expanded', 'true');
        }

      });

    });
  };


  /*==================================================
    GOOGLE ANALYTICS TRACKING
  ==================================================*/

  const initAnalyticsTracking = () => {

    if (typeof window.gtag !== 'function') {
      return;
    }


    // Phone Call Clicks

    qsa('a[href^="tel:"]').forEach(link => {

      link.addEventListener('click', () => {

        window.gtag('event', 'phone_call', {
          event_category: 'engagement',
          event_label: link.getAttribute('href'),
          value: 1
        });

      });

    });


    // Quote / Contact Clicks

    qsa('a[href*="contact.html"]').forEach(link => {

      link.addEventListener('click', () => {

        window.gtag('event', 'quote_request', {
          event_category: 'lead',
          event_label: 'Contact / Quote Button',
          value: 1
        });

      });

    });


    // Google Review Clicks

    qsa('a[href*="g.page"]').forEach(link => {

      link.addEventListener('click', () => {

        window.gtag('event', 'google_review_click', {
          event_category: 'engagement',
          event_label: 'Google Review',
          value: 1
        });

      });

    });


    // Facebook Clicks

    qsa('a[href*="facebook.com"]').forEach(link => {

      link.addEventListener('click', () => {

        window.gtag('event', 'facebook_click', {
          event_category: 'engagement',
          event_label: 'Facebook',
          value: 1
        });

      });

    });

  };


  /*==================================================
    INITIALIZE APP
  ==================================================*/

    const initApp = () => {

    initMobileNavigation();

    initStickyHeader();

    initSmoothScroll();

    initScrollReveal();

    initCounters();

    initSalePopup();

    initComparisonSlider();

    initTintVisualizer();

    initContactForm();

    initFaqAccordion();

    initAnalyticsTracking();

};


  if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', initApp);

  } else {

    initApp();

  }

})();
