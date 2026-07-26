(function () {
  const config = window.PORTFOLIO_CONFIG || {};

  // Apply config to DOM placeholders
  function applyConfig() {
    document.querySelectorAll("[data-config]").forEach((el) => {
      const key = el.getAttribute("data-config");
      const value = key.split(".").reduce((obj, k) => obj?.[k], config);
      if (value == null) return;

      if (el.tagName === "A" && (key.includes("Url") || key.startsWith("social") || key === "email" || key === "resumeUrl")) {
        if (key === "email") {
          el.href = `mailto:${value}`;
          if (!el.textContent.trim() || el.hasAttribute("data-config-text")) {
            el.textContent = value;
          }
        } else {
          el.href = value;
        }
      } else if (el.hasAttribute("data-config-text") || el.tagName !== "A") {
        el.textContent = value;
      }
    });

    const yearEl = document.getElementById("copyright-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Contact form: Formspree when configured, otherwise mailto
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const statusEl = document.getElementById("form-status");
    const submitBtn = form.querySelector('button[type="submit"]');

    function setStatus(state, message) {
      if (!statusEl) return;
      statusEl.dataset.state = state || "";
      statusEl.textContent = message || "";
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.elements.identifier?.value?.trim() || "";
      const email = form.elements.return_address?.value?.trim() || "";
      const message = form.elements.payload?.value?.trim() || "";

      if (!name || !email || !message) {
        setStatus("error", "ERROR: ALL FIELDS REQUIRED");
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        setStatus("error", "ERROR: INVALID RETURN_ADDRESS");
        return;
      }

      const formspreeId = (config.formspreeId || "").trim();

      if (!formspreeId) {
        // Mailto fallback - works everywhere, no backend
        const subject = encodeURIComponent(`Portfolio contact from ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\n${message}`
        );
        const to = config.email || "hello@example.com";
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        setStatus(
          "success",
          "OPENING MAIL CLIENT… (set formspreeId in js/config.js for in-page send)"
        );
        return;
      }

      setStatus("sending", "TRANSMITTING…");
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: `Portfolio contact from ${name}`,
          }),
        });

        if (res.ok) {
          form.reset();
          setStatus("success", "TRANSMISSION COMPLETE - MESSAGE RECEIVED");
        } else {
          const data = await res.json().catch(() => ({}));
          const err =
            data.errors?.[0]?.message || "TRANSMISSION FAILED - TRY AGAIN";
          setStatus("error", err.toUpperCase());
        }
      } catch {
        setStatus("error", "NETWORK ERROR - USE EMAIL LINK INSTEAD");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Mobile menu
  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("mobile-nav");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active nav highlighting
  function initNavHighlight() {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll("nav a[href^='#']");

    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach((link) => {
            const active = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("text-secondary", active);
            link.classList.toggle("font-bold", active);
            link.classList.toggle("text-on-surface-variant", !active);
            if (active) {
              link.classList.add("relative");
            }
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // WebGL background
  function initShader() {
    const canvas = document.getElementById("shader-bg");
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vsSource = `
      attribute vec4 a_position;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = a_position;
        v_texCoord = a_position.xy * 0.5 + 0.5;
      }
    `;

    const fsSource = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -  i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    float time = u_time * 0.05;
    float n1 = snoise(uv * 3.0 + vec2(time, time * 0.2));
    float n2 = snoise(uv * 6.0 - vec2(time * 0.5, n1));
    vec2 grid = fract(uv * 40.0);
    float gridLine = smoothstep(0.02, 0.0, grid.x) + smoothstep(0.02, 0.0, grid.y);
    float d = distance(uv, mouse);
    float glow = smoothstep(0.25, 0.0, d) * 0.12;
    vec3 color = vec3(0.015, 0.015, 0.02);
    float streams = smoothstep(0.49, 0.5, abs(n2));
    color += vec3(0.1, 0.15, 0.25) * streams * 0.1;
    color += vec3(0.1, 0.12, 0.15) * gridLine * 0.03 * (n1 * 0.5 + 0.5);
    color += vec3(0.2, 0.3, 0.4) * glow;
    float vignette = smoothstep(1.3, 0.3, length(uv - 0.5));
    color *= vignette;
    gl_FragColor = vec4(color, 1.0);
}
    `;

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]),
      gl.STATIC_DRAW
    );

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = window.innerHeight - e.clientY;
    });

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    function render(time) {
      resize();
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  /**
   * Global WebGL + code-layer background:
   * - Stays visually fixed through the hero
   * - After leaving the hero, translates with scroll (parallax depth)
   */
  function initBackgroundScroll() {
    const shader = document.getElementById("shader-bg");
    const codeLayer = document.getElementById("code-layer");
    const hero = document.getElementById("hero");
    if (!shader && !codeLayer) return;

    let current = 0;
    let target = 0;
    const ease = 0.08;
    /** How much the bg moves vs scroll once past the hero */
    const parallaxFactor = 0.38;

    function measure() {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      let heroEnd = window.innerHeight * 0.85;
      if (hero) {
        heroEnd = hero.offsetTop + hero.offsetHeight * 0.72;
      }
      // Hold fixed while in hero; then track scroll (negative = moves up with page)
      if (scrollY <= heroEnd) {
        target = 0;
      } else {
        target = (scrollY - heroEnd) * parallaxFactor;
      }
    }

    function tick() {
      measure();
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.05) current = target;
      const y = -current;
      if (shader) {
        shader.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      }
      // Code layer drifts a bit less for depth
      if (codeLayer) {
        codeLayer.style.transform = `translate3d(0, ${(y * 0.65).toFixed(2)}px, 0)`;
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener(
      "scroll",
      () => {
        measure();
      },
      { passive: true }
    );
    window.addEventListener("resize", measure, { passive: true });
    measure();
    requestAnimationFrame(tick);
  }

  /**
   * Smooth parallax with lerp.
   * Section shells stay in document flow (no overlap / scroll fight).
   * Hero shell is excluded so only post-hero content + media drift.
   * Hero atmosphere image still gets subtle media parallax.
   */
  function initSmoothParallax() {
    document.querySelectorAll("section[data-parallax]").forEach((section) => {
      if (section.querySelector(":scope > .parallax-inner")) return;

      const isHero =
        section.id === "hero" || section.classList.contains("hero-section");

      // Hero: don't wrap whole section (keeps layout stable); media still parallaxes
      if (isHero) {
        section.classList.add("parallax-section");
        section.removeAttribute("data-parallax");
        return;
      }

      const speed = section.getAttribute("data-parallax");
      const cs = window.getComputedStyle(section);
      const layer = document.createElement("div");
      layer.className = "parallax-inner";
      layer.setAttribute("data-parallax", speed);
      layer.style.width = "100%";
      layer.style.maxWidth = "100%";
      layer.style.display = cs.display;

      if (cs.display === "grid") {
        layer.style.gridTemplateColumns = cs.gridTemplateColumns;
        layer.style.columnGap = cs.columnGap;
        layer.style.rowGap = cs.rowGap;
        layer.style.alignItems = cs.alignItems;
        section.style.display = "block";
      } else if (cs.display === "flex") {
        layer.style.flexDirection = cs.flexDirection;
        layer.style.alignItems = cs.alignItems;
        layer.style.justifyContent = cs.justifyContent;
        layer.style.gap = cs.gap;
        section.style.display = "block";
      }

      while (section.firstChild) {
        layer.appendChild(section.firstChild);
      }
      section.appendChild(layer);
      section.classList.add("parallax-section");
      section.removeAttribute("data-parallax");
    });

    const layers = [
      ...document.querySelectorAll(".parallax-inner[data-parallax]"),
      ...document.querySelectorAll(".parallax-media[data-parallax]"),
    ].map((el) => ({
      el,
      speed: parseFloat(el.getAttribute("data-parallax")) || 0,
      current: 0,
      target: 0,
      isMedia: el.classList.contains("parallax-media"),
    }));

    if (!layers.length) return;

    const ease = 0.075;

    function measureTargets() {
      const viewH = window.innerHeight || 1;
      layers.forEach((item) => {
        // Always measure the section shell (untransformed) to avoid feedback loops
        const host = item.el.closest("section") || item.el.parentElement || item.el;
        const rect = host.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = (center - viewH / 2) / viewH;
        const range = item.isMedia ? 90 : 64;
        item.target = Math.max(
          -range,
          Math.min(range, -dist * item.speed * range * 2.1)
        );
      });
    }

    function tick() {
      measureTargets();
      layers.forEach((item) => {
        item.current += (item.target - item.current) * ease;
        if (Math.abs(item.target - item.current) < 0.04) {
          item.current = item.target;
        }
        item.el.style.transform = `translate3d(0, ${item.current.toFixed(2)}px, 0)`;
      });
      requestAnimationFrame(tick);
    }

    measureTargets();
    requestAnimationFrame(tick);
  }
  // Scroll reveals, magnetic nav, floating code
  function initMotion() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      document.querySelectorAll(".reveal, .scroll-reveal").forEach((el) => {
        el.classList.add("active");
      });
      return;
    }

    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      el.classList.remove("active");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".scroll-reveal, .reveal").forEach((el) => {
      observer.observe(el);
    });

    // Global bg moves with scroll after hero; section inners parallax (hero shell fixed)
    initBackgroundScroll();
    initSmoothParallax();

    document.querySelectorAll(".magnetic-wrap").forEach((wrap) => {
      const link = wrap.querySelector(".magnetic-link");
      if (!link) return;
      wrap.addEventListener("mousemove", (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        link.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      wrap.addEventListener("mouseleave", () => {
        link.style.transform = "translate(0px, 0px)";
      });
    });

    const codeLayer = document.getElementById("code-layer");
    if (!codeLayer) return;

    const snippets = [
      "fn compile_to_wasm()",
      "impl Architectural for Logic",
      "const State = useRef()",
      "0x7F2A9B",
      "struct Nexus { pub id: String }",
      "use std::sync::Arc",
      "useEffect(() => { observe() })",
      "match event {",
      "trait Computable",
      "unsafe { optimize() }",
    ];

    // Clear any SSR placeholders, regenerate lightly
    codeLayer.innerHTML = "";
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("div");
      el.className = "floating-code";
      el.textContent = snippets[Math.floor(Math.random() * snippets.length)];
      el.style.top = `${Math.random() * 100}%`;
      el.style.left = `${Math.random() * 100}%`;
      el.setAttribute("data-speed-y", (Math.random() * 0.2 - 0.1).toFixed(3));
      el.setAttribute("data-speed-x", (Math.random() * 0.1 - 0.05).toFixed(3));
      codeLayer.appendChild(el);
    }

    const codeElements = document.querySelectorAll(".floating-code");
    let t = 0;
    function animateCode() {
      t += 0.01;
      const scrollOffset = window.scrollY * 0.05;
      codeElements.forEach((el, index) => {
        const speedY = parseFloat(el.getAttribute("data-speed-y"));
        const y = Math.sin(t + index) * 20 + scrollOffset * speedY * 10;
        const x = Math.cos(t * 0.8 + index) * 20;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      requestAnimationFrame(animateCode);
    }
    animateCode();
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initContactForm();
    initMobileNav();
    initNavHighlight();
    initShader();
    initMotion();
  });
})();
