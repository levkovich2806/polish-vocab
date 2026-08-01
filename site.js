(function () {
  var THEME_KEY = 'theme';

  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      var label = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
      btn.setAttribute('aria-label', label);
      btn.title = label;
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  applyTheme(getStoredTheme());

  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  var toolbar = document.querySelector('.toolbar');
  var toggle = document.querySelector('.menu-toggle');

  if (toolbar && toggle) {
    toggle.addEventListener('click', function () {
      var open = toolbar.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    toolbar.querySelectorAll('.links a').forEach(function (a) {
      a.addEventListener('click', function () {
        toolbar.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var printBtn = document.querySelector('.print-btn');
  if (!printBtn) return;

  printBtn.addEventListener('click', function () {
    if (window.matchMedia('(max-width: 768px)').matches) {
      downloadPdf(printBtn);
    } else {
      window.print();
    }
  });

  function downloadPdf(btn) {
    var wrap = document.querySelector('.wrap');
    if (!wrap || typeof html2pdf === 'undefined') {
      window.print();
      return;
    }

    btn.disabled = true;
    var label = btn.querySelector('.short') || btn;
    var orig = label.textContent;
    label.textContent = '…';

    var titleEl = document.querySelector('h1.doc-title');
    var filename = ((titleEl && titleEl.textContent) || document.title)
      .replace(/[^\w\s\u0400-\u04FF-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      + '.pdf';

    html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, scrollY: 0, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['css', 'legacy'], before: '.theme' }
      })
      .from(wrap)
      .save()
      .then(function () {
        btn.disabled = false;
        label.textContent = orig;
      })
      .catch(function () {
        btn.disabled = false;
        label.textContent = orig;
        window.print();
      });
  }
})();
