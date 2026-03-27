const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      toggle.classList.toggle("show-icon");
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  showMenu("nav-toggle", "nav-menu");

  const dropdownItems = document.querySelectorAll(".dropdown__item");

  dropdownItems.forEach((item) => {
    const btn = item.querySelector(".dropdown__toggle");
    const trigger = item.querySelector(".dropdown__trigger");
    let closeTimer;

    if (!btn) return;

    // Click on arrow button
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // close other dropdowns first
      dropdownItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          const otherBtn = otherItem.querySelector(".dropdown__toggle");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      const isOpen = item.classList.toggle("active");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Desktop hover open
    item.addEventListener("mouseenter", () => {
      clearTimeout(closeTimer);

      dropdownItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          const otherBtn = otherItem.querySelector(".dropdown__toggle");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.add("active");
      btn.setAttribute("aria-expanded", "true");
    });

    // Delay close by 400ms
    item.addEventListener("mouseleave", () => {
      closeTimer = setTimeout(() => {
        item.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
      }, 1000);
    });

    // If mouse comes back before timer ends, keep it open
    if (trigger) {
      trigger.addEventListener("mouseenter", () => clearTimeout(closeTimer));
    }

    const menu = item.querySelector(".dropdown__menu");
    if (menu) {
      menu.addEventListener("mouseenter", () => clearTimeout(closeTimer));
    }
  });

  // Click outside closes all
  document.addEventListener("click", (e) => {
    dropdownItems.forEach((item) => {
      if (!item.contains(e.target)) {
        item.classList.remove("active");
        const btn = item.querySelector(".dropdown__toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  });
});