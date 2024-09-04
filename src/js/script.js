import {
  invertColor,
  hideElem,
  addClass,
  removeClass,
  autoCloseMobileMenu,
  formValidator,
  AJAX,
} from './helpers.js';

/* GLOBAL VARIABLES */
const mainMenu = Array.from(document.querySelectorAll('.main-menu'));
const blockBtns = document.querySelector('.block-buttons');

window.addEventListener('load', ev => {
  if (document.querySelector('.curtains')) {
    setTimeout(() => {
      document.querySelector('.curtains').classList.add('loaded');
      document.querySelector('.preloader').classList.add('loaded');
    }, 5000);
  }
});

// window.addEventListener('load', validator, false);
/* ------------------------------------------------------------- */

/* Preloader and curtains - click link*/
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  nav.addEventListener('click', function (ev) {
    if (ev.target.nodeName.toLowerCase() === 'a') {
      ev.preventDefault();
      document.querySelector('.curtains').classList.remove('loaded');
      setTimeout(() => {
        location.assign(ev.target.href);
      }, 1000);
    }
  });
})();

/* Scroll animation */
(function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother);

  function goToSection(i, slide, anim = false) {
    Array.from(document.querySelectorAll('.slide-active')).forEach(el =>
      el.classList.remove('slide-active')
    );
    slide.classList.add('slide-active');

    gsap.to(window, {
      scrollTo: { y: i * innerHeight, autoKill: false },
      duration: 1,
    });
    /* if (anim) {
      anim.restart();
    } */
  }

  const instances = [];

  gsap.utils.toArray('.slide').forEach((slide, i) => {
    // instances.push();
    ScrollTrigger.create({
      trigger: slide,
      onEnter: () => goToSection(i, slide),
    });

    // instances.push();
    ScrollTrigger.create({
      trigger: slide,
      start: 'bottom bottom',
      onEnterBack: () => goToSection(i, slide),
    });
  });

  gsap.utils.toArray('.slide').forEach((slide, i) => {
    ScrollTrigger.create({
      trigger: slide,
      start: 'top 1px',
      end: 'bottom 1px',
      pin: true,
      pinSpacing: false,
      onEnter: function () {
        invertColor(
          document.querySelector('.nav'),
          window.getComputedStyle(slide).backgroundColor
        );
        invertColor(
          document.querySelector('.block-buttons'),
          window.getComputedStyle(slide).backgroundColor
        );
      },
      onEnterBack: function () {
        invertColor(
          document.querySelector('.nav'),
          window.getComputedStyle(slide).backgroundColor
        );
        invertColor(
          document.querySelector('.block-buttons'),
          window.getComputedStyle(slide).backgroundColor
        );
      },
    });
  });

  const viewport = document.querySelector('.mobile-menu__container');
  const mobMenuItems = gsap.utils.toArray('.mobile-menu__target');

  mobMenuItems.forEach((item, i) => {
    gsap.to(item, {
      scrollTrigger: {
        scroller: viewport,
        trigger: item,
        toggleClass: 'mobile-menu__item--active',
        start: 'bottom bottom',
        end: 'top 20px',
        // markers: true,
        scrub: true,
      },
      fontSize: '250%',
      letterSpacing: '2.5rem',
      duration: 2,
    });
  });

  /* --------------------------------------- */
  // arrow animations

  /* let arrow = document.querySelector('.arrow');
let arrowRight = document.querySelector('.arrow-right');

if (arrow) {
  gsap.to(arrow, { y: 12, ease: 'power1.inOut', repeat: -1, yoyo: true });
}

if (arrowRight) {
  gsap.to(arrowRight, { x: -12, ease: 'power1.inOut', repeat: -1, yoyo: true });
} */
  /* --------------------------------------- */
})();

/* Custom cursor and effect */
(function () {
  const cursor = document.querySelector('.cursor');
  const cursorTray = document.querySelector('.cursor-tray');
  const hoverPoints = Array.from(document.querySelectorAll('[data-point]'));

  // The function takes the coordinates of the cursor movement and passes it to the custom cursor
  const mouseMove = function (ev) {
    let x = ev.clientX;
    let y = ev.clientY;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    setTimeout(() => {
      cursorTray.style.left = x + 'px';
      cursorTray.style.top = y + 'px';
    }, 100);
  };

  // Scale cursor point
  const addZoomCursorPoint = function (ev) {
    cursorTray.classList.add('scale');
    cursor.classList.add('scale');
  };

  // Remove scale cursor point
  const removeZoomCursorPoint = function (ev) {
    cursorTray.classList.remove('scale');
    cursor.classList.remove('scale');
  };

  document.addEventListener('mousemove', mouseMove);

  hoverPoints.forEach(point => {
    point.addEventListener('mouseenter', addZoomCursorPoint);
    point.addEventListener('mouseout', removeZoomCursorPoint);
  });
})();

// Control the Forms in Footer (button and window)
(function () {
  const footer = document.querySelector('.footer');
  const nav = document.querySelector('.nav');
  const mainTitle = document.querySelector('.main-title');
  const mainMenu = document.querySelector('.main-menu');
  const fullscreen = document.querySelector('.fullscreen');
  const logo = document.querySelector('.nav .logo img');
  const trigger = document.querySelector('.mobile-menu-trigger');
  const btns = Array.from(document.querySelectorAll('.nav .btn'));

  if (!footer) return;

  const handlerNavBtns = function (ev) {
    const nameForm = ev.target.dataset.nameForm;
    showForm(footer, nameForm);
  };

  btns.forEach(btn => btn.addEventListener('click', handlerNavBtns));

  // Show elements on a page
  function showElemsOnPage(mainNode, overlayElem) {
    if (overlayElem.querySelector('.contact-us')) {
      removeClass([overlayElem.querySelector('.contact-us')], ['hidden']);
    }

    const nodes = [mainNode, mainMenu, trigger, blockBtns];
    const classes = ['show', 'getout-top', 'getout-top', 'getout-bottom'];
    addClass(nodes, classes);

    setTimeout(() => {
      addClass([overlayElem], ['visible']);
      document.querySelector('.header').style.width = '75%';
    }, 500);

    document.body.classList.add('scroll-lock');

    if (mainTitle) addClass([mainTitle], ['hidden']);

    if (!nav) return;

    if (logo.src.match('-dark.')) {
      logo.src = 'img/logo-light.png';
    }
  }

  // Hide elements on a page
  function hideElemsOnPage(form) {
    form.preventDefault();
    const mainNode = form.target.closest('.footer');
    const overlay = form.target.closest('.form__overlay');
    const nodes = [mainNode, overlay, mainMenu, trigger, blockBtns];
    const classes = [
      'show',
      'visible',
      'getout-top',
      'getout-top',
      'getout-bottom',
    ];

    if (overlay.querySelector('.contact-us')) {
      // console.log(overlay.querySelector('.contact-us'));
      addClass([overlay.querySelector('.contact-us')], ['hidden']);
      setTimeout(() => {
        removeClass(nodes, classes);
      }, 500);
    } else {
      removeClass(nodes, classes);
    }

    document.querySelector('.header').style.width = '100%';

    document.body.classList.remove('scroll-lock');

    if (mainTitle) removeClass([mainTitle], ['hidden']);

    if (logo.src.match('-light.')) {
      // console.log(logo.src.match('-light.'));
      logo.src = 'img/logo-dark.png';

      if (fullscreen) {
        if (
          window.getComputedStyle(fullscreen).backgroundColor === 'rgb(0, 0, 0)'
        ) {
          logo.src = 'img/logo-light.png';
        }
      }
    }
  }

  // Render markup for different forms in the footer (getcard and contact us)
  function showForm(node, nameForm) {
    autoCloseMobileMenu();
    // console.log('Show form node: ', node);
    const forms = Array.from(node.querySelectorAll('.form'));
    // console.log(forms);
    forms.forEach(form => {
      if (form.dataset.form === nameForm) {
        const overlay = form.querySelector('.form__overlay');
        // console.log(overlay);
        showElemsOnPage(node, overlay);

        const btnBack = overlay.querySelector('.btn--back');

        if (btnBack) {
          btnBack.addEventListener('click', hideElemsOnPage);
        } else {
          overlay.addEventListener('click', hideElemsOnPage);
        }

        form.style.display = 'flex';
      } else {
        form.style.display = 'none';
      }
    });
  }
})();

// Audio - click and hover
(function () {
  function handler(ev) {
    if (
      (ev.type === 'mouseover' &&
        ev.target.nodeName.toLowerCase() === 'button') ||
      (ev.type === 'mouseover' && ev.target.nodeName.toLowerCase() === 'a')
    ) {
      const sound = document.getElementById('hover');
      sound.muted = false;
      sound.volume = 0.1;
      sound.play();
    }
    if (
      (ev.type === 'click' && ev.target.nodeName.toLowerCase() === 'button') ||
      (ev.type === 'click' && ev.target.nodeName.toLowerCase() === 'a')
    ) {
      const sound = document.getElementById('click');
      sound.muted = false;
      sound.volume = 0.1;
      sound.play();
    }
  }
  ['click', 'mouseover'].forEach(ev =>
    document.body.addEventListener(ev, handler)
  );
})();

// Modal window - Desclaimer and Follow
(function () {
  const btnDesclaimer = document.querySelector('.btn--desclaimer');
  const btnFollow = document.querySelector('.btn--follow');
  const mainTitle = Array.from(document.querySelectorAll('.fullscreen__title'));

  const mobileMenu = Array.from(
    document.querySelectorAll('.mobile-menu-trigger')
  );
  // console.log(mobileMenu);
  if (!blockBtns) return;
  if (!mobileMenu) return;

  blockBtns.addEventListener('click', ev => {
    const btn = ev.target.closest('.btn');
    if (!btn) return;

    if (btn.classList.contains('btn--desclaimer')) {
      document.querySelector('.desclaimer').classList.toggle('overlay');
      controlMadalWindow(btn, btnFollow);
      hideElem(mobileMenu, 'getout-top');
    }
    if (btn.classList.contains('btn--follow')) {
      document.querySelector('.follow').classList.toggle('overlay');
      controlMadalWindow(btn, btnDesclaimer);
    }
  });

  function controlMadalWindow(btn, nameBtn) {
    document.body.classList.toggle('scroll-lock');
    btn.style.position = 'relative';
    btn.style.zIndex = 4;
    nameBtn.classList.toggle('getout-bottom');
    hideElem(mainTitle, 'hidden');
    hideElem(mainMenu, 'getout-top');

    const activeSlide = document.querySelector('.slide-active .slide__text');

    if (!activeSlide) return;

    activeSlide.classList.toggle('hidden');
  }
})();

/* SENDING FORMS */

(function () {
  const btnsSubmit = Array.from(
    document.querySelectorAll('.form button[type=submit]')
  );

  btnsSubmit.forEach(btn => btn.addEventListener('click', formSend));

  async function formSend(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const form = ev.target.closest('.needs-validation');
    console.log(ev);
    console.log(form);
    // console.log(Object.fromEntries([...formData]));

    try {
      
      if (formValidator(form)) {
        this.classList.add('motion');

        // Запустить прелоадер
        document.querySelector('.footer .small-preloader').classList.add('loading');

        const formData = new FormData(form);

        form.reset();

        const data = await AJAX('sendmail.php', formData, 'POST');

        if (data.status) {
          // Удалить прелоадер
           if (document.querySelector('.footer .small-preloader')) {
              document.querySelector('.footer .small-preloader').classList.remove('loading');
          }
          // console.log(data);
          location.assign(`confirmed.html`);
        }
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
})();

/* ------------------------------------- */

/* --------------------------------------------------------------------- */

/* --------------- Mobile menu ------------- */
(function () {
  const mobileMenu = document.querySelector('.mobile-menu');
  const trigger = document.querySelector('.mobile-menu-trigger');
  // const border = mobileMenu.querySelector('.border--vertical');
  // const mobileMenuBody = document.querySelector('.mobile-menu__body');

  if (!trigger) return;

  trigger.addEventListener('click', function (ev) {
    // border.classList.remove('run');
    this.classList.toggle('active-trigger');
    document.body.classList.toggle('scroll-lock');
    blockBtns.classList.toggle('getout-bottom');

    if (this.classList.contains('active-trigger'))
      // setTimeout(() => border.classList.add('run'), 500);

    invertColor(mobileMenu, 'rgb(0, 0, 0)');

    const activeSlide = document.querySelector('.slide-active');

    if (activeSlide) {
      const bgColor =
        window.getComputedStyle(activeSlide).backgroundColor ===
        'rgb(255, 255, 255)';

      if (bgColor) {
        trigger
          .querySelectorAll('.line')
          .forEach(line => line.classList.toggle('invert'));
      }
    }

    const openFollow =
      mobileMenu.parentElement.querySelectorAll('.open-follow');
    console.log(openFollow);
    if (openFollow) {
      openFollow.forEach(el => el.classList.remove('open-follow'));
    }
  });
})();

(function () {
  const btnMobileFollow = document.querySelector('.mobile-menu__btn--follow');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuItemFollow = document.querySelector(
    '.mobile-menu__item--follow'
  );
  const mobileFollow = document.querySelector('.mobile-follow');

  const elems = [
    btnMobileFollow,
    mobileMenu,
    mobileMenuItemFollow,
    mobileFollow,
  ];

  const classes = Array(elems.length);

  classes.fill('open-follow');

  if (!btnMobileFollow) return;

  btnMobileFollow.addEventListener('click', function (ev) {
    /* 
    Add class to:
    .open-follow.mobile-menu
    .open-follow.mobile-menu__item--follow
    .open-follow.mobile-follow
    */
    addClass(elems, classes);
  });
})();

(function () {
  const video = document.querySelector('#video-bg');
  if (!video) return;

  if (window.innerWidth > 768) {
    const source = `<source src="video/home-bg.mp4" type="video/mp4" />`;
    video.innerHTML = source;
  } else {
    const source = `<source src="video/mob-home-bg.webm" type="video/webm" />`;
    video.innerHTML = source;
  }
})();

/* -------------------------------------- */

/* Vertical navigation */
/* (function () {
  const verticalNav = document.querySelector('#cd-vertical-nav');
  const slides = Array.from(document.querySelectorAll('.slide'));

  const setVerticalNav = function () {
    let tmpl = '';
    if (!slides) return;

    if (slides.length - 1 > 1) {
      // -1 slide (footer)
      let width = 40;
      for (let i = 0; i < slides.length - 1; i++) {
        width -= 8;
        tmpl += `
          <li>
             <div class="">
               <span class="cd-dot" style="width: ${width}px"></span>
             </div>
           </li>`;
      }

      verticalNav.innerHTML = `<ul>${tmpl}</ul>`;

      const cdDots = Array.from(document.querySelectorAll('.cd-dot'));
      if (!cdDots) return;
      cdDots.map(dot => cdDots[cdDots.length - 1]).forEach((dot, i, dots) => {
        // dot.style.width = `${dotWidth -= 8}px`;
        console.log(dot.offsetWidth)
      });
    }
  };
  setVerticalNav();
})(); */
/* window.addEventListener('scroll', ev => {
  console.log(ev);
}); */

/* (function () {
  const footer = document.querySelector('.footer');
  const overlay = footer.querySelector('.footer__overlay');
  const mainTitle = Array.from(document.querySelectorAll('.fullscreen__title'));

  const showMobileFooter = function (ev) {
    if (ev.target.closest('.btn--contact-us')) {
      footer.classList.add('getout-top');
      overlay.classList.add('visible');
      autoCloseMobileMenu();
      hideElem(mainTitle, 'hidden');
    }
  };

  const hideMobileFooter = function () {
    footer.classList.remove('getout-top');
    overlay.classList.remove('visible');
  };

  document
    .querySelector('.mobile-menu')
    .addEventListener('click', showMobileFooter);

  document
    .querySelector('.footer__overlay')
    .addEventListener('click', hideMobileFooter);
})(); */
