/**
 * Interactive Script for Oora Labz Modern Home Page
 */

document.addEventListener("DOMContentLoaded", function () {
  // Strip ".html" and "index.html" from browser address bar
  try {
    const p = window.location.pathname;
    if (p.endsWith(".html") || p.includes(".html")) {
      let clean = p.replace(/\/index\.html$/, "/");
      if (clean.endsWith(".html")) {
        clean = clean.slice(0, -5);
      }
      const target = (clean || "/") + window.location.search + window.location.hash;
      if (target !== window.location.pathname + window.location.search + window.location.hash) {
        window.history.replaceState(null, "", target);
      }
    }
  } catch (_) {}

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
  const page = path.split("/").pop() || "index.html";
  const navHome = document.getElementById("navLinkHome");
  const navAbout = document.getElementById("navLinkAbout");
  const navServices = document.getElementById("navLinkServices");
  const navProducts = document.getElementById("navLinkProducts");
  const navContact = document.getElementById("navLinkContact");

  const defaultNavClass = "text-[#4A3E36] hover:text-[#231E1A] font-medium text-sm py-2 transition-colors";
  const defaultNavDropdownClass = "flex items-center gap-1.5 text-[#4A3E36] hover:text-[#231E1A] font-medium text-sm py-2 transition-colors cursor-pointer";
  const activeNavClass = "bg-[#231E1A] text-white px-5 py-2 rounded-full font-medium text-sm inline-block shadow-sm";
  const activeNavDropdownClass = "bg-[#231E1A] text-white px-5 py-2 rounded-full font-medium text-sm inline-flex items-center gap-1.5 shadow-sm cursor-pointer";

  let activeSection = "home";
  if (page.includes("about") || path.includes("about-contact")) {
    activeSection = "about";
  } else if (page.startsWith("contact") || page === "contact.html") {
    activeSection = "contact";
  } else if (page.includes("service")) {
    activeSection = "services";
  } else if (page.includes("product")) {
    activeSection = "products";
  } else {
    activeSection = "home";
  }

  if (navHome) {
    navHome.className = defaultNavClass;
    if (navAbout) navAbout.className = defaultNavClass;
    if (navServices) navServices.className = defaultNavClass;
    if (navProducts) navProducts.className = defaultNavDropdownClass;
    if (navContact) navContact.className = defaultNavClass;

    if (activeSection === "about" && navAbout) {
      navAbout.className = activeNavClass;
    } else if (activeSection === "contact" && navContact) {
      navContact.className = activeNavClass;
    } else if (activeSection === "services" && navServices) {
      navServices.className = activeNavClass;
    } else if (activeSection === "products" && navProducts) {
      navProducts.className = activeNavDropdownClass;
    } else if (navHome) {
      navHome.className = activeNavClass;
    }
  }

  // Update active state for mobile drawer navigation links
  if (drawer) {
    const mobileNavLinks = drawer.querySelectorAll("nav a");
    const activeMobileClass = "px-4 py-2.5 rounded-full bg-[#211B16] text-white font-semibold text-sm";
    const defaultMobileClass = "px-4 py-2.5 rounded-full text-[#55483F] hover:bg-[#EAE1D6] font-medium text-sm";

    mobileNavLinks.forEach(link => {
      link.className = defaultMobileClass;
      const href = (link.getAttribute("href") || "").toLowerCase();
      if (activeSection === "about" && href.includes("about")) {
        link.className = activeMobileClass;
      } else if (activeSection === "contact" && (href === "contact.html" || href.endsWith("/contact"))) {
        link.className = activeMobileClass;
      } else if (activeSection === "services" && href.includes("service")) {
        link.className = activeMobileClass;
      } else if (activeSection === "products" && href.includes("product")) {
        link.className = activeMobileClass;
      } else if (activeSection === "home" && (href.includes("index") || href === "/")) {
        link.className = activeMobileClass;
      }
    });
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

  // Shared Backend API Helper Functions (Reads strictly from .env without hardcoded credentials)
  const getApiOrigin = () => {
    const origin =
      (typeof import.meta !== "undefined" &&
        import.meta.env &&
        (import.meta.env.VITE_API_ORIGIN || import.meta.env.VITE_API_BASE_URL)) ||
      "";
    return origin.replace(/\/+$/, "");
  };

  const getInquiryAuthCredentials = () => {
    const email =
      (typeof import.meta !== "undefined" &&
        import.meta.env &&
        (import.meta.env.VITE_INQUIRIES_AUTH_EMAIL || import.meta.env.VITE_API_AUTH_EMAIL)) ||
      "";
    const password =
      (typeof import.meta !== "undefined" &&
        import.meta.env &&
        (import.meta.env.VITE_INQUIRIES_AUTH_PASSWORD || import.meta.env.VITE_API_AUTH_PASSWORD)) ||
      "";
    return { email, password };
  };

  const getCommentsAuthCredentials = () => {
    const email =
      (typeof import.meta !== "undefined" &&
        import.meta.env &&
        (import.meta.env.VITE_COMMENTS_AUTH_EMAIL || import.meta.env.VITE_API_AUTH_EMAIL)) ||
      "";
    const password =
      (typeof import.meta !== "undefined" &&
        import.meta.env &&
        (import.meta.env.VITE_COMMENTS_AUTH_PASSWORD || import.meta.env.VITE_API_AUTH_PASSWORD)) ||
      "";
    return { email, password };
  };

  const tokenCache = new Map();

  async function getSanctumToken(credentials, forceRefresh = false) {
    const origin = getApiOrigin();
    if (!origin) {
      throw new Error("API origin is not configured in environment variables (VITE_API_ORIGIN).");
    }
    if (!credentials || !credentials.email || !credentials.password) {
      throw new Error("API credentials are not configured in environment variables.");
    }

    const cacheKey = `${origin}:${credentials.email}`;
    const cached = tokenCache.get(cacheKey);
    if (!forceRefresh && cached && Date.now() < cached.expiresAt) {
      return cached.token;
    }

    const res = await fetch(`${origin}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.token) {
      throw new Error(data.message || `Authentication failed (HTTP ${res.status}).`);
    }

    tokenCache.set(cacheKey, {
      token: data.token,
      expiresAt: Date.now() + 45 * 60 * 1000,
    });
    return data.token;
  }

  function resolveMediaUrl(rawUrl, origin) {
    if (!rawUrl || typeof rawUrl !== "string") return "";
    const cleanUrl = rawUrl.trim();
    if (cleanUrl.startsWith("http://localhost") || cleanUrl.startsWith("http://127.0.0.1")) {
      try {
        const u = new URL(cleanUrl);
        return `${origin}${u.pathname}${u.search}`;
      } catch (_) {
        return cleanUrl;
      }
    }
    if (cleanUrl.startsWith("/")) {
      return `${origin}${cleanUrl}`;
    }
    return cleanUrl;
  }

  // 3. Testimonial 3D 5-Card Rotating Fan Carousel (Dynamic from GET /api/v1/comments/display)
  const deckStage = document.getElementById("testimonialDeckStage");
  const dotsContainer = document.getElementById("testimonialDots");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  const fanCards = deckStage ? Array.from(deckStage.querySelectorAll(".testimonial-fan-card")) : [];

  let currentSlide = 0;
  let dynamicTestimonials = [];
  let autoRotateTimer = null;

  const slotToClass = {
    "-2": "pos-outer-left",
    "-1": "pos-mid-left",
    "0": "pos-front",
    "1": "pos-mid-right",
    "2": "pos-outer-right",
  };

  function getModIndex(idx, len) {
    if (!len) return 0;
    return ((idx % len) + len) % len;
  }

  function populateCardContent(card, dataIndex) {
    if (!card) return;
    const avatar = card.querySelector(".fan-avatar");
    const name = card.querySelector(".fan-name");
    const role = card.querySelector(".fan-role");
    const quote = card.querySelector(".fan-quote");

    if (!dynamicTestimonials.length) {
      if (name) name.textContent = "Client Review";
      if (role) role.textContent = "Verified Feedback";
      if (quote) quote.textContent = "Client feedback will appear here once published.";
      if (avatar) avatar.src = "assets/images/home-modern/oora-logo-mark.png";
      return;
    }

    const item = dynamicTestimonials[getModIndex(dataIndex, dynamicTestimonials.length)];
    if (!item) return;

    if (avatar) {
      if (item.avatar) {
        avatar.src = item.avatar;
      } else {
        avatar.src = "assets/images/home-modern/oora-logo-mark.png";
      }
      avatar.alt = item.name || "Client";
    }
    if (name) name.textContent = item.name || "Client";
    if (role) role.textContent = item.role || "Client";
    if (quote) quote.textContent = item.quote || "";
  }

  function updateDots() {
    if (!dotsContainer) return;
    const len = dynamicTestimonials.length;
    if (len <= 1) {
      dotsContainer.innerHTML = "";
      return;
    }
    const dots = dotsContainer.querySelectorAll(".testimonial-dot");
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.className = "testimonial-dot w-[22px] h-[4px] bg-[#D8BE9C] transition-all duration-300 cursor-pointer";
      } else {
        dot.className = "testimonial-dot w-[8px] h-[4px] bg-[#F2E3CE] hover:bg-[#D8BE9C] transition-all duration-300 cursor-pointer";
      }
    });
  }

  function setupDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    const len = dynamicTestimonials.length;
    if (len <= 1) return;

    for (let i = 0; i < len; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.className =
        i === currentSlide
          ? "testimonial-dot w-[22px] h-[4px] bg-[#D8BE9C] transition-all duration-300 cursor-pointer"
          : "testimonial-dot w-[8px] h-[4px] bg-[#F2E3CE] hover:bg-[#D8BE9C] transition-all duration-300 cursor-pointer";
      dot.addEventListener("click", () => {
        const diff = i - currentSlide;
        if (diff !== 0) {
          stepCarousel(diff);
          startAutoRotate();
        }
      });
      dotsContainer.appendChild(dot);
    }
  }

  function stepCarousel(direction) {
    if (!fanCards.length || dynamicTestimonials.length <= 1) return;

    currentSlide = getModIndex(currentSlide + direction, dynamicTestimonials.length);

    fanCards.forEach((card) => {
      const oldSlot = parseInt(card.getAttribute("data-slot"), 10);
      let newSlot = oldSlot - direction;

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

  function refreshDeckCards() {
    if (!fanCards.length) return;
    fanCards.forEach((card) => {
      const slot = parseInt(card.getAttribute("data-slot"), 10);
      populateCardContent(card, currentSlide + slot);
    });
    setupDots();
    updateDots();

    if (prevBtn && nextBtn) {
      if (dynamicTestimonials.length <= 1) {
        prevBtn.classList.add("opacity-40", "pointer-events-none");
        nextBtn.classList.add("opacity-40", "pointer-events-none");
      } else {
        prevBtn.classList.remove("opacity-40", "pointer-events-none");
        nextBtn.classList.remove("opacity-40", "pointer-events-none");
      }
    }
  }

  function startAutoRotate() {
    stopAutoRotate();
    if (dynamicTestimonials.length > 1) {
      autoRotateTimer = setInterval(() => {
        stepCarousel(1);
      }, 5000);
    }
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  if (deckStage) {
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        stepCarousel(-1);
        startAutoRotate();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        stepCarousel(1);
        startAutoRotate();
      });
    }

    fanCards.forEach((card) => {
      card.addEventListener("click", () => {
        const slot = parseInt(card.getAttribute("data-slot"), 10);
        if (slot === 1) {
          stepCarousel(1);
          startAutoRotate();
        } else if (slot === -1) {
          stepCarousel(-1);
          startAutoRotate();
        } else if (slot === 2) {
          stepCarousel(1);
          setTimeout(() => stepCarousel(1), 220);
          startAutoRotate();
        } else if (slot === -2) {
          stepCarousel(-1);
          setTimeout(() => stepCarousel(-1), 220);
          startAutoRotate();
        }
      });
    });

    deckStage.addEventListener("mouseenter", stopAutoRotate);
    deckStage.addEventListener("mouseleave", startAutoRotate);

    refreshDeckCards();

    // Fetch dynamic comments from GET /api/v1/comments/display
    (async () => {
      try {
        const origin = getApiOrigin();
        if (!origin) return;
        const creds = getCommentsAuthCredentials();
        const token = await getSanctumToken(creds);

        const res = await fetch(`${origin}/api/v1/comments/display`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const records = Array.isArray(json.data) ? json.data : [];

        if (records.length > 0) {
          dynamicTestimonials = records.map((item) => {
            const roleParts = [item.title, item.company].filter(Boolean);
            return {
              id: item.id,
              name: item.name || "Client",
              role: roleParts.join(" • ") || "Client",
              quote: item.comment || "",
              avatar: resolveMediaUrl(item.image_url, origin) || "assets/images/home-modern/oora-logo-mark.png",
            };
          });
          currentSlide = 0;
          refreshDeckCards();
          startAutoRotate();
        }
      } catch (err) {
        console.warn("Failed to load /api/v1/comments/display:", err);
      }
    })();
  }

  // 3b. About Page Write a Review & Comments Section (Dynamic from GET /api/v1/comments/approved & POST /api/v1/comments)
  const aboutCommentsList = document.getElementById("aboutCommentsList");
  const aboutReviewForm = document.getElementById("aboutReviewForm");
  const aboutReviewCount = document.getElementById("aboutReviewCount");
  const reviewFormFeedback = document.getElementById("reviewFormFeedback");

  function showReviewFeedback(type, message) {
    if (!reviewFormFeedback) return;
    reviewFormFeedback.classList.remove(
      "hidden",
      "text-emerald-700",
      "text-red-600"
    );
    if (type === "success") {
      reviewFormFeedback.classList.add("text-emerald-700");
    } else {
      reviewFormFeedback.classList.add("text-red-600");
    }
    reviewFormFeedback.textContent = message;
  }

  function hideReviewFeedback() {
    if (!reviewFormFeedback) return;
    reviewFormFeedback.classList.add("hidden");
    reviewFormFeedback.textContent = "";
  }

  function renderApprovedComments(records, origin) {
    if (!aboutCommentsList) return;
    aboutCommentsList.innerHTML = "";

    if (!records || records.length === 0) {
      const emptyCard = document.createElement("div");
      emptyCard.className =
        "bg-white/85 backdrop-blur-md border border-[#E8DDD1] rounded-[24px] p-6 text-center text-[#745A43] text-sm";
      emptyCard.textContent =
        "No approved reviews yet. Be the first to share your experience with Oora Labz!";
      aboutCommentsList.appendChild(emptyCard);
      return;
    }

    records.forEach((item) => {
      const card = document.createElement("article");
      card.className =
        "bg-white/85 backdrop-blur-md border border-[#E8DDD1] rounded-[24px] p-5 sm:p-6 shadow-[0_12px_28px_rgba(74,56,42,0.06)] transition-all duration-300 hover:shadow-[0_16px_34px_rgba(74,56,42,0.09)]";

      const topRow = document.createElement("div");
      topRow.className = "flex items-center justify-between gap-3 mb-3";

      const authorWrap = document.createElement("div");
      authorWrap.className = "flex items-center gap-3";

      const avatarWrap = document.createElement("div");
      avatarWrap.className =
        "w-12 h-12 rounded-full overflow-hidden bg-[#231E1A] text-[#FAF5EF] flex items-center justify-center text-sm font-bold shrink-0 shadow-xs";

      const resolvedAvatar = resolveMediaUrl(item.image_url, origin);
      if (resolvedAvatar) {
        const img = document.createElement("img");
        img.src = resolvedAvatar;
        img.alt = item.name || "Client";
        img.className = "w-full h-full object-cover comment-card-avatar-img";
        img.onerror = () => {
          img.remove();
          avatarWrap.textContent = (item.name || "C").trim().charAt(0).toUpperCase();
        };
        avatarWrap.appendChild(img);
      } else {
        avatarWrap.textContent = (item.name || "C").trim().charAt(0).toUpperCase();
      }

      const authorMeta = document.createElement("div");
      const authorName = document.createElement("h4");
      authorName.className = "text-sm font-bold text-[#231E1A] leading-tight";
      authorName.textContent = item.name || "Client";

      const roleCompany = [item.title, item.company].filter(Boolean).join(" • ");
      let formattedDate = "";
      if (item.created_at) {
        try {
          const d = new Date(item.created_at);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
          }
        } catch (_) {}
      }
      const submeta = [roleCompany, formattedDate].filter(Boolean).join(" • ");

      const authorRole = document.createElement("p");
      authorRole.className = "text-xs text-[#745A43] mt-0.5";
      authorRole.textContent = submeta || "Verified Client";

      authorMeta.appendChild(authorName);
      authorMeta.appendChild(authorRole);
      authorWrap.appendChild(avatarWrap);
      authorWrap.appendChild(authorMeta);

      topRow.appendChild(authorWrap);
      card.appendChild(topRow);

      const commentEl = document.createElement("p");
      commentEl.className = "text-xs sm:text-sm text-[#615145] leading-relaxed";
      commentEl.textContent = item.comment || "";
      card.appendChild(commentEl);

      aboutCommentsList.appendChild(card);
    });
  }

  async function fetchAndDisplayApprovedComments() {
    if (!aboutCommentsList) return;
    try {
      const origin = getApiOrigin();
      if (!origin) return;
      const creds = getCommentsAuthCredentials();
      const token = await getSanctumToken(creds);

      const res = await fetch(`${origin}/api/v1/comments/approved`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const records = Array.isArray(json.data) ? json.data : [];

      if (aboutReviewCount) {
        const total =
          json.meta && typeof json.meta.total === "number" ? json.meta.total : records.length;
        aboutReviewCount.textContent = String(total);
      }

      renderApprovedComments(records, origin);
    } catch (err) {
      console.warn("Failed to load /api/v1/comments/approved:", err);
    }
  }

  if (aboutCommentsList) {
    fetchAndDisplayApprovedComments();

    if (aboutReviewForm) {
      aboutReviewForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideReviewFeedback();

        const submitBtn = aboutReviewForm.querySelector("button[type='submit']");
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";

        const nameInput = document.getElementById("reviewName");
        const titleInput = document.getElementById("reviewTitle");
        const companyInput = document.getElementById("reviewCompany");
        const commentInput = document.getElementById("reviewComment");

        const name = (nameInput?.value || "").trim();
        const title = (titleInput?.value || "").trim();
        const company = (companyInput?.value || "").trim();
        const comment = (commentInput?.value || "").trim();

        if (!name || !title || !company || !comment) {
          showReviewFeedback("error", "Please fill in all required fields.");
          return;
        }

        if (submitBtn) {
          submitBtn.innerHTML = `<span>Posting...</span><i class="ri-loader-4-line animate-spin text-sm"></i>`;
          submitBtn.disabled = true;
        }

        try {
          const origin = getApiOrigin();
          if (!origin) {
            throw new Error("API origin is not configured (VITE_API_ORIGIN).");
          }

          const creds = getCommentsAuthCredentials();
          if (!creds.email || !creds.password) {
            throw new Error("Comments authentication credentials are not configured.");
          }

          const token = await getSanctumToken(creds);

          const res = await fetch(`${origin}/api/v1/comments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name,
              company,
              title,
              comment,
            }),
          });

          const resData = await res.json().catch(() => ({}));
          if (!res.ok) {
            let errMsg = resData.message || `Failed to submit review (HTTP ${res.status}).`;
            if (resData.errors && typeof resData.errors === "object") {
              const firstErr = Object.values(resData.errors).flat()[0];
              if (firstErr) errMsg = firstErr;
            }
            throw new Error(errMsg);
          }

          showReviewFeedback(
            "success",
            resData.message || "Comment submitted successfully and is pending approval."
          );
          aboutReviewForm.reset();

          if (submitBtn) {
            submitBtn.innerHTML = `<span>Submitted!</span><i class="ri-check-line font-bold text-sm"></i>`;
          }

          // Refresh approved comments feed
          fetchAndDisplayApprovedComments();

          setTimeout(() => {
            if (submitBtn) {
              submitBtn.innerHTML = originalBtnHtml;
              submitBtn.disabled = false;
            }
          }, 3500);
        } catch (err) {
          console.error("Submit Comment Error:", err);
          showReviewFeedback("error", err.message || "Unable to submit comment. Please try again.");
          if (submitBtn) {
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;
          }
        }
      });
    }
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

  // 5. Contact Form API Submission (Auth Login -> Submit Inquiry)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const feedbackEl = document.getElementById("contactFormFeedback");

    const showContactFeedback = (type, message) => {
      if (!feedbackEl) return;
      feedbackEl.classList.remove(
        "hidden",
        "bg-emerald-500/20",
        "border",
        "border-emerald-300/40",
        "text-emerald-50",
        "bg-red-500/20",
        "border-red-300/40",
        "text-red-100"
      );
      if (type === "success") {
        feedbackEl.classList.add(
          "bg-emerald-500/20",
          "border",
          "border-emerald-300/40",
          "text-emerald-50"
        );
      } else {
        feedbackEl.classList.add(
          "bg-red-500/20",
          "border",
          "border-red-300/40",
          "text-red-100"
        );
      }
      feedbackEl.textContent = message;
    };

    const hideContactFeedback = () => {
      if (!feedbackEl) return;
      feedbackEl.classList.add("hidden");
      feedbackEl.textContent = "";
    };

    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      hideContactFeedback();

      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalHtml = submitBtn ? submitBtn.innerHTML : "";

      const formData = new FormData(contactForm);
      const inquiryPayload = {
        first_name: (formData.get("first_name") || formData.get("firstName") || "").toString().trim(),
        last_name: (formData.get("last_name") || formData.get("lastName") || "").toString().trim(),
        email: (formData.get("email") || "").toString().trim(),
        contact_number: (formData.get("contact_number") || formData.get("phone") || "").toString().trim(),
        subject: (formData.get("subject") || "").toString().trim(),
        message: (formData.get("message") || "").toString().trim(),
      };

      if (submitBtn) {
        submitBtn.innerHTML = `<span>Sending...</span><i class="ri-loader-4-line animate-spin text-base"></i>`;
        submitBtn.disabled = true;
      }

      try {
        const origin = getApiOrigin();
        if (!origin) {
          throw new Error("API origin is not configured in environment variables (VITE_API_ORIGIN).");
        }
        const creds = getInquiryAuthCredentials();
        if (!creds.email || !creds.password) {
          throw new Error("Inquiry authentication credentials are not configured in environment variables.");
        }

        // Step 1: Authenticate to retrieve Bearer token
        const token = await getSanctumToken(creds);

        // Step 2: Submit inquiry with Bearer token
        const inquiryResponse = await fetch(`${origin}/api/v1/inquiries`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inquiryPayload),
        });

        const inquiryData = await inquiryResponse.json().catch(() => ({}));
        if (!inquiryResponse.ok) {
          let errMsg = inquiryData.message || `Failed to submit inquiry (HTTP ${inquiryResponse.status}).`;
          if (inquiryData.errors && typeof inquiryData.errors === "object") {
            const firstErr = Object.values(inquiryData.errors).flat()[0];
            if (firstErr) errMsg = firstErr;
          }
          throw new Error(errMsg);
        }

        if (submitBtn) {
          submitBtn.innerHTML = `<span>Message Sent!</span><i class="ri-check-line text-emerald-600 font-bold text-base"></i>`;
        }
        showContactFeedback(
          "success",
          inquiryData.message || "Thank you! Your inquiry has been submitted successfully."
        );
        contactForm.reset();

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = originalHtml;
            submitBtn.disabled = false;
          }
          hideContactFeedback();
        }, 4000);
      } catch (error) {
        console.error("Contact Inquiry Error:", error);
        showContactFeedback(
          "error",
          error.message || "Unable to submit your inquiry right now. Please try again."
        );
        if (submitBtn) {
          submitBtn.innerHTML = originalHtml;
          submitBtn.disabled = false;
        }
      }
    });
  }

  // 6. Services Page Frosted Glass Pop-up Modal
  const serviceModalData = [
    {
      id: "custom-software",
      number: "01",
      eyebrow: "CUSTOM SOFTWARE • WEB & SCALABLE SYSTEMS",
      title: "Custom Software Developments",
      desc: "Off-the-shelf software rarely fits every business perfectly. We engineer bespoke web and desktop applications shaped entirely around how your organization actually works — from initial discovery and system architecture through to deployment, integration, and long-term scale.",
      checks: [
        "Requirements & Technical Architecture",
        "Full-Stack Web & Desktop Apps",
        "Legacy System Modernization",
        "Third-Party API & Tool Integration",
        "Automated QA Testing, Documentation & Release Management"
      ],
      icon: "ri-code-s-slash-line",
      cardHeading: "Built Around Your Workflow",
      cardDesc: "Whether you need a customer-facing SaaS portal, a high-throughput backend, or a complete system rebuild, our engineering team works as an extension of yours with transparent milestones and regular demos.",
      tags: ["Web Portals", "Microservices", "REST & GraphQL APIs", "Enterprise Security"],
      ctaText: "Discuss Custom Software"
    },
    {
      id: "business-applications",
      number: "02",
      eyebrow: "BUSINESS APPLICATIONS • ERP, CRM & AUTOMATION",
      title: "Business Applications",
      desc: "Manual processes slow teams down and create room for error. We deliver centralized CRM, ERP, inventory, and internal management systems that streamline day-to-day operations, replacing disconnected spreadsheets with automated workflows your team actually enjoys using.",
      checks: [
        "Custom CRM, ERP & Operations Portals",
        "Workflow & Approval Automation",
        "Document & Records Digitalization",
        "Seamless Sync with Existing Software",
        "Granular Role-Based Access Control & Audit Trails"
      ],
      icon: "ri-stack-line",
      cardHeading: "Replace Spreadsheets with Connected Systems",
      cardDesc: "We've built platforms like OOLA CRM, FINLOO, and LOOGA — and we bring that same product-grade thinking to every custom ERP, CRM, and internal management tool we deliver for clients.",
      tags: ["Custom ERP & CRM", "Inventory & Billing", "Approval Workflows", "Role-Based Access"],
      ctaText: "Automate Your Operations"
    },
    {
      id: "ai-solutions",
      number: "03",
      eyebrow: "AI & INTELLIGENT SOLUTIONS • CHATBOTS, ML & AGENTS",
      title: "AI & Intelligent Solutions",
      desc: "Artificial intelligence works best when applied to a real, well-understood business problem. We help you identify where AI can genuinely move the needle, then build practical, production-ready tools — from 24/7 customer support chatbots and AI agents to predictive analytics and NLP document automation.",
      checks: [
        "AI Readiness & Use-Case Discovery",
        "Conversational AI Chatbots & Agents",
        "Predictive Analytics & Forecasting",
        "NLP & Intelligent Document Processing",
        "Seamless LLM & Machine Learning Integration into Existing Apps"
      ],
      icon: "ri-sparkling-fill",
      cardHeading: "Pragmatic, Measurable AI",
      cardDesc: "We start focused, prove ROI quickly, and scale what works. Every AI solution is grounded in your domain data and security policies — delivering explainable, reliable results your team can trust.",
      tags: ["AI Assistants", "RAG Knowledge Bases", "Workflow Agents", "Predictive ML"],
      ctaText: "Explore AI Solutions"
    },
    {
      id: "data-bi",
      number: "04",
      eyebrow: "DATA & BI • DASHBOARDS & REPORTS",
      title: "Data & Business Intelligence",
      desc: "Good decisions start with clear visibility. Our Data & Business Intelligence service turns scattered, siloed information into a unified analytics foundation — with automated pipelines, interactive dashboards, and real-time reporting that show exactly how your business is performing.",
      checks: [
        "Data Pipeline & Warehouse Architecture",
        "Interactive BI & Executive Dashboards",
        "Real-Time KPI & Performance Tracking",
        "Data Cleaning, Migration & Unification",
        "Automated Scheduled Reports & Custom Alerting"
      ],
      icon: "ri-bar-chart-grouped-fill",
      cardHeading: "One Reliable Source of Truth",
      cardDesc: "We design every dashboard around the exact questions your leadership and operations teams need answered — turning scattered data across departments into clear, real-time visual insights.",
      tags: ["Executive Dashboards", "ETL Data Pipelines", "KPI Monitoring", "Automated Reports"],
      ctaText: "Unlock Your Data Insights"
    },
    {
      id: "ui-ux",
      number: "05",
      eyebrow: "UI/UX DIGITAL EXPERIENCES • MODERN RESPONSIVE DESIGNS",
      title: "UI/UX & Digital Experiences",
      desc: "Great software is judged as much by how it feels as by how it works. Our UI/UX service covers everything from user research and journey mapping to interactive prototypes and complete design systems — ensuring every product we craft is intuitive, accessible, and unmistakably on-brand.",
      checks: [
        "User Research & Journey Mapping",
        "Wireframing & Interactive Prototyping",
        "Responsive Web & Mobile UI Design",
        "Scalable Component Design Systems",
        "Usability Testing, Accessibility & Conversion Optimization"
      ],
      icon: "ri-layout-masonry-line",
      cardHeading: "Design That Drives Adoption",
      cardDesc: "By prototyping early and validating flows with real users before production code is written, we eliminate friction, reduce training time, and create digital products customers love using.",
      tags: ["Figma Prototypes", "Design Systems", "Mobile-First UX", "WCAG Accessibility"],
      ctaText: "Elevate Your Product UX"
    },
    {
      id: "mobile-apps",
      number: "06",
      eyebrow: "MOBILE APPLICATIONS • IOS, ANDROID & CROSS-PLATFORM",
      title: "Mobile Application Development",
      desc: "Put your business in your customers' and employees' pockets. We design and engineer fast, intuitive mobile applications for iOS and Android — combining sleek native feel, offline capability, real-time synchronization, and seamless backend API integration.",
      checks: [
        "Native & Cross-Platform Development (iOS & Android)",
        "Customer-Facing Apps & Enterprise Field Tools",
        "Offline-First Sync & Push Notification Engines",
        "Biometric Authentication & Secure Mobile Payments",
        "App Store & Google Play Publishing & Lifecycle Updates"
      ],
      icon: "ri-smartphone-line",
      cardHeading: "Engineered for Performance on Every Device",
      cardDesc: "From consumer apps to on-the-ground field service and delivery companions, we build mobile experiences that remain fast, responsive, and reliable even on spotty connections.",
      tags: ["iOS & Android", "Flutter & React Native", "Offline Sync", "Push Notifications"],
      ctaText: "Build Your Mobile App"
    },
    {
      id: "cloud-it",
      number: "07",
      eyebrow: "CLOUD & IT SOLUTIONS • DEVOPS & CLOUD SCALE",
      title: "Cloud & IT Solutions",
      desc: "As your business grows, your infrastructure needs to keep pace without becoming a bottleneck. Our Cloud & IT Solutions service covers cloud migration, DevOps automation, secure hosting architecture, and ongoing system monitoring so your applications stay fast, secure, and always available.",
      checks: [
        "Cloud Migration (AWS, Azure & GCP)",
        "CI/CD Pipeline & DevOps Automation",
        "High-Availability Hosting Architecture",
        "Automated Backups & Disaster Recovery",
        "Cloud Cost Optimization, Security Hardening & Uptime Monitoring"
      ],
      icon: "ri-cloud-line",
      cardHeading: "Resilient, Right-Sized Cloud Infrastructure",
      cardDesc: "We architect cloud environments that match your workload today while auto-scaling effortlessly tomorrow — with security, automated backups, and cost optimization built in from day one.",
      tags: ["AWS / Azure / GCP", "CI/CD DevOps", "Docker & Containers", "24/7 Monitoring"],
      ctaText: "Scale Your Infrastructure"
    },
    {
      id: "it-consulting",
      number: "08",
      eyebrow: "IT CONSULTING • STRATEGY, AUDITS & ARCHITECTURE",
      title: "IT Consulting & Technology Services",
      desc: "Make confident technology investments backed by experienced engineering leadership. We partner with your team to audit existing systems, resolve technical bottlenecks, select the right stack, and design a clear, phased digital transformation roadmap.",
      checks: [
        "Technology Roadmapping & Digital Strategy",
        "System Architecture & Codebase Audits",
        "Vendor, Platform & Tech-Stack Evaluation",
        "Security, Compliance & Scalability Assessments",
        "Fractional CTO & Technical Advisory Support"
      ],
      icon: "ri-compass-3-line",
      cardHeading: "Clarity Before You Commit Code or Budget",
      cardDesc: "We translate complex technical trade-offs into plain business outcomes — helping you avoid costly rewrites, choose the right architecture, and ship with confidence.",
      tags: ["Tech Roadmaps", "System Audits", "Architecture Design", "Security Review"],
      ctaText: "Book a Strategy Session"
    },
    {
      id: "automation-digital",
      number: "09",
      eyebrow: "AUTOMATION & DIGITAL TRANSFORMATION • RPA & PAPERLESS WORKFLOWS",
      title: "Automation & Digital Transformations",
      desc: "Eliminate repetitive manual tasks and modernize legacy operations from end to end. We connect your tools, automate multi-step business rules, implement robotic process automation (RPA), and transition paper-heavy departments into fast, traceable digital workflows.",
      checks: [
        "End-to-End Business Process Automation (BPA & RPA)",
        "Paperless Office & Digital Approval Pipelines",
        "Automated Bulk SMS, WhatsApp & Email Notification Systems",
        "Cross-Platform Webhook & API Orchestration",
        "Legacy Spreadsheet & Manual Workflow Replacement"
      ],
      icon: "ri-loop-right-line",
      cardHeading: "Hours of Manual Work Reduced to Seconds",
      cardDesc: "By automating routine data entry, approvals, and customer notifications, your team can focus on high-value work while every process runs consistently and leaves a clear audit trail.",
      tags: ["Process Automation", "Paperless Workflows", "API Orchestration", "Automated Alerts"],
      ctaText: "Start Your Digital Transformation"
    },
    {
      id: "ecommerce-solutions",
      number: "10",
      eyebrow: "E-COMMERCE SOLUTIONS • ONLINE STORES & MARKETPLACES",
      title: "E-Commerce Solutions",
      desc: "Launch and scale high-converting online stores and multi-vendor marketplaces tailored to your brand. We build fast, mobile-first e-commerce platforms complete with local and international payment gateways, real-time inventory sync, and automated order fulfillment.",
      checks: [
        "Custom B2C, B2B & Multi-Vendor Storefronts",
        "Local & Global Payment Gateway Integration",
        "Real-Time Inventory, POS & Warehouse Synchronization",
        "Order Management, Shipping & Delivery Tracking",
        "Conversion Rate Optimization, Promotions & Customer Loyalty"
      ],
      icon: "ri-shopping-bag-3-line",
      cardHeading: "Seamless Shopping from Discovery to Delivery",
      cardDesc: "Whether launching a flagship direct-to-consumer store or connecting your retail POS to an online catalog, we engineer storefronts built for speed, security, and repeat purchases.",
      tags: ["Custom Storefronts", "Payment Gateways", "POS & Inventory Sync", "Order Fulfillment"],
      ctaText: "Launch Your Online Store"
    },
    {
      id: "support-maintenance",
      number: "11",
      eyebrow: "SUPPORT & MAINTENANCE • SLAs, SECURITY & UPTIME",
      title: "Support & System Maintenance",
      desc: "Software is a living asset that requires continuous care after launch. Our dedicated support and maintenance retainers keep your mission-critical systems secure, updated, and performing at their peak — backed by proactive monitoring and guaranteed SLA response times.",
      checks: [
        "SLA-Backed Technical Support & Incident Response",
        "Proactive Uptime, Error & Performance Monitoring",
        "Regular Security Patching, Dependency & OS Updates",
        "Database Tuning, Backup Verification & Health Checks",
        "Continuous Feature Enhancements & UX Refinements"
      ],
      icon: "ri-customer-service-2-line",
      cardHeading: "Long-Term Peace of Mind After Go-Live",
      cardDesc: "You never have to worry about outgrowing your software or being left without support. Our engineering team stays on call to keep your systems fast, secure, and evolving with your business.",
      tags: ["SLA Support", "Security Patching", "Performance Tuning", "Continuous Updates"],
      ctaText: "Get a Support Plan"
    }
  ];

  const serviceModal = document.getElementById("serviceDetailModal");
  const serviceModalClose = document.getElementById("serviceModalClose");
  const serviceModalPrev = document.getElementById("serviceModalPrev");
  const serviceModalNext = document.getElementById("serviceModalNext");
  const serviceModalDots = document.getElementById("serviceModalDots");
  const serviceTriggers = document.querySelectorAll("[data-service-modal]");
  let activeServiceIdx = 0;

  function renderServiceModal(index) {
    const len = serviceModalData.length;
    activeServiceIdx = ((index % len) + len) % len;
    const item = serviceModalData[activeServiceIdx];
    if (!item || !serviceModal) return;

    const numEl = document.getElementById("modalServiceNumber");
    const eyeEl = document.getElementById("modalServiceEyebrow");
    const titleEl = document.getElementById("modalServiceTitle");
    const descEl = document.getElementById("modalServiceDesc");
    const checksEl = document.getElementById("modalServiceChecks");
    const iconEl = document.getElementById("modalServiceIcon");
    const cardHeadEl = document.getElementById("modalCardHeading");
    const cardDescEl = document.getElementById("modalCardDesc");
    const cardTagsEl = document.getElementById("modalCardTags");
    const ctaTextEl = document.getElementById("modalCardCtaText");

    if (numEl) numEl.textContent = item.number;
    if (eyeEl) eyeEl.textContent = item.eyebrow;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;
    if (iconEl) iconEl.className = item.icon;
    if (cardHeadEl) cardHeadEl.textContent = item.cardHeading;
    if (cardDescEl) cardDescEl.textContent = item.cardDesc;
    if (ctaTextEl) ctaTextEl.textContent = item.ctaText;

    if (checksEl) {
      checksEl.innerHTML = item.checks
        .map((check, i) => {
          const spanClass = i === item.checks.length - 1 && item.checks.length % 2 === 1 ? "sm:col-span-2" : "";
          return `
            <div class="service-modal-check-card rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 ${spanClass}">
              <div class="w-8 h-8 rounded-full bg-[#231E1A] text-white flex items-center justify-center shrink-0 text-sm">
                <i class="ri-check-line"></i>
              </div>
              <span class="text-xs sm:text-sm font-semibold text-[#231E1A]">${check}</span>
            </div>
          `;
        })
        .join("");
    }

    if (cardTagsEl) {
      cardTagsEl.innerHTML = item.tags
        .map(
          tag =>
            `<span class="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium text-[#EFE4D8]">${tag}</span>`
        )
        .join("");
    }

    if (serviceModalDots) {
      serviceModalDots.innerHTML = serviceModalData
        .map(
          (s, idx) =>
            `<button type="button" data-service-idx="${idx}" aria-label="View ${s.title}" class="h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeServiceIdx ? "w-7 bg-[#231E1A]" : "w-2 bg-[#C8B7A6] hover:bg-[#8A7562]"
            }"></button>`
        )
        .join("");

      serviceModalDots.querySelectorAll("[data-service-idx]").forEach(btn => {
        btn.addEventListener("click", () => {
          renderServiceModal(parseInt(btn.getAttribute("data-service-idx"), 10));
        });
      });
    }
  }

  function openServiceModalById(serviceId) {
    if (!serviceModal) return;
    const idx = serviceModalData.findIndex(s => s.id === serviceId);
    renderServiceModal(idx >= 0 ? idx : 0);
    serviceModal.classList.add("modal-open");
    serviceModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove("modal-open");
    serviceModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (window.location.hash && serviceModalData.some(s => `#${s.id}` === window.location.hash)) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  if (serviceModal && serviceTriggers.length > 0) {
    serviceTriggers.forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-service-modal");
        openServiceModalById(id);
      });
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const id = card.getAttribute("data-service-modal");
          openServiceModalById(id);
        }
      });
    });

    if (serviceModalClose) {
      serviceModalClose.addEventListener("click", closeServiceModal);
    }

    serviceModal.addEventListener("click", e => {
      if (e.target === serviceModal) {
        closeServiceModal();
      }
    });

    if (serviceModalPrev) {
      serviceModalPrev.addEventListener("click", () => {
        renderServiceModal(activeServiceIdx - 1);
      });
    }

    if (serviceModalNext) {
      serviceModalNext.addEventListener("click", () => {
        renderServiceModal(activeServiceIdx + 1);
      });
    }

    document.addEventListener("keydown", e => {
      if (!serviceModal.classList.contains("modal-open")) return;
      if (e.key === "Escape") closeServiceModal();
      if (e.key === "ArrowLeft") renderServiceModal(activeServiceIdx - 1);
      if (e.key === "ArrowRight") renderServiceModal(activeServiceIdx + 1);
    });

    // Auto-open popup if navigated via URL hash (e.g. from Home Page service cards)
    const initialHash = (window.location.hash || "").replace(/^#/, "");
    if (initialHash && serviceModalData.some(s => s.id === initialHash)) {
      const overviewEl = document.getElementById("services-overview");
      if (overviewEl) overviewEl.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => openServiceModalById(initialHash), 250);
    }
  }

  // 7. Floating Right-Corner "Let's Build What's Next" Card & Minimized Icon
  const floatingCtaCard = document.getElementById("floatingCtaCard");
  const floatingCtaCloseBtn = document.getElementById("floatingCtaCloseBtn");
  const floatingCtaLauncher = document.getElementById("floatingCtaLauncher");

  if (floatingCtaCard && floatingCtaCloseBtn && floatingCtaLauncher) {
    floatingCtaCloseBtn.addEventListener("click", () => {
      floatingCtaCard.classList.add("widget-hidden");
      floatingCtaLauncher.classList.remove("widget-hidden");
    });

    floatingCtaLauncher.addEventListener("click", () => {
      floatingCtaLauncher.classList.add("widget-hidden");
      floatingCtaCard.classList.remove("widget-hidden");
    });
  }

  // 8. Oora Labz Instagram Latest Post Card (Live Auto-Sync for Latest Post, Likes & Comments)
  const instaUsername =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_INSTAGRAM_USERNAME) ||
    "oora_labz";
  const customInstaFeedUrl =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_INSTAGRAM_FEED_URL) ||
    "";

  const ooraInstagramConfig = {
    username: instaUsername,
    profileUrl: "https://www.instagram.com/oora_labz?igsh=MTZnYzg1anFjaTh1eA==",
    feedApiUrl: customInstaFeedUrl,
    fallbackLatestPost: {
      permalink: "https://www.instagram.com/p/DdqDpVCj6yq/",
      mediaUrl: "assets/images/home-modern/insta-latest-post.jpg",
      caption:
        "Your business history holds valuable insights if you have the right system to see them. See your past clearly. Build your future confidently. #OoraLabz #BuildThingsForPeople",
      timeLabel: "Latest Instagram Post",
      likes: 5,
      comments: 0
    }
  };

  const instaLatestImage = document.getElementById("instaLatestImage");
  const instaLatestCaption = document.getElementById("instaLatestCaption");
  const instaLatestTime = document.getElementById("instaLatestTime");
  const instaLatestLink = document.getElementById("instaLatestLink");
  const instaCommentLink = document.getElementById("instaCommentLink");
  const instaCommentCount = document.getElementById("instaCommentCount");
  const instaShareLink = document.getElementById("instaShareLink");
  const instaOpenPostLink = document.getElementById("instaOpenPostLink");
  const instaLikeBtn = document.getElementById("instaLikeBtn");
  const instaLikeIcon = document.getElementById("instaLikeIcon");
  const instaLikeCount = document.getElementById("instaLikeCount");

  function formatRelativeDate(dateInput) {
    if (!dateInput) return "Latest Instagram Post";
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return "Latest Instagram Post";
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec >= 0 && diffSec < 3600) {
      return `${Math.max(1, Math.floor(diffSec / 60))}m ago • Instagram`;
    }
    if (diffSec >= 0 && diffSec < 86400) {
      return `${Math.floor(diffSec / 3600)}h ago • Instagram`;
    }
    if (diffSec >= 0 && diffSec < 86400 * 30) {
      return `${Math.floor(diffSec / 86400)}d ago • Instagram`;
    }
    return `${date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    })} • Instagram`;
  }

  function applyLatestInstaPost(post) {
    if (!post) return;
    if (instaLatestImage && post.mediaUrl) {
      instaLatestImage.onerror = () => {
        if (post.directMediaUrl && instaLatestImage.src !== post.directMediaUrl) {
          instaLatestImage.src = post.directMediaUrl;
        } else {
          instaLatestImage.src = ooraInstagramConfig.fallbackLatestPost.mediaUrl;
        }
      };
      instaLatestImage.src = post.mediaUrl;
    }
    if (instaLatestCaption && post.caption) {
      const cleanCaption = post.caption.replace(/\s+/g, " ").trim();
      instaLatestCaption.innerHTML = "";
      const userSpan = document.createElement("span");
      userSpan.className = "font-extrabold text-[#231E1A] mr-1";
      userSpan.textContent = ooraInstagramConfig.username;
      instaLatestCaption.appendChild(userSpan);
      instaLatestCaption.appendChild(document.createTextNode(cleanCaption));
    }
    if (instaLatestTime && post.timeLabel) {
      instaLatestTime.textContent = post.timeLabel;
    }
    if (post.permalink) {
      [instaLatestLink, instaCommentLink, instaShareLink, instaOpenPostLink].forEach(el => {
        if (el) el.href = post.permalink;
      });
    }
    if (instaLikeCount && typeof post.likes === "number") {
      instaLikeCount.textContent = String(post.likes);
    }
    if (instaCommentCount && typeof post.comments === "number") {
      instaCommentCount.textContent = String(post.comments);
    }
  }

  function normalizeInstaPayload(payload) {
    if (!payload || payload.error) return null;

    // Direct normalized response from /api/instagram-latest or assets/php/instagram-latest.php
    if (payload.shortcode && (payload.mediaUrl || payload.directMediaUrl)) {
      return {
        permalink: payload.permalink || `https://www.instagram.com/p/${payload.shortcode}/`,
        mediaUrl: payload.mediaUrl || payload.directMediaUrl,
        directMediaUrl: payload.directMediaUrl || payload.mediaUrl,
        caption: payload.caption || ooraInstagramConfig.fallbackLatestPost.caption,
        timeLabel: formatRelativeDate(payload.timestamp),
        likes: typeof payload.likes === "number" ? payload.likes : ooraInstagramConfig.fallbackLatestPost.likes,
        comments: typeof payload.comments === "number" ? payload.comments : ooraInstagramConfig.fallbackLatestPost.comments
      };
    }

    // Behold.so / Graph API array response
    const posts = Array.isArray(payload) ? payload : payload.posts || payload.data || [];
    const latest = posts[0];
    if (!latest) return null;

    const mediaUrl =
      latest.sizes?.medium?.mediaUrl ||
      (latest.media_type === "VIDEO"
        ? latest.thumbnail_url || latest.mediaUrl || latest.media_url
        : latest.mediaUrl || latest.media_url || latest.thumbnail_url);

    return {
      permalink: latest.permalink || ooraInstagramConfig.profileUrl,
      mediaUrl: mediaUrl || ooraInstagramConfig.fallbackLatestPost.mediaUrl,
      directMediaUrl: mediaUrl || ooraInstagramConfig.fallbackLatestPost.mediaUrl,
      caption: latest.caption || latest.prunedCaption || ooraInstagramConfig.fallbackLatestPost.caption,
      timeLabel: formatRelativeDate(latest.timestamp),
      likes:
        typeof latest.likeCount === "number"
          ? latest.likeCount
          : typeof latest.like_count === "number"
            ? latest.like_count
            : ooraInstagramConfig.fallbackLatestPost.likes,
      comments:
        typeof latest.commentsCount === "number"
          ? latest.commentsCount
          : typeof latest.comments_count === "number"
            ? latest.comments_count
            : ooraInstagramConfig.fallbackLatestPost.comments
    };
  }

  async function syncLatestInstagramPost() {
    if (!instaLatestImage) return;

    const endpoints = [
      ooraInstagramConfig.feedApiUrl,
      `/api/instagram-latest?username=${encodeURIComponent(ooraInstagramConfig.username)}`,
      `assets/php/instagram-latest.php?username=${encodeURIComponent(ooraInstagramConfig.username)}`
    ].filter(Boolean);

    for (const url of endpoints) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) continue;
        const data = await res.json();
        const normalized = normalizeInstaPayload(data);
        if (normalized) {
          applyLatestInstaPost(normalized);
          return;
        }
      } catch (_) {
        // Try next endpoint
      }
    }
  }

  if (instaLatestImage) {
    syncLatestInstagramPost();
  }

  if (instaLikeBtn && instaLikeIcon && instaLikeCount) {
    let liked = true;
    instaLikeBtn.addEventListener("click", () => {
      liked = !liked;
      const current = parseInt(instaLikeCount.textContent || "0", 10);
      if (liked) {
        instaLikeIcon.className = "ri-heart-3-fill text-[#C84B31] text-lg";
        instaLikeCount.textContent = String(current + 1);
      } else {
        instaLikeIcon.className = "ri-heart-3-line text-[#231E1A] text-lg";
        instaLikeCount.textContent = String(Math.max(0, current - 1));
      }
    });
  }
});


