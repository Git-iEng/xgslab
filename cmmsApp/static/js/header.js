/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId);

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    // Add show-menu class to nav menu
    nav.classList.toggle('show-menu');

    // Add show-icon to show and hide the menu icon
    toggle.classList.toggle('show-icon');
  });
};

document.addEventListener('DOMContentLoaded', function () {
  /*=============== MOBILE DROPDOWN TOGGLE FOR PRODUCTS ===============*/
  const toggles = document.querySelectorAll('.dropdown__toggle');

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const item = btn.closest('.dropdown__item');
      const isOpen = item.classList.toggle('is-open');

      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // init hamburger
  showMenu('nav-toggle', 'nav-menu');
});
