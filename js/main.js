/* ============================================================
   CONALBOS Bogotá · main.js
   ============================================================ */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* -------------------- Año dinámico en footer -------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------- Header con scroll -------------------- */
  const header = $("#header");
  const toTop  = $("#toTop");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 30);
    toTop.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -------------------- Menú móvil -------------------- */
  const navToggle = $("#navToggle");
  const nav = $("#nav");

  const closeNav = () => {
    nav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  // Cerrar al hacer clic en un enlace del menú
  $$(".nav__link, .nav__cta", nav).forEach((link) =>
    link.addEventListener("click", closeNav)
  );

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* -------------------- Enlace activo según sección -------------------- */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav__link");

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((l) =>
            l.classList.toggle("is-active", l.getAttribute("href") === "#" + id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* -------------------- Animación reveal -------------------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => ro.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* -------------------- Contador de cifras -------------------- */
  const counters = $$(".stat-card__num");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => countObs.observe(c));
  }

  /* -------------------- Carrusel del hero -------------------- */
  const carousel = $("#heroCarousel");
  if (carousel) {
    const slides = $$(".slide", carousel);
    const dotsWrap = $("#carDots");
    const prevBtn = $("#carPrev");
    const nextBtn = $("#carNext");
    const INTERVAL = 5500;
    let index = slides.findIndex((s) => s.classList.contains("is-active"));
    if (index < 0) index = 0;
    let timer = null;

    // Crear puntos
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "carousel__dot" + (i === index ? " is-active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Ir a la imagen ${i + 1}`);
      dot.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });
    const dots = $$(".carousel__dot", dotsWrap);

    const render = () => {
      slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
      dots.forEach((d, i) => {
        const on = i === index;
        d.classList.toggle("is-active", on);
        d.setAttribute("aria-selected", String(on));
      });
    };

    const goTo = (i, fromUser) => {
      index = (i + slides.length) % slides.length;
      render();
      if (fromUser) restart();
    };
    const next = (fromUser) => goTo(index + 1, fromUser);
    const prev = (fromUser) => goTo(index - 1, fromUser);

    const start = () => { timer = setInterval(() => next(false), INTERVAL); };
    const stop = () => { clearInterval(timer); timer = null; };
    const restart = () => { stop(); start(); };

    nextBtn.addEventListener("click", () => next(true));
    prevBtn.addEventListener("click", () => prev(true));

    // Pausa al pasar el cursor / foco
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    // Navegación con teclado cuando el carrusel tiene foco
    carousel.setAttribute("tabindex", "0");
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(true); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); prev(true); }
    });

    // Soporte táctil (swipe)
    let startX = 0;
    carousel.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; stop(); }, { passive: true });
    carousel.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) (dx < 0 ? next(true) : prev(true));
      start();
    }, { passive: true });

    // Respeta reducción de movimiento: no autoplay
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) start();
  }

  /* -------------------- Propósito · componente circular 3D -------------------- */
  const circ = $("#purposeCirc");
  if (circ) {
    const stage = $("#circStage");
    const imgs = $$(".circ__img", stage);
    const elName = $("#circName");
    const elTag = $("#circTag");
    const elQuote = $("#circQuote");
    const prevBtn = $("#circPrev");
    const nextBtn = $("#circNext");
    const n = imgs.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let active = 0;
    let stageW = 1100;
    let timer = null;

    const calcGap = (w) => {
      const minW = 1024, maxW = 1456, minG = 50, maxG = 80;
      if (w <= minW) return minG;
      if (w >= maxW) return maxG;
      return minG + (maxG - minG) * ((w - minW) / (maxW - minW));
    };

    const applyTransforms = () => {
      const gap = calcGap(stageW);
      const up = gap * 0.7;
      imgs.forEach((img, i) => {
        const isActive = i === active;
        const isLeft = (active - 1 + n) % n === i;
        const isRight = (active + 1) % n === i;
        if (isActive) {
          img.style.zIndex = 3; img.style.opacity = 1;
          img.style.transform = "translateX(0) translateY(0) scale(1) rotateY(0deg)";
        } else if (isLeft) {
          img.style.zIndex = 2; img.style.opacity = 1;
          img.style.transform = `translateX(-${gap}px) translateY(-${up}px) scale(0.85) rotateY(15deg)`;
        } else if (isRight) {
          img.style.zIndex = 2; img.style.opacity = 1;
          img.style.transform = `translateX(${gap}px) translateY(-${up}px) scale(0.85) rotateY(-15deg)`;
        } else {
          img.style.zIndex = 1; img.style.opacity = 0;
        }
      });
    };

    const renderText = () => {
      const data = imgs[active].dataset;
      elTag.textContent = data.tag || "";
      elName.textContent = data.name || "";
      // Cita palabra por palabra con desenfoque
      elQuote.textContent = "";
      const words = (data.quote || "").split(" ");
      words.forEach((w, i) => {
        const span = document.createElement("span");
        span.textContent = w + " ";
        if (!reduce) {
          span.style.filter = "blur(10px)";
          span.style.opacity = "0";
          span.style.transform = "translateY(5px)";
          span.style.transition = "filter 0.22s ease, opacity 0.22s ease, transform 0.22s ease";
          span.style.transitionDelay = (0.025 * i) + "s";
        }
        elQuote.appendChild(span);
      });
      if (!reduce) {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          $$("span", elQuote).forEach((s) => {
            s.style.filter = "blur(0px)";
            s.style.opacity = "1";
            s.style.transform = "translateY(0)";
          });
        }));
      }
    };

    const render = () => { applyTransforms(); renderText(); };

    const goTo = (i, fromUser) => { active = (i + n) % n; render(); if (fromUser) restart(); };
    const next = (u) => goTo(active + 1, u);
    const prev = (u) => goTo(active - 1, u);

    const start = () => { if (!reduce) timer = setInterval(() => next(false), 5000); };
    const stop = () => { clearInterval(timer); timer = null; };
    const restart = () => { stop(); start(); };

    nextBtn.addEventListener("click", () => next(true));
    prevBtn.addEventListener("click", () => prev(true));

    // Medir ancho del escenario (afecta la separación 3D)
    const measure = () => { stageW = stage.offsetWidth || stageW; applyTransforms(); };
    window.addEventListener("resize", measure, { passive: true });

    // Pausa al pasar el cursor
    circ.addEventListener("mouseenter", stop);
    circ.addEventListener("mouseleave", start);

    // Teclado cuando el componente tiene foco
    circ.setAttribute("tabindex", "0");
    circ.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(true); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); prev(true); }
    });

    measure();
    render();
    start();
  }

  /* -------------------- Validación del formulario -------------------- */
  const form = $("#contactForm");
  const status = $("#formStatus");

  const setError = (field, msg) => {
    const wrap = field.closest(".field");
    wrap.classList.add("has-error");
    const small = $(`.error[data-for="${field.id}"]`);
    if (small) small.textContent = msg;
  };
  const clearError = (field) => {
    const wrap = field.closest(".field");
    wrap.classList.remove("has-error");
    const small = $(`.error[data-for="${field.id}"]`);
    if (small) small.textContent = "";
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = "";
      status.className = "form-status";

      const nombre  = $("#nombre");
      const email   = $("#email");
      const mensaje = $("#mensaje");
      let ok = true;

      [nombre, email, mensaje].forEach(clearError);

      if (!nombre.value.trim()) { setError(nombre, "Ingrese su nombre."); ok = false; }
      if (!email.value.trim()) {
        setError(email, "Ingrese su correo.");
        ok = false;
      } else if (!isEmail(email.value.trim())) {
        setError(email, "Correo no válido.");
        ok = false;
      }
      if (!mensaje.value.trim()) { setError(mensaje, "Cuéntenos su caso."); ok = false; }

      if (!ok) {
        status.textContent = "Por favor revise los campos marcados.";
        status.classList.add("is-err");
        return;
      }

      /* ----------------------------------------------------------
         Sin backend: abrimos el cliente de correo con los datos.
         Para envío real, conecta este formulario a un servicio
         como Formspree, Web3Forms o un endpoint propio.
         ---------------------------------------------------------- */
      const data = new FormData(form);
      const cuerpo = encodeURIComponent(
        `Nombre: ${data.get("nombre")}\n` +
        `Correo: ${data.get("email")}\n` +
        `Teléfono: ${data.get("telefono") || "—"}\n` +
        `Área de interés: ${data.get("asunto") || "—"}\n\n` +
        `${data.get("mensaje")}`
      );
      const asunto = encodeURIComponent("Solicitud de consulta · Sitio web");
      window.location.href = `mailto:info@conalbosbogota.com?subject=${asunto}&body=${cuerpo}`;

      status.textContent = "Gracias. Abriremos su correo para finalizar el envío.";
      status.classList.add("is-ok");
      form.reset();
    });

    // Limpiar error al escribir
    $$("input, textarea", form).forEach((f) =>
      f.addEventListener("input", () => clearError(f))
    );
  }
})();
