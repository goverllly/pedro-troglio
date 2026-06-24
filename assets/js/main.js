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

    (function matrixCardRain() {
      const cards = document.querySelectorAll(".matrix-highlight");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || !cards.length) return;

      const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%!?";

      cards.forEach((card) => {
        const canvas = card.querySelector(".matrix-highlight-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let columns = 0;
        let drops = [];
        let running = false;
        let rafId = 0;
        let lastStepTime = 0;
        const stepInterval = 50;

        function fontSize() {
          const width = card.clientWidth;
          if (width < 340) return 10;
          if (width < 430) return 11;
          return 12;
        }

        function resizeCanvas() {
          const dpr = Math.max(window.devicePixelRatio || 1, 1);
          const width = Math.max(1, Math.floor(card.clientWidth));
          const height = Math.max(1, Math.floor(card.clientHeight));

          canvas.width = Math.floor(width * dpr);
          canvas.height = Math.floor(height * dpr);
          canvas.style.width = width + "px";
          canvas.style.height = height + "px";

          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale(dpr, dpr);

          const size = fontSize();
          columns = Math.floor(width / size) + 1;
          drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -height / size));
        }

        function isLightTheme() {
          return document.body.getAttribute("data-theme") === "light";
        }

        function drawFrame() {
          const width = card.clientWidth;
          const height = card.clientHeight;
          const size = fontSize();

          const bg = isLightTheme() ? "rgba(248, 250, 252, 0.14)" : "rgba(7, 13, 26, 0.16)";
          const tail = isLightTheme() ? "rgba(0, 140, 40, 0.42)" : "rgba(0, 220, 65, 0.34)";
          const head = isLightTheme() ? "rgba(0, 90, 26, 0.88)" : "rgba(130, 255, 170, 0.95)";

          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, width, height);
          ctx.font = size + "px 'Courier New', monospace";

          for (let i = 0; i < columns; i += 1) {
            const x = i * size;
            const y = drops[i] * size;
            const ch = CHARS[Math.floor(Math.random() * CHARS.length)];

            ctx.fillStyle = Math.random() > 0.86 ? head : tail;
            ctx.fillText(ch, x, y);

            if (y > height && Math.random() > 0.975) {
              drops[i] = Math.floor(Math.random() * -30);
            } else {
              drops[i] += 1;
            }
          }
        }

        function loop(now) {
          if (!running) return;
          if (!lastStepTime || now - lastStepTime >= stepInterval) {
            lastStepTime = now;
            drawFrame();
          }
          rafId = requestAnimationFrame(loop);
        }

        function start() {
          if (running) return;
          running = true;
          lastStepTime = 0;
          resizeCanvas();
          loop();
        }

        function stop() {
          running = false;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = 0;
          ctx.clearRect(0, 0, card.clientWidth, card.clientHeight);
        }

        card.addEventListener("mouseenter", start);
        card.addEventListener("mouseleave", stop);
        card.addEventListener("focusin", start);
        card.addEventListener("focusout", stop);
        window.addEventListener("resize", resizeCanvas);
      });
    })();

    (function spiderCardWeb() {
      const cards = document.querySelectorAll(".spider-highlight");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || !cards.length) return;

      cards.forEach((card) => {
        const canvas = card.querySelector(".spider-highlight-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let running = false;
        let rafId = 0;
        let angleOffsets = [];

        function resizeCanvas() {
          const dpr = Math.max(window.devicePixelRatio || 1, 1);
          const width = Math.max(1, Math.floor(card.clientWidth));
          const height = Math.max(1, Math.floor(card.clientHeight));

          canvas.width = Math.floor(width * dpr);
          canvas.height = Math.floor(height * dpr);
          canvas.style.width = width + "px";
          canvas.style.height = height + "px";

          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale(dpr, dpr);

          const rays = Math.max(12, Math.min(26, Math.floor(width / 30)));
          angleOffsets = Array.from({ length: rays }, () => (Math.random() - 0.5) * 0.12);
        }

        function isLightTheme() {
          return document.body.getAttribute("data-theme") === "light";
        }

        function drawWeb(time) {
          const width = card.clientWidth;
          const height = card.clientHeight;
          const t = time * 0.001;
          const light = isLightTheme();

          const fadeColor = light ? "rgba(248, 250, 252, 0.16)" : "rgba(7, 13, 26, 0.18)";
          const lineColor = light ? "rgba(10, 120, 165, 0.38)" : "rgba(56, 189, 248, 0.33)";
          const ringColor = light ? "rgba(0, 120, 160, 0.3)" : "rgba(45, 212, 191, 0.28)";
          const pulseColor = light ? "rgba(6, 104, 160, 0.82)" : "rgba(145, 248, 255, 0.96)";
          const pulseGlow = light ? "rgba(6, 104, 160, 0.32)" : "rgba(56, 189, 248, 0.42)";

          ctx.fillStyle = fadeColor;
          ctx.fillRect(0, 0, width, height);

          const ox = width * 0.86;
          const oy = height * 0.14;
          const maxR = Math.hypot(width, height) * 0.68;
          const rays = angleOffsets.length;
          const baseStart = Math.PI * 0.65;
          const baseEnd = Math.PI * 1.86;
          const step = (baseEnd - baseStart) / (rays - 1 || 1);

          ctx.lineCap = "round";

          for (let i = 0; i < rays; i += 1) {
            const a = baseStart + step * i + angleOffsets[i] + Math.sin(t * 0.9 + i) * 0.01;
            const x = ox + Math.cos(a) * maxR;
            const y = oy + Math.sin(a) * maxR;
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = i % 3 === 0 ? 1.05 : 0.8;
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(x, y);
            ctx.stroke();
          }

          const rings = Math.max(10, Math.min(14, Math.floor(Math.min(width, height) / 18)));
          for (let r = 1; r <= rings; r += 1) {
            const ringRadius = (maxR / rings) * r;
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = r % 3 === 0 ? 0.95 : 0.75;
            ctx.beginPath();

            for (let i = 0; i < rays; i += 1) {
              const a = baseStart + step * i + angleOffsets[i] + Math.sin(t * 0.9 + i) * 0.01;
              const wobble = 1 + Math.sin(t * 1.8 + i + r) * 0.02;
              const x = ox + Math.cos(a) * ringRadius * wobble;
              const y = oy + Math.sin(a) * ringRadius * wobble;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }

            ctx.stroke();
          }

          // Faint node points at selected intersections for a denser technical feel.
          for (let r = 2; r <= rings; r += 2) {
            const ringRadius = (maxR / rings) * r;
            for (let i = 0; i < rays; i += 3) {
              const a = baseStart + step * i + angleOffsets[i] + Math.sin(t * 0.9 + i) * 0.01;
              const wobble = 1 + Math.sin(t * 1.8 + i + r) * 0.02;
              const x = ox + Math.cos(a) * ringRadius * wobble;
              const y = oy + Math.sin(a) * ringRadius * wobble;
              const alpha = 0.16 + (Math.sin(t * 2.4 + i + r) * 0.5 + 0.5) * 0.2;
              ctx.fillStyle = light
                ? "rgba(6, 104, 160, " + alpha + ")"
                : "rgba(90, 230, 255, " + alpha + ")";
              ctx.beginPath();
              ctx.arc(x, y, 0.85, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          const pulseRay = Math.floor((Math.sin(t * 1.6) * 0.5 + 0.5) * (rays - 1));
          const pulseDist = (Math.sin(t * 2.2) * 0.5 + 0.5) * maxR;
          const pa = baseStart + step * pulseRay + angleOffsets[pulseRay];
          const px = ox + Math.cos(pa) * pulseDist;
          const py = oy + Math.sin(pa) * pulseDist;

          const pulseRay2 = Math.floor((Math.sin(t * 1.25 + 1.4) * 0.5 + 0.5) * (rays - 1));
          const pulseDist2 = (Math.sin(t * 1.9 + 0.8) * 0.5 + 0.5) * maxR;
          const pa2 = baseStart + step * pulseRay2 + angleOffsets[pulseRay2];
          const px2 = ox + Math.cos(pa2) * pulseDist2;
          const py2 = oy + Math.sin(pa2) * pulseDist2;

          ctx.fillStyle = pulseColor;
          ctx.beginPath();
          ctx.arc(px, py, 2.1, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = pulseGlow;
          ctx.beginPath();
          ctx.arc(px, py, 4.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = pulseColor;
          ctx.beginPath();
          ctx.arc(px2, py2, 1.45, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = pulseColor;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(px, py);
          ctx.stroke();

          ctx.strokeStyle = light ? "rgba(6, 104, 160, 0.6)" : "rgba(90, 230, 255, 0.72)";
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(px2, py2);
          ctx.stroke();
        }

        function loop(time) {
          if (!running) return;
          drawWeb(time);
          rafId = requestAnimationFrame(loop);
        }

        function start() {
          if (running) return;
          running = true;
          resizeCanvas();
          rafId = requestAnimationFrame(loop);
        }

        function stop() {
          running = false;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = 0;
          ctx.clearRect(0, 0, card.clientWidth, card.clientHeight);
        }

        card.addEventListener("mouseenter", start);
        card.addEventListener("mouseleave", stop);
        card.addEventListener("focusin", start);
        card.addEventListener("focusout", stop);
        window.addEventListener("resize", resizeCanvas);
      });
    })();

    const footerYear = document.getElementById("footer-year");
    if (footerYear) {
      footerYear.textContent = "© " + new Date().getFullYear();
    }
