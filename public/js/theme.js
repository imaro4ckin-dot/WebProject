// Dark mode: respects system preference by default, remembers a manual
// choice in localStorage once the person clicks the toggle.
(function () {
  var STORAGE_KEY = 'be-theme'; // 'light' | 'dark'
  var root = document.documentElement;

  function systemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function apply(theme) {
    if (theme) {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme'); // falls back to system preference
    }
  }

  // On load: use the saved choice if there is one, otherwise let CSS
  // follow the system preference (no attribute set).
  var saved = localStorage.getItem(STORAGE_KEY);
  apply(saved);

  function currentEffectiveTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var next = currentEffectiveTheme() === 'dark' ? 'light' : 'dark';
      apply(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  });
})();
