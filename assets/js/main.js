(function particlesBackground() {
      const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

      const ctx = canvas.getContext("2d");
  if (!ctx) return;

      let width = 0;
      let height = 0;
      let particles = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }

      function createParticle() {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.36,
          vy: (Math.random() - 0.5) * 0.36,
          r: Math.random() * 1.6 + 0.5,
          alpha: Math.random() * 0.35 + 0.08
        };
      }

      function init() {
        resize();
        const isMobile = width <= 768;
        const total = reduceMotion ? 0 : (isMobile ? 32 : 90);
        particles = Array.from({ length: total }, createParticle);
      }

      function draw() {
        if (reduceMotion) {
          ctx.clearRect(0, 0, width, height);
          return;
        }

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(56, 189, 248, " + p.alpha + ")";
          ctx.fill();

          for (let j = i + 1; j < particles.length; j += 1) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = "rgba(45, 212, 191, " + (0.11 * (1 - dist / 110)) + ")";
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }

        requestAnimationFrame(draw);
      }

      window.addEventListener("resize", resize);
      init();
      draw();
    })();

    (function dynamicTyping() {
      const roles = [
        "Analista de Infraestrutura Cloud",
        "Especialista em FLUIG e TCLOUD",
        "Foco em automação e sustentação",
        "Integração de sistemas corporativos"
      ];

      const typed = document.getElementById("typed-role");
      if (!typed) return;

      let roleIndex = 0;
      let letterIndex = 0;
      let deleting = false;

      function tick() {
        const current = roles[roleIndex];

        if (!deleting) {
          letterIndex += 1;
          typed.textContent = current.slice(0, letterIndex);

          if (letterIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1400);
            return;
          }

          setTimeout(tick, 70);
          return;
        }

        letterIndex -= 1;
        typed.textContent = current.slice(0, letterIndex);

        if (letterIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }

        setTimeout(tick, 40);
      }

      tick();
    })();

    (function countersAndReveal() {
      const revealItems = document.querySelectorAll(".reveal, .timeline-item");
      const counters = document.querySelectorAll("[data-target]");
      let counterDone = false;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
        });
      }, { threshold: 0.14 });

      revealItems.forEach((item) => observer.observe(item));

      function animateCounter(el, target) {
        const duration = 1100;
        const start = performance.now();

        function frame(now) {
          const progress = Math.min((now - start) / duration, 1);
          const value = Math.floor(progress * target);
          el.textContent = value + "+";
          if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
      }

      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || counterDone) return;
          counterDone = true;
          counters.forEach((counter) => animateCounter(counter, Number(counter.dataset.target)));
        });
      }, { threshold: 0.4 });

      const heroStats = document.querySelector(".hero-stats");
      if (heroStats) counterObserver.observe(heroStats);
    })();

    (function navigationUX() {
      const nav = document.getElementById("top-nav");
      const navLinks = document.querySelectorAll(".nav-links a");
      const sections = document.querySelectorAll("main section[id]");
      const progress = document.getElementById("scroll-progress");
      const toTop = document.getElementById("to-top");
      const menuToggle = document.getElementById("menu-toggle");
      const menu = document.getElementById("nav-links");

      function updateScrollUI() {
        const y = window.scrollY;
        nav.classList.toggle("scrolled", y > 14);

        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (y / total) * 100 : 0;
        progress.style.width = pct + "%";

        toTop.classList.toggle("visible", y > 540);
      }

      window.addEventListener("scroll", updateScrollUI, { passive: true });
      updateScrollUI();

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;

          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        });
      }, { threshold: 0.45 });

      sections.forEach((section) => sectionObserver.observe(section));

      toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      menuToggle.addEventListener("click", () => {
        menu.classList.toggle("open");
        document.body.classList.toggle("menu-open", menu.classList.contains("open"));
      });

      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          menu.classList.remove("open");
          document.body.classList.remove("menu-open");
        });
      });

      document.addEventListener("click", (event) => {
        const clickInside = event.target.closest("#menu-toggle") || event.target.closest("#nav-links");
        if (!clickInside) {
          menu.classList.remove("open");
          document.body.classList.remove("menu-open");
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
          menu.classList.remove("open");
          document.body.classList.remove("menu-open");
        }
      });
    })();

    (function themeToggle() {
      const btn = document.getElementById("theme-toggle");
      const icon = btn.querySelector("i");
      const storageKey = "ph-theme";

      function applyTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        icon.className = theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
      }

      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") {
        applyTheme(saved);
      }

      btn.addEventListener("click", () => {
        const current = document.body.getAttribute("data-theme") === "light" ? "light" : "dark";
        const next = current === "light" ? "dark" : "light";
        applyTheme(next);
        localStorage.setItem(storageKey, next);
      });
    })();

    (function buttonRipple() {
      const targets = document.querySelectorAll(".js-ripple");
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

      if (coarsePointer) return;

      targets.forEach((button) => {
        button.addEventListener("click", (event) => {
          const rect = button.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const ripple = document.createElement("span");
          ripple.className = "ripple";
          ripple.style.width = size + "px";
          ripple.style.height = size + "px";
          ripple.style.left = event.clientX - rect.left - size / 2 + "px";
          ripple.style.top = event.clientY - rect.top - size / 2 + "px";

          button.appendChild(ripple);
          setTimeout(() => ripple.remove(), 650);
        });
      });
    })();

    (function cardTilt() {
      const cards = document.querySelectorAll(".tilt-card");
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

      if (coarsePointer) return;

      cards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const rx = ((y / rect.height) - 0.5) * -6;
          const ry = ((x / rect.width) - 0.5) * 6;
          card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
        });
      });
    })();

    const footerYear = document.getElementById("footer-year");
    if (footerYear) {
      footerYear.textContent = "© " + new Date().getFullYear();
    }
