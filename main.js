/* ==========================================================================
   李哲 · 个人简历单页 — 交互脚本
   1. 中英切换（带 localStorage 记忆）
   2. 滚动高亮当前栏目
   3. 移动端菜单
   4. 入场动画
   5. 点击复制邮箱 / 微信号 / QQ
   6. 杂项（年份、链接占位提醒）
   ========================================================================== */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var langToggle = document.getElementById('langToggle');
  var langLabel = langToggle ? langToggle.querySelector('.lang-toggle__label') : null;
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var MOBILE_QUERY = '(max-width: 860px)';
  var LANG_KEY = 'resume:lang';

  /* ---------------------------------------------------------------- 1. i18n */
  // 页面默认是中文，所有可翻译节点的英文文案写在 data-en 里。
  // 首屏先把中文原文缓存到 data-zh，切换时只做 textContent 替换。
  var i18nNodes = Array.prototype.slice.call(document.querySelectorAll('[data-en]'));
  i18nNodes.forEach(function (el) {
    el.dataset.zh = el.textContent.trim();
  });

  function applyLang(lang) {
    var isEn = lang === 'en';

    document.documentElement.lang = isEn ? 'en' : 'zh-CN';

    i18nNodes.forEach(function (el) {
      el.textContent = isEn ? el.dataset.en : el.dataset.zh;
    });

    if (langLabel) langLabel.textContent = isEn ? '中文' : 'EN';
    if (langToggle) {
      langToggle.setAttribute('aria-label', isEn ? '切换到中文' : 'Switch to English');
      langToggle.setAttribute('lang', isEn ? 'zh-CN' : 'en');
    }

    document.title = isEn
      ? 'Jack Wang · Materials Science, XJTU'
      : '王仔涵 · Jack Wang | 个人主页';

    try { localStorage.setItem(LANG_KEY, isEn ? 'en' : 'zh'); } catch (e) {}
  }

  var currentLang = 'zh';
  try {
    if (localStorage.getItem(LANG_KEY) === 'en') currentLang = 'en';
  } catch (e) {}

  if (currentLang === 'en') {
    applyLang('en');
  } else if (langLabel) {
    langLabel.textContent = 'EN';
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      applyLang(currentLang);
    });
  }

  /* --------------------------------------------------- 2. scroll spy + header */
  var ticking = false;

  function updateOnScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var probe = scrollY + header.offsetHeight + 48;
    var active = sections[0];
    var i;

    for (i = 0; i < sections.length; i += 1) {
      var top = sections[i].getBoundingClientRect().top + scrollY;
      if (top <= probe) active = sections[i];
    }

    // 滚到底部时强制高亮最后一个栏目
    if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 4) {
      active = sections[sections.length - 1];
    }

    navLinks.forEach(function (link) {
      var isActive = !!active && link.hash === '#' + active.id;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    header.classList.toggle('is-scrolled', scrollY > 4);
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateOnScroll);
    }
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  window.addEventListener('load', requestScrollUpdate);
  updateOnScroll();

  /* ----------------------------------------------------------- 3. mobile nav */
  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', currentLang === 'en' ? 'Open menu' : '打开菜单');
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute(
        'aria-label',
        isOpen
          ? (currentLang === 'en' ? 'Close menu' : '关闭菜单')
          : (currentLang === 'en' ? 'Open menu' : '打开菜单')
      );
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', function () {
    if (!window.matchMedia(MOBILE_QUERY).matches) closeNav();
  });

  /* ------------------------------------------------------- 4. reveal on scroll */
  var revealNodes = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReduced) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(function () {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    revealNodes.forEach(function (el) { observer.observe(el); });
  } else {
    revealNodes.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ------------------------------------------------- 6. 点击复制微信号 / QQ */
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 1900);
  }

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-9999px';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-copy]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var isEn = currentLang === 'en';

      function onSuccess() {
        showToast((isEn ? 'Copied: ' : '已复制：') + text);
      }

      function onFail() {
        showToast((isEn ? 'Copy manually: ' : '请手动复制：') + text);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onSuccess, function () {
          if (fallbackCopy(text)) { onSuccess(); } else { onFail(); }
        });
      } else if (fallbackCopy(text)) {
        onSuccess();
      } else {
        onFail();
      }
    });
  });

  /* ------------------------------------------------------------- 7. misc */
  var yearNode = document.getElementById('year');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  // 占位链接（href="#"）在本地预览时不要跳回顶部
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href="#"]');
    if (link) event.preventDefault();
  });
})();
