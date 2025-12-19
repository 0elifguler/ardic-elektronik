(function () {
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (!navToggle || !nav) return;

  function closeNav() {
    nav.classList.remove("nav--open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function (e) {
    e.preventDefault();

    if (nav.classList.contains("nav--open")) {
      closeNav();
    } else {
      nav.classList.add("nav--open");
      navToggle.setAttribute("aria-expanded", "true");
    }
  });

  // Menü linklerine basınca kapat
  var links = nav.querySelectorAll("a");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", closeNav);
  }

  // Dışarı tıklayınca kapat
  document.addEventListener("click", function (e) {
    if (!nav.classList.contains("nav--open")) return;
    if (!nav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  });

  // ESC ile kapat
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });
})();
