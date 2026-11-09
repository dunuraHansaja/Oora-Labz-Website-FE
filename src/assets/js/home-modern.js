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

  // Auto-rotate every 4 seconds (4000ms) and reset timer on manual interaction
  let autoRotateTimer = null;

  function startAutoRotate() {
    stopAutoRotate();
    autoRotateTimer = setInterval(() => {
      stepCarousel(1);
    }, 4000);
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

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

  if (deckStage) {
    deckStage.addEventListener("click", () => {
      startAutoRotate();
    });
  }

  if (dotsContainer) {
    dotsContainer.addEventListener("click", () => {
      startAutoRotate();
    });
  }

  startAutoRotate();

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

  // 6. Services Page Frosted Glass Pop-up Modal
  const serviceModalData = [
    {
      id: "custom-software",
      number: "01",
      eyebrow: "CUSTOM SOFTWARE • WEB & SCALABLE SYSTEMS",
      title: "Custom Software Development",
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
      title: "Business Applications & Automation",
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
      id: "cloud-it",
      number: "06",
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

  // 8. Oora Labz Instagram Latest Post Card (Single Latest Post Sync & Like Toggle)
  const ooraInstagramConfig = {
    profileUrl: "https://www.instagram.com/oora_labz?igsh=MTZnYzg1anFjaTh1eA==",
    // Optional: Add a Behold.so JSON feed URL or Instagram Graph API endpoint to auto-fetch the latest post
    // e.g. "https://feeds.behold.so/YOUR_FEED_ID" or Graph API media endpoint (limit=1)
    feedApiUrl: "",
    fallbackLatestPost: {
      permalink: "https://www.instagram.com/oora_labz?igsh=MTZnYzg1anFjaTh1eA==",
      mediaUrl: "assets/images/home-modern/hero-statue.png",
      caption: "Building modern, reliable, and scalable software solutions crafted for real people. #OoraLabz #BuildingThingsForPeople",
      timeLabel: "Latest Instagram Post",
      likes: 128
    }
  };

  const instaLatestImage = document.getElementById("instaLatestImage");
  const instaLatestCaption = document.getElementById("instaLatestCaption");
  const instaLatestTime = document.getElementById("instaLatestTime");
  const instaLatestLink = document.getElementById("instaLatestLink");
  const instaCommentLink = document.getElementById("instaCommentLink");
  const instaShareLink = document.getElementById("instaShareLink");
  const instaOpenPostLink = document.getElementById("instaOpenPostLink");
  const instaLikeBtn = document.getElementById("instaLikeBtn");
  const instaLikeIcon = document.getElementById("instaLikeIcon");
  const instaLikeCount = document.getElementById("instaLikeCount");

  function formatRelativeDate(isoDate) {
    if (!isoDate) return "Latest Instagram Post";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "Latest Instagram Post";
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 3600) return `${Math.max(1, Math.floor(diffSec / 60))}m ago • Instagram`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago • Instagram`;
    if (diffSec < 86400 * 30) return `${Math.floor(diffSec / 86400)}d ago • Instagram`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function applyLatestInstaPost(post) {
    if (!post) return;
    if (instaLatestImage && post.mediaUrl) {
      instaLatestImage.src = post.mediaUrl;
    }
    if (instaLatestCaption && post.caption) {
      instaLatestCaption.innerHTML = "";
      const userSpan = document.createElement("span");
      userSpan.className = "font-extrabold text-[#231E1A] mr-1";
      userSpan.textContent = "oora_labz";
      instaLatestCaption.appendChild(userSpan);
      instaLatestCaption.appendChild(document.createTextNode(post.caption));
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
  }

  if (instaLatestImage && ooraInstagramConfig.feedApiUrl) {
    fetch(ooraInstagramConfig.feedApiUrl)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error("Feed fetch failed"))))
      .then(payload => {
        const posts = Array.isArray(payload) ? payload : payload.posts || payload.data || [];
        const latest = posts[0]; // Only show the very last Instagram post
        if (!latest) return;
        const mediaUrl =
          latest.sizes?.medium?.mediaUrl ||
          latest.media_type === "VIDEO"
            ? latest.thumbnail_url || latest.mediaUrl || latest.media_url
            : latest.mediaUrl || latest.media_url || latest.thumbnail_url;
        applyLatestInstaPost({
          permalink: latest.permalink || ooraInstagramConfig.profileUrl,
          mediaUrl: mediaUrl || ooraInstagramConfig.fallbackLatestPost.mediaUrl,
          caption: latest.caption || latest.prunedCaption || ooraInstagramConfig.fallbackLatestPost.caption,
          timeLabel: formatRelativeDate(latest.timestamp),
          likes: typeof latest.likeCount === "number" ? latest.likeCount : ooraInstagramConfig.fallbackLatestPost.likes
        });
      })
      .catch(() => {
        applyLatestInstaPost(ooraInstagramConfig.fallbackLatestPost);
      });
  }

  if (instaLikeBtn && instaLikeIcon && instaLikeCount) {
    let liked = true;
    instaLikeBtn.addEventListener("click", () => {
      liked = !liked;
      const current = parseInt(instaLikeCount.textContent || "128", 10);
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


