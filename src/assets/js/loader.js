// loader Start
document.addEventListener("DOMContentLoaded", function () {
  const loader = document.querySelector(".loader");
  if (!loader) return;

  function hideLoader() {
    if (loader.style.display === "none" || loader.classList.contains("hidden")) return;
    loader.style.transition = "opacity 0.35s ease-out";
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(function () {
      loader.classList.add("hidden");
      loader.style.display = "none";
    }, 350);
  }

  if (document.readyState === "complete") {
    setTimeout(hideLoader, 300);
  } else {
    window.addEventListener("load", function () {
      setTimeout(hideLoader, 300);
    });
    // Failsafe timeout so the page never gets stuck
    setTimeout(hideLoader, 1200);
  }
});
