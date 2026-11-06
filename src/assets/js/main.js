// import "preline";
import AOS from "aos";
import "aos/dist/aos.css";
import "./testimonial.js";
import "./testimonial2.js";
import "./home2Slider.js";
import "./home-modern.js";
import Lenis from 'lenis';
import SplitType from 'split-type';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);



const text = new SplitType('.headline', { types: 'words, chars' });
gsap.utils.toArray(".headline").forEach((headline) => {
  gsap.from(headline.querySelectorAll(".char"), {
   x: 50,
  opacity: 0,
  stagger: 0.03,
  duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: headline,
      start: "top 80%",           
      toggleActions: "play none none none",
      once: true                  
    }
  });
});





  //  AOS.init();
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    AOS.init({
      once: true,
      duration: 700,
      offset: 100,
    });

    window.dispatchEvent(new Event("resize"));
    AOS.refresh();
  }, 500);
});


//back to top Start
var toTopButton = document.getElementById("to-top-button");

// On scroll event, toggle button visibility based on scroll position
if (toTopButton) {
  window.onscroll = function () {
    if (
      document.body.scrollTop > 500 ||
      document.documentElement.scrollTop > 500
    ) {
      toTopButton.classList.remove("hidden");
    } else {
      toTopButton.classList.add("hidden");
    }
  };

  // Function to scroll to the top of the page smoothly
  window.goToTop = function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
}

// lenis for function 

const lenis = new Lenis({
  autoRaf: true,
});



