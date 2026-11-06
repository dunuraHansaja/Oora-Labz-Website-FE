import Swiper from "swiper";
import { Navigation ,Autoplay} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

 const testimonial2 = new Swiper(".testimonial2-slider", {
    spaceBetween:20,
    speed: 3000,
    loop: true,
    autoplay: {
      delay: 200,
      disableOnInteraction: false,
    },

    breakpoints: {
      1440: {
        slidesPerView: 3,
        spaceBetween: 20,
      },

      1024: {
        slidesPerView: 3,
        spaceBetween: 15,
      },

      640: {
        slidesPerView: 2,
        spaceBetween: 15,
      },

      0: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
    },

    spaceBetween: 20,
    modules: [Navigation,Autoplay],


  });


  







  
