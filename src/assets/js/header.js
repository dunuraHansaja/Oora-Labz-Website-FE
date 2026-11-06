

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const dropdownBtns = document.querySelectorAll(".dropdown-btn");
  const showSearch = document.getElementById("showSearch");
  const searchBar = document.getElementById("searchBar");
  const closeSearch = document.getElementById("closeSearch");
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("#mobile-menu a");
  const overlay = document.getElementById("overlay");

  function toggleMenu() {
    mobileMenu.classList.toggle("translate-x-full");
    mobileMenu.classList.toggle("open");

    const isOpen = mobileMenu.classList.contains("open");
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      overlay.classList.remove("hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      overlay.classList.add("hidden");
    }

    closeIcon.classList.toggle("block");
    document.body.classList.toggle("overflow-hidden");
  }
  menuToggle.addEventListener("click", toggleMenu);

  dropdownBtns.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      const dropdownContent = this.nextElementSibling;
      const icon = this.querySelector("i");

      if (dropdownContent.classList.contains("opacity-0")) {
        dropdownContent.classList.remove(
          "opacity-0",
          "max-h-0",
          "overflow-hidden",
          "-translate-y-4",
          "pt-0"
        );
        dropdownContent.classList.add(
          "opacity-100",
          "max-h-[500px]",
          "translate-y-0",
          "pt-2"
        );
        icon.classList.remove("ri-add-line");
        icon.classList.add("ri-subtract-fill");
      } else {
        dropdownContent.classList.add(
          "opacity-0",
          "max-h-0",
          "overflow-hidden",
          "-translate-y-4",
          "pt-0"
        );
        dropdownContent.classList.remove(
          "opacity-100",
          "max-h-[500px]",
          "translate-y-0",
          "pt-2"
        );
        icon.classList.add("ri-add-line");
        icon.classList.remove("ri-subtract-fill");
      }
    });
  });

  // Close menu when clicking outside
  function closeMenu() {
    mobileMenu.classList.add("translate-x-full");
    mobileMenu.classList.remove("open");
    overlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    closeIcon.classList.add("block");
    document.body.classList.remove("overflow-hidden");
  }
  overlay.addEventListener("click", () => {
    closeMenu();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) {
      mobileMenu.classList.add("translate-x-full");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("block");
      document.body.classList.remove("overflow-hidden");
    }
  });

  //  Search bar logic
  if (searchBar && showSearch && closeSearch) {
    searchBar.addEventListener("click", () => {
      showSearch.classList.remove("translate-y-full");
    });
    closeSearch.addEventListener("click", () => {
      showSearch.classList.add("translate-y-full");
    });
  }
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath.split("/").pop()) {
       link.classList.remove("text-secondary-white"); 
      link.classList.add("text-primary-light");
    }
  });

  menuToggle.addEventListener("click", toggleMenu);
  closeIcon.addEventListener("click", closeMenu);
});



 