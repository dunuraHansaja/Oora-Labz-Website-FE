import Swiper from "swiper";
import { EffectCards, Autoplay } from "swiper/modules"; // 👈 yeh zaroori hai
import "swiper/css";
import "swiper/css/effect-cards";

// Cards Effect Swiper
const testimonmial = new Swiper(".testimonial", {
  effect: "cards",
  grabCursor: true,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  modules: [EffectCards,Autoplay],
});



