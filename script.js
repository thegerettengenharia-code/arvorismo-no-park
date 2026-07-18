/* ============================================
   ARVORISMO NO PARK — Clean Interactions
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* LOADER */
var loader = document.getElementById('loader');
var loaderLine = loader.querySelector('.loader-line');
var loaderBrand = loader.querySelector('.loader-brand');
var loaderAfter = loaderLine.querySelector('::after');

window.addEventListener('load', function () {
  // Animate brand text
  gsap.to(loaderBrand, { opacity: 1, duration: 0.4, delay: 0.2 });

  // Animate line fill
  gsap.to(loaderLine, {
    '--fill': '100%',
    duration: 1.5,
    delay: 0.4,
    ease: 'power2.inOut',
    onUpdate: function () {
      var progress = this.progress();
      loaderLine.querySelector('::after') || (loaderLine.style.setProperty('--fill', (progress * 100) + '%'));
    }
  });

  // Use a direct approach for the loader line
  var fillEl = document.createElement('div');
  fillEl.style.cssText = 'position:absolute;left:0;top:0;height:100%;width:0%;background:var(--orange);transition:none;';
  loaderLine.appendChild(fillEl);

  gsap.to(fillEl, {
    width: '100%',
    duration: 1.8,
    delay: 0.3,
    ease: 'power2.inOut',
    onComplete: function () {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: function () {
          loader.style.visibility = 'hidden';
          loader.style.pointerEvents = 'none';
          initAll();
        }
      });
    }
  });
});

/* PROGRESS BAR */
function initProgress() {
  var bar = document.querySelector('.progress');
  if (!bar) return;

  window.addEventListener('scroll', function () {
    var scrollTop = window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* NAV */
function initNav() {
  var nav = document.querySelector('.nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* MOBILE MENU */
function initMenu() {
  var btn = document.getElementById('menuBtn');
  var links = document.getElementById('navLinks');
  var open = false;

  btn.addEventListener('click', function () {
    open = !open;
    btn.classList.toggle('active');
    links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
      links.classList.remove('open');
      btn.classList.remove('active');
      open = false;
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* MARQUEE */
function initMarquee() {
  var track = document.querySelector('.marquee-track');
  if (!track) return;

  var pos = 0;
  var speed = 0.8;
  var lastScroll = 0;

  function tick() {
    var delta = window.pageYOffset - lastScroll;
    lastScroll = window.pageYOffset;
    var boost = Math.abs(delta) * 0.015;

    pos -= speed + boost;

    var first = track.querySelector('.marquee-item');
    if (first && Math.abs(pos) >= first.offsetWidth) {
      pos += first.offsetWidth;
    }

    track.style.transform = 'translateX(' + pos + 'px)';
    requestAnimationFrame(tick);
  }
  tick();
}

/* FORM */
function initForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.querySelector('input[name="name"]').value.trim();
    var email = form.querySelector('input[name="email"]').value.trim();
    if (!name || !email) return;

    var btnText = form.querySelector('.btn span');
    var original = btnText.textContent;

    btnText.textContent = 'Enviado!';
    form.reset();

    var msg = document.getElementById('formSuccess');
    msg.classList.add('visible');

    setTimeout(function () {
      btnText.textContent = original;
      msg.classList.remove('visible');
    }, 4000);
  });
}

/* ANIMATIONS */
function initAnimations() {
  // Hero entrance
  var tl = gsap.timeline({ delay: 0.1 });

  tl
    .from('#navLogo', { opacity: 0, scale: 0.8, duration: 0.8, ease: 'power3.out' })
    .from('.nav-links li', { opacity: 0, y: -12, stagger: 0.06, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .from('#heroTag', { opacity: 0, x: -20, duration: 0.8, ease: 'power3.out' }, '-=0.3')
    .from('.hero-tag-line', { scaleX: 0, duration: 0.6, ease: 'power3.out', transformOrigin: 'left' }, '-=0.4')
    .from('.hero-logo', { opacity: 0, scale: 0.9, duration: 0.8, ease: 'power3.out' }, '-=0.3')
    .from('#heroTitle .line span', { y: '100%', opacity: 0, stagger: 0.1, duration: 1, ease: 'power4.out' }, '-=0.5')
    .from('#heroDesc', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('#heroActions', { opacity: 0, y: 15, duration: 0.7, ease: 'power3.out' }, '-=0.4');

  // Hero bg slow zoom
  setTimeout(function () {
    document.querySelector('.hero').classList.add('loaded');
  }, 100);

  // Hero parallax
  gsap.to('.hero-bg', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    }
  });

  // Scroll reveals
  gsap.utils.toArray('.reveal').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  gsap.utils.toArray('.reveal-left').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }
    );
  });

  gsap.utils.toArray('.reveal-right').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, x: 30 },
      {
        opacity: 1, x: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }
    );
  });

  // Cards — stagger
  var cards = gsap.utils.toArray('.reveal-scale');
  if (cards.length) {
    gsap.fromTo(cards,
      { opacity: 0, y: 20, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.servicos-grid',
          start: 'top 85%'
        }
      }
    );
  }

  // Stats
  gsap.utils.toArray('.stat-num').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' }
      }
    );
  });
}

/* GALLERY FILTER */
function initGalleryFilter() {
  var btns = document.querySelectorAll('.filter-btn');
  var items = document.querySelectorAll('.galeria-item');

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');

      items.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-cat') === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* LIGHTBOX */
function initLightbox() {
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightboxImg');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var prevBtn = lightbox.querySelector('.lightbox-prev');
  var nextBtn = lightbox.querySelector('.lightbox-next');
  var items = document.querySelectorAll('.galeria-item');
  var currentIndex = 0;
  var visibleItems = [];

  function getVisibleItems() {
    visibleItems = [];
    items.forEach(function (item) {
      if (!item.classList.contains('hidden')) {
        visibleItems.push(item);
      }
    });
  }

  function openLightbox(index) {
    getVisibleItems();
    currentIndex = index;
    var img = visibleItems[currentIndex].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    var img = visibleItems[currentIndex].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    var img = visibleItems[currentIndex].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () {
      getVisibleItems();
      var visIndex = visibleItems.indexOf(item);
      if (visIndex >= 0) openLightbox(visIndex);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

/* INIT */
function initAll() {
  initProgress();
  initNav();
  initMenu();
  initMarquee();
  initForm();
  initAnimations();
  initGalleryFilter();
  initLightbox();
  ScrollTrigger.refresh();
}
