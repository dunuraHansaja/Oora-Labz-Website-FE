/**
 * Interactive Script for Oora Labz Modern Home Page
 */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Mobile Menu Drawer
  const toggleBtn = document.getElementById("modernMenuToggle");
  const closeBtn = document.getElementById("modernDrawerClose");
  const drawer = document.getElementById("modernMobileDrawer");
  const overlay = document.getElementById("modernDrawerOverlay");

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove("translate-x-full");
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.add("translate-x-full");
      overlay.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  if (toggleBtn) toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  // Close drawer when clicking nav links inside it
  if (drawer) {
    drawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeDrawer);
    });
  }

  // 2. Active Header Navigation Link Highlighting
  const path = (window.location.pathname || "").toLowerCase();
  const navHome = document.getElementById("navLinkHome");
  const navAbout = document.getElementById("navLinkAbout");

  if (navHome && navAbout) {
    if (path.includes("about-contact") || path.includes("about")) {
      navHome.className = "text-[#4A3E36] hover:text-[#231E1A] font-medium text-sm py-2 transition-colors";
      navAbout.className = "bg-[#231E1A] text-white px-5 py-2 rounded-full font-medium text-sm inline-block shadow-sm";
    } else {
      navHome.className = "bg-[#231E1A] text-white px-5 py-2 rounded-full font-medium text-sm inline-block shadow-sm";
      navAbout.className = "text-[#4A3E36] hover:text-[#231E1A] font-medium text-sm py-2 transition-colors";
    }
  }

  // 3. Header Scroll Effect (Glass backdrop on scroll)
  const header = document.getElementById("modernHeader");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Testimonial 3D 5-Card Rotating Fan Carousel
  const testimonials = [
    {
      quote: "Oora Labz delivered a solution that really improved our operations. The team was professional, responsive, and easy to work with.",
      name: "Nimal Perera",
      role: "Operations Manager",
      avatar: "assets/images/team/team1.png"
    },
    {
      quote: "Working with Oora Labz transformed our customer workflows. Their custom platform reduced our turnaround time by over 40%.",
      name: "Kavinda Silva",
      role: "Head of Product",
      avatar: "assets/images/team/team2.png"
    },
    {
      quote: "From inception to launch, their team was communicative, disciplined, and focused on our business gols. Atrue partner",
      name: "Roshan Fernando",
      role: "Managing Director",
      avatar: "assets/images/home-modern/avatar-roshan-sharp.png"
    },
    {
      quote: "The AI integrations they delivered were seamless and immediately actionable. Exceptional engineering and reliable delivery.",
      name: "Dilini Rajapakse",
      role: "Chief Technology Officer",
      avatar: "assets/images/team/team3.png"
    }
  ];

  let currentSlide = 2; // Default to Roshan Fernando as in mockup
  const deckStage = document.getElementById("testimonialDeckStage");
  const dotsContainer = document.getElementById("testimonialDots");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  const fanCards = deckStage ? Array.from(deckStage.querySelectorAll(".testimonial-fan-card")) : [];

  const slotToClass = {
    "-2": "pos-outer-left",
    "-1": "pos-mid-left",
    "0": "pos-front",
    "1": "pos-mid-right",
    "2": "pos-outer-right"
  };

  function getModIndex(idx) {
    const len = testimonials.length;
    return ((idx % len) + len) % len;
  }

  function populateCardContent(card, dataIndex) {
    const item = testimonials[getModIndex(dataIndex)];
    if (!item || !card) return;
    const avatar = card.querySelector(".fan-avatar");
    const name = card.querySelector(".fan-name");
    const role = card.querySelector(".fan-role");
    const quote = card.querySelector(".fan-quote");

    if (avatar) {
      avatar.src = item.avatar;
      avatar.alt = item.name;
    }
    if (name) name.textContent = item.name;
    if (role) role.textContent = item.role;
    if (quote) quote.textContent = item.quote;
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".testimonial-dot");
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.className = "testimonial-dot w-[22px] h-[4px] bg-[#D8BE9C] transition-all duration-300 cursor-pointer";
      } else {
        dot.className = "testimonial-dot w-[8px] h-[4px] bg-[#F2E3CE] hover:bg-[#D8BE9C] transition-all duration-300 cursor-pointer";
      }
    });
  }

  // Rotate deck by +1 (Next: right card comes to front, front goes left)
  // or -1 (Prev: left card comes to front, front goes right)
  function stepCarousel(direction) {
    if (!fanCards.length) return;

    currentSlide = getModIndex(currentSlide + direction);

    fanCards.forEach((card) => {
      const oldSlot = parseInt(card.getAttribute("data-slot"), 10);
      let newSlot = oldSlot - direction; // Next (+1) shifts card slots -1 (right card slot 1 -> 0 front, 0 -> -1 left)

      card.classList.remove(
        "pos-outer-left",
        "pos-mid-left",
        "pos-front",
        "pos-mid-right",
        "pos-outer-right",
        "is-leaving-front",
        "is-wrapping"
      );

      if (newSlot < -2) {
        newSlot = 2;
        card.classList.add("is-wrapping");
        populateCardContent(card, currentSlide + 2);
      } else if (newSlot > 2) {
        newSlot = -2;
        card.classList.add("is-wrapping");
        populateCardContent(card, currentSlide - 2);
      } else if (oldSlot === 0) {
        card.classList.add("is-leaving-front");
      }

      card.setAttribute("data-slot", String(newSlot));
      card.classList.add(slotToClass[String(newSlot)]);
    });

    updateDots();
  }

  // Click on any background card to bring it toward the front
  fanCards.forEach((card) => {
    card.addEventListener("click", () => {
      const slot = parseInt(card.getAttribute("data-slot"), 10);
      if (slot === 1) {
        stepCarousel(1);
      } else if (slot === -1) {
        stepCarousel(-1);
      } else if (slot === 2) {
        stepCarousel(1);
        setTimeout(() => stepCarousel(1), 240);
      } else if (slot === -2) {
        stepCarousel(-1);
        setTimeout(() => stepCarousel(-1), 240);
      }
    });
  });

  // Generate dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    testimonials.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      dot.className = i === currentSlide
        ? "testimonial-dot w-[22px] h-[4px] bg-[#D8BE9C] transition-all duration-300 cursor-pointer"
        : "testimonial-dot w-[8px] h-[4px] bg-[#F2E3CE] hover:bg-[#D8BE9C] transition-all duration-300 cursor-pointer";
      dot.addEventListener("click", () => {
        if (i === currentSlide) return;
        const len = testimonials.length;
        const forwardDiff = (i - currentSlide + len) % len;
        const backwardDiff = (currentSlide - i + len) % len;
        if (forwardDiff <= backwardDiff) {
          for (let s = 0; s < forwardDiff; s++) {
            setTimeout(() => stepCarousel(1), s * 220);
          }
        } else {
          for (let s = 0; s < backwardDiff; s++) {
            setTimeout(() => stepCarousel(-1), s * 220);
          }
        }
      });
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stepCarousel(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stepCarousel(1);
    });
  }

  // 3b. About Page Testimonial Carousel
  const aboutTestimonials = [
    {
      title: "“Clear communication from start to finish”",
      quote: "They kept us updated at every stage and delivered exactly what was agreed — no surprises, no chasing for updates. It felt like working with an extension of our own team.",
      name: "Verified Client",
      role: "SME Operations Lead",
      avatar: "assets/images/team/lady.png"
    },
    {
      title: "“Delivered ahead of time and on budget”",
      quote: "Working with Oora Labz transformed our customer workflows. Their custom platform reduced our turnaround time by over 40% and gave us full visibility.",
      name: "Nimal Perera",
      role: "Operations Manager",
      avatar: "assets/images/team/team1.png"
    },
    {
      title: "“Strategic thinking meets solid engineering”",
      quote: "From architecture to deployment, the engineering rigor was remarkable. They didn't just build to spec—they improved our platform along the way.",
      name: "Dilini Rajapakse",
      role: "Chief Technology Officer",
      avatar: "assets/images/team/team3.png"
    }
  ];

  let aboutSlide = 0;
  const aboutTitleElem = document.getElementById("aboutTestimonialTitle");
  const aboutQuoteElem = document.getElementById("aboutTestimonialQuote");
  const aboutNameElem = document.getElementById("aboutTestimonialName");
  const aboutRoleElem = document.getElementById("aboutTestimonialRole");
  const aboutAvatarElem = document.getElementById("aboutTestimonialAvatar");
  const aboutPrevBtn = document.getElementById("aboutTestimonialPrev");
  const aboutNextBtn = document.getElementById("aboutTestimonialNext");
  const aboutCardElem = document.getElementById("aboutTestimonialCard");

  function renderAboutSlide(idx) {
    if (!aboutQuoteElem || !aboutNameElem) return;
    const item = aboutTestimonials[idx];
    if (aboutCardElem) {
      aboutCardElem.style.opacity = "0";
      aboutCardElem.style.transform = "translateY(8px)";
    }
    setTimeout(() => {
      if (aboutTitleElem) aboutTitleElem.textContent = item.title;
      if (aboutQuoteElem) aboutQuoteElem.textContent = item.quote;
      if (aboutNameElem) aboutNameElem.textContent = item.name;
      if (aboutRoleElem) aboutRoleElem.textContent = item.role;
      if (aboutAvatarElem) aboutAvatarElem.src = item.avatar;

      if (aboutCardElem) {
        aboutCardElem.style.opacity = "1";
        aboutCardElem.style.transform = "translateY(0)";
      }
    }, 200);
  }

  if (aboutPrevBtn) {
    aboutPrevBtn.addEventListener("click", () => {
      aboutSlide = (aboutSlide - 1 + aboutTestimonials.length) % aboutTestimonials.length;
      renderAboutSlide(aboutSlide);
    });
  }

  if (aboutNextBtn) {
    aboutNextBtn.addEventListener("click", () => {
      aboutSlide = (aboutSlide + 1) % aboutTestimonials.length;
      renderAboutSlide(aboutSlide);
    });
  }

  // 4. Interactive Counter Animation on Scroll
  const counters = document.querySelectorAll(".stat-counter-number");
  let counted = false;

  function runCounters() {
    if (counted) return;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"), 10);
      const suffix = counter.getAttribute("data-suffix") || "";
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = count + suffix;
        }
      }, 35);
    });
    counted = true;
  }

  const statsSection = document.getElementById("statsSection");
  if (statsSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  } else if (statsSection) {
    runCounters();
  }

  // 5. Contact Form Interactive Feedback
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending...</span><i class="ri-loader-4-line animate-spin text-base"></i>`;
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.innerHTML = `<span>Message Sent!</span><i class="ri-check-line text-emerald-600 font-bold text-base"></i>`;
          contactForm.reset();
          setTimeout(() => {
            submitBtn.innerHTML = originalHtml;
            submitBtn.disabled = false;
          }, 3500);
        }, 900);
      }
    });
  }
});

