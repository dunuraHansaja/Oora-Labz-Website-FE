import Swiper from "swiper";
import { Thumbs, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/autoplay";

const thumbsSwiper = new Swiper(".myThumbsSwiper", {
  direction: "vertical",
  slidesPerView: 3,
  watchSlidesProgress: true,
  modules: [Thumbs],
});

const mainSwiper = new Swiper(".myMainSwiper", {
  spaceBetween: 10,
  modules: [Thumbs, Autoplay],
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  thumbs: {
    swiper: thumbsSwiper,
  },
});


