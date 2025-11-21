import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.180.0/three.module.min.js";

let recipeDatas = {
  frontend: {
    title: "Frontend Development",
    body: "Polishing the pixels into a perfect, high-value user experience.",
    Long_Desc: "This recipe combines structural integrity, clean aesthetics, and performance optimization to craft a visually flawless and high-performing user interface.",
    itemSrc: "https://minecraft.wiki/images/Diamond_JE3_BE3.png?99d00",
  },
  backend: {
    title: "Backend Development",
    body: "The hidden logic that runs the world and executes complex server commands.",
    Long_Desc: "This complex recipe leverages structure, logic, knowledge, and connectivity to build a robust, secure, and standards-compliant server framework.",
    itemSrc: "https://minecraft.wiki/images/Impulse_Command_Block.gif?fb024",
  },
  database: {
    title: "Database Management",
    body: "Expertise in structuring, securing, and efficiently querying vast repositories of information.",
    Long_Desc: "Combining integrity, query logic, storage, clean schemas, and replication establishes secure and high-performance management over vast data repositories.",
    itemSrc: "https://minecraft.wiki/images/Invicon_Villager_Spawn_Egg.png?ef5c9",
  },
  apiintegration: {
    title: "API Integration & Connectivity",
    body: "Establishing reliable, fixed, and well-documented endpoints for seamless data flow.",
    Long_Desc: "Logic, documentation, and connection capability are combined to establish a stable and standards-compliant endpoint for seamless data transfer between systems.",
    itemSrc: "https://minecraft.wiki/images/Lodestone_JE1_BE1.png?3348f",
  },
  bootstrap: {
    title: "Bootstrap Framework",
    body: "Utilizing pre-built, standardized structures for rapid, responsive design implementation.",
    Long_Desc: "We use structural components, documentation, and optimization to deploy a lightweight, ready-made, and responsive layout solution quickly.",
    itemSrc: "https://minecraft.wiki/images/Wall_Lever_%28S%29_JE5-L3.png?039e0",
  },
  jquery: {
    title: "jQuery Library",
    body: "This uses scripting logic, performance, and precision targeting to enable simple control mechanisms for complex DOM manipulation with minimal code.",
    itemSrc: "https://minecraft.wiki/images/Redstone_Torch_JE5.png?ceef5",
  },
  troubleshooting: {
    title: "Troubleshooting (Technical Support)",
    body: "Expertise in diagnosing, repairing, and stabilizing technical and hardware issues.",
    Long_Desc: "We combine logic, knowledge, structure, and precision to effectively diagnose technical faults and restore system stability.",
    itemSrc: "https://minecraft.wiki/images/Amethyst_Shard_JE2_BE1.png?56555",
  },
};

let itemtooltipsData = {
  iron_ingot: { title: "Structure & Stability", body: "The secure, durable foundation and core application architecture.", slotID: "item-slot-1" },
  redstone_dust: { title: "Logic & Automation", body: "Complex business logic, scripting, and control flow for automation.", slotID: "item-slot-2" },
  feather: { title: "Performance & Optimization", body: "Lightweight code and optimizing for speed and high performance.", slotID: "item-slot-3" },
  book: { title: "Knowledge & Documentation", body: "Adhering to standards, and meticulous documentation and learning.", slotID: "item-slot-4" },
  quartz: { title: "Precision & Aesthetics", body: "Clean code, attention to detail, and pixel-perfect UI design.", slotID: "item-slot-5" },
  ender_pearl: { title: "Connectivity & Telemetry", body: "Managing network requests and connecting disparate systems (APIs).", slotID: "item-slot-6" },
};

export function PanoramaBackground(ContainerID = "PanoramaContainerNONE", EnableBackgroundAnimation = true, RotationSpeed = 0.001) {
  if (ContainerID === "PanoramaContainerNONE") {
    console.warn("PanoramaBackground: No container ID provided, panorama background will not be initialized.");
    return;
  }

  const scene = new THREE.Scene();
  const $container = $(`#${ContainerID}`);
  $container.css({
    width: "100vw",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    overflow: "hidden",
  });

  // Prevent zooming on touch devices (tablet / iOS / Android)
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isTouchDevice && isMobileUA) {
    // Ensure viewport disallows scaling (helps most browsers)
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.content = "width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no";

    // Add CSS to reduce touch-driven gestures on the panorama container
    $("html, body, #" + ContainerID).css({
      "touch-action": "none", // prevents pinch/zoom and double-tap gestures in supporting browsers
      "-ms-touch-action": "none",
      "overscroll-behavior": "none",
      "-webkit-user-select": "none",
      "user-select": "none",
    });

    // Prevent iOS gesturestart (pinch) and block multi-touch move default
    const onGestureStart = (e) => e.preventDefault();
    const onTouchMove = (e) => {
      if (e.touches && e.touches.length > 1) e.preventDefault();
    };

    // Prevent double-tap zoom by blocking quick consecutive touchend events
    let lastTouchEnd = 0;
    const onTouchEnd = (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    };

    document.addEventListener("gesturestart", onGestureStart, {
      passive: false,
    });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: false });

    // Clean up listeners if the panorama container is removed
    const cleanup = () => {
      document.removeEventListener("gesturestart", onGestureStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
    const removeObserver = new MutationObserver(() => {
      if (!document.getElementById(ContainerID)) {
        cleanup();
        removeObserver.disconnect();
      }
    });
    removeObserver.observe(document.body, { childList: true, subtree: true });
  }

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  $(`#${ContainerID}`).append(renderer.domElement);

  const rotationSpeed = RotationSpeed;

  const loader = new THREE.CubeTextureLoader();
  const PathToThemes = "textures/Panoramas/";
  const themes = ["BuzzyBees", "ChaseTheSkys", "Cliffs", "GardenAwakens", "Nether"];

  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
  const texture = loader.load([
    `${PathToThemes}${selectedTheme}/panorama_3.png`, // +x
    `${PathToThemes}${selectedTheme}/panorama_1.png`, // -x
    `${PathToThemes}${selectedTheme}/panorama_4.png`, // +y (top)
    `${PathToThemes}${selectedTheme}/panorama_5.png`, // -y (bottom)
    `${PathToThemes}${selectedTheme}/panorama_2.png`, // +z
    `${PathToThemes}${selectedTheme}/panorama_0.png`, // -z
  ]);

  scene.background = texture;
  camera.position.set(0, 0, 0);
  function animate() {
    if (!EnableBackgroundAnimation) {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    } else {
      requestAnimationFrame(animate);
      camera.rotation.y += rotationSpeed;
      renderer.render(scene, camera);
    }
  }
  animate();

  $(window).on("resize", function () {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

export function LoadingScreenFadeOut(isUnderDevelopment = false, enableLoadingScreen = true) {
  if (!enableLoadingScreen) {
    $("#LoadingScreen").remove();
    return;
  }

  localStorage.setItem("StarttheSound", "false");
  const Random = Math.random() * 5000 + 10000;

  if (Random >= 10000) {
    setTimeout(() => {
      $("#SubLoadingText").fadeIn(500, function () {
        $(this).removeClass("d-none").hide().fadeIn(500);
      });
    }, Random / 2);
  }

  setTimeout(() => {
    if (isUnderDevelopment) {
      $("#LoadingText")
        .fadeOut(500, function () {
          $(this).css("font-family", "MinecraftiaRegular").css("font-size", "clamp(16px, 4vw, 24px)").text("Portfolio is still under development.").fadeIn(500);
          $("#SubLoadingText").fadeOut(300);
        })
        .fadeIn(500, function () {
          setTimeout(() => {
            $("#LoadingScreen").fadeOut(1000, function () {
              // check if in mobile device
              const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
              if (isMobile) {
                setTimeout(() => {
                  $("#LoadingText").css("font-family", "MinecraftiaRegular").css("font-size", "clamp(14px, 3.5vw, 20px)").text("For the best experience, please use a desktop browser.").fadeIn(500);
                }, 500);
              }
              $(this).remove();
              localStorage.setItem("StarttheSound", "true");
            });
          }, 2500);
        });
    } else {
      $("#LoadingScreen").fadeOut(1000, function () {
        $(this).remove();
        localStorage.setItem("StarttheSound", "true");
      });
    }
  }, Random);
}

// NOTE: There's a bug in this function where music on Android devices may not start
// automatically even after user interaction due to browser restrictions. (will fix later)
export function BackgroundMusic(EnableSounds = true, BackgroundMusicVolume = 0.5) {
  if (!EnableSounds) return;

  if (window.__bgMusic) {
    window.__bgMusic.volume = BackgroundMusicVolume;
    return window.__bgMusic;
  }

  const bgMusic = new Audio("Assets/Sounds/BG-Music.ogg");
  bgMusic.preload = "auto";
  bgMusic.loop = true;
  bgMusic.volume = BackgroundMusicVolume;
  bgMusic.playsInline = true; // helps iOS Safari
  bgMusic.crossOrigin = "anonymous";
  window.__bgMusic = bgMusic;

  const AudioCtx = window.__audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  window.__audioCtx = AudioCtx;

  bgMusic.muted = true;
  bgMusic.play().catch(() => {});

  const tryPlay = async (forceUnmute = false) => {
    try {
      if (AudioCtx.state === "suspended") await AudioCtx.resume();

      const shouldStart = localStorage.getItem("StarttheSound") === "true";
      if (shouldStart || forceUnmute) {
        bgMusic.muted = false;
        bgMusic.volume = BackgroundMusicVolume;
        await bgMusic.play();
      } else {
        bgMusic.pause();
      }
    } catch (err) {
      console.warn("Background music playback was prevented:", err);
    }
  };

  const onFirstInteraction = () => {
    tryPlay(true);
    removeInteractionListeners();
  };
  const interactionEvents = ["pointerdown", "touchend", "keydown", "click"];
  const addInteractionListeners = () => interactionEvents.forEach((ev) => window.addEventListener(ev, onFirstInteraction, { passive: true }));
  const removeInteractionListeners = () => interactionEvents.forEach((ev) => window.removeEventListener(ev, onFirstInteraction));
  addInteractionListeners();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      bgMusic.pause();
    } else {
      tryPlay();
    }
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "StarttheSound") tryPlay();
  });

  const observer = new MutationObserver(() => {
    if (!document.getElementById("LoadingScreen")) {
      tryPlay();
      observer.disconnect();
      removeInteractionListeners();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  tryPlay();

  return bgMusic;
}

export function ServiceWorkerRegister() {
  if ("serviceWorker" in navigator) {
    try {
      // Derive a sensible base for the sw file and scope. Prefer a <base> tag if present,
      // otherwise use the current location directory. This covers root and subpath
      // deployments.
      const baseEl = document.querySelector("base");
      const baseHref = baseEl ? baseEl.href : location.href;
      const base = new URL(".", baseHref).href; // ensures trailing slash

      const swUrl = new URL("service-worker.js", base).href;
      const scopePath = new URL(".", base).pathname; // e.g. '/Port-folio/' or '/'

      navigator.serviceWorker
        .register(swUrl, { scope: scopePath })
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);

          // Optional: ask service worker for initial online status using a MessageChannel
          if (registration.active) {
            const mc = new MessageChannel();
            mc.port1.onmessage = (e) => {
              // e.data will be { online: true/false } from the service worker if supported
              document.dispatchEvent(new CustomEvent("sw:online-status", { detail: e.data }));
            };
            try {
              registration.active.postMessage({ type: "CHECK_ONLINE_STATUS" }, [mc.port2]);
            } catch (err) {
              // ignore if postMessage with port fails
            }
          }
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });

      // Listen for messages from the service worker (reload action, network/cache events)
      navigator.serviceWorker.addEventListener("message", (event) => {
        const data = event.data || {};
        if (data && data.action === "reload") {
          // service worker requested a reload for this client
          window.location.reload();
        }

        // re-dispatch network/cache source as a document event for app code to react
        if (data && data.source) {
          document.dispatchEvent(new CustomEvent("sw:status", { detail: data.source }));
        }
      });
    } catch (e) {
      console.error("Service Worker registration error", e);
    }
  }
}

export function Splashtext(ContainerID = "MCsplashTextNONE", portfolioVersion = "0.0") {
  if (ContainerID === "MCsplashTextNONE") {
    console.warn("Splashtext: No container ID provided, splash text will not be set.");
    return;
  }

  const splashTexts = [
    "Portfolio v" + portfolioVersion + "!!!",
    "Caps Portfolio!!",
    "Made by Caps!!!!",
    "Hello World!!!!!",
    "Enjoy your stay!",
    "Coding is fun!!!",
    "Minecraft vibes!",
    "Three.js magic!!",
    "WebGL wonder!!!!",
  ];

  const randomIndex = Math.floor(Math.random() * splashTexts.length);
  const selectedSplashText = splashTexts[randomIndex];
  $(`#${ContainerID}`).text(selectedSplashText);
}

export function CopyRightName(YearContainerID = "current-year", OwnerContainerID = "owner-name", PortfolioVersion = "0.0") {
  const currentYear = new Date().getFullYear();
  $(`#${YearContainerID}`).text(currentYear);
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    $(`#${OwnerContainerID}`).text("Unknownplanet40 (on localhost)");
  } else if (window.location.hostname === "unknownplanet40.github.io" && window.location.pathname.startsWith("/Port-folio/")) {
    const owner = window.location.hostname.split(".github")[0];
    $(`#${OwnerContainerID}`).text(owner.charAt(0).toUpperCase() + owner.slice(1));
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const owner = urlParams.get("owner") || "Your Name";
    $(`#${OwnerContainerID}`).text(owner);
  }

  $(`#portfolio-version`).text(`Portfolio v${PortfolioVersion}`);
  $(`#portfolio-version-2`).text(`Portfolio v${PortfolioVersion} - © ${new Date().getFullYear()}`);
}

export function TooltipInit() {
  (function ($) {
    $.fn.mcTooltip = function () {
      const $tooltip = $("#tooltip");
      if (!$tooltip.length) {
        console.warn("mcTooltip: #tooltip element not found, plugin disabled.");
        return this;
      }
      const $header = $("#tooltip-header");
      const $body = $("#tooltip-body");

      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      const supportsHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
      const useImmediateTouchHover = isTouchDevice && !supportsHover;

      function positionTooltip(e, $el) {
        const padding = 12;
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        let clientX, clientY;
        if (e) {
          if (e.touches && e.touches.length) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
          } else if (e.changedTouches && e.changedTouches.length) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
          } else if (typeof e.clientX === "number" && typeof e.clientY === "number") {
            clientX = e.clientX;
            clientY = e.clientY;
          }
        }

        if (clientX == null || clientY == null) {
          if ($el && $el.length) {
            const r = $el[0].getBoundingClientRect();
            clientX = Math.round(r.left + 10);
            clientY = Math.round(r.bottom + 10);
          } else {
            clientX = padding;
            clientY = padding;
          }
        }

        let x = clientX + padding;
        let y = clientY + padding;

        $tooltip.css({ left: "0px", top: "0px", display: "block", opacity: 1 });
        const rect = $tooltip[0].getBoundingClientRect();

        if (x + rect.width + padding > vw) x = clientX - rect.width - padding;
        if (y + rect.height + padding > vh) y = clientY - rect.height - padding;

        x = Math.max(0, x);
        y = Math.max(0, y);

        $tooltip.css({ left: x + "px", top: y + "px" });
      }

      return this.each(function () {
        const $el = $(this);

        let touchTimer = null;
        let touchVisible = false;
        let startX = 0;
        let startY = 0;

        function show(ev) {
          const title = $el.attr("data-title") || "";
          const txt = $el.attr("data-body") || "";
          if ($header.length) $header.text(title);
          if ($body.length) $body.text(txt);
          $tooltip.show().css("opacity", "1");
          const native = ev && ev.originalEvent ? ev.originalEvent : ev;
          positionTooltip(native, $el);
        }

        function move(ev) {
          const native = ev && ev.originalEvent ? ev.originalEvent : ev;
          positionTooltip(native, $el);
        }

        function hide() {
          $tooltip.hide();
          touchVisible = false;
        }

        $el.on("mouseenter.mcTooltip", show);
        $el.on("mousemove.mcTooltip", move);
        $el.on("mouseleave.mcTooltip", hide);

        $el.on("focus.mcTooltip", function (ev) {
          show(ev);
        });
        $el.on("blur.mcTooltip", hide);

        if (isTouchDevice) {
          $el.on(
            "touchstart.mcTooltip",
            function (ev) {
              if (!ev || !ev.originalEvent) return;
              const native = ev.originalEvent;
              const t = native.touches && native.touches[0];
              startX = t ? t.clientX : 0;
              startY = t ? t.clientY : 0;
              touchVisible = false;

              if (useImmediateTouchHover) {
                show(native);
                touchVisible = true;
                setTimeout(() => {
                  if (touchVisible) hide();
                }, 1500);
              } else {
                touchTimer = setTimeout(() => {
                  show(native);
                  touchVisible = true;
                  setTimeout(() => {
                    const outsideHandler = (e) => {
                      if (!$(e.target).closest("#tooltip, [data-tooltip]").length) {
                        hide();
                        document.removeEventListener("touchstart", outsideHandler);
                      }
                    };
                    document.addEventListener("touchstart", outsideHandler, { passive: true });
                  }, 0);
                }, 300);
              }
            },
            { passive: true }
          );

          $el.on(
            "touchmove.mcTooltip",
            function (ev) {
              const native = ev && ev.originalEvent ? ev.originalEvent : ev;
              const t = native.touches && native.touches[0];
              if (!t) return;
              const dx = Math.abs(t.clientX - startX);
              const dy = Math.abs(t.clientY - startY);
              if (dx > 10 || dy > 10) {
                if (touchTimer) {
                  clearTimeout(touchTimer);
                  touchTimer = null;
                }
                if (touchVisible) {
                  move(native);
                }
              } else if (touchVisible) {
                move(native);
              }
            },
            { passive: true }
          );

          $el.on(
            "touchend.mcTooltip touchcancel.mcTooltip",
            function (ev) {
              if (touchTimer) {
                clearTimeout(touchTimer);
                touchTimer = null;
              }
              if (touchVisible) {
                setTimeout(hide, 800);
              }
            },
            { passive: true }
          );
        }
      });
    };
    $(function () {
      $("[data-tooltip]").mcTooltip();
    });
  })(jQuery);
}

export function ExternalLinkSetup() {
  $(".GH-Click").click(function () {
    window.open("https://github.com/Unknownplanet40", "_blank");
  });

  $(".R-Click").click(function () {
    window.open("./Assets/resume.pdf", "_blank");
  });

  $(".FB-Click").click(function () {
    window.open("https://www.facebook.com/Cappps.Lock", "_blank");
  });

  $(".LI-Click").click(function () {
    window.open("https://www.linkedin.com/in/rj45", "_blank");
  });

  const $hintSidebar = $(".hint-sidebar");
  const $hintContainer = $("#HintContainer");
  const $hintButton = $("#hint-button");

  $hintContainer.on("click", function (e) {
    e.preventDefault();
    if ($hintSidebar.hasClass("sidebar-in")) {
      $hintSidebar.removeClass("sidebar-in").addClass("sidebar-out");
    } else if ($hintSidebar.hasClass("sidebar-out")) {
      $hintSidebar.removeClass("sidebar-out").addClass("sidebar-in");
    } else {
      $hintSidebar.addClass("sidebar-in");
    }
  });

  $hintButton.on("click", function (e) {
    e.preventDefault();
    if ($hintSidebar.hasClass("sidebar-in")) {
      $hintSidebar.removeClass("sidebar-in").addClass("sidebar-out");
    } else if ($hintSidebar.hasClass("sidebar-out")) {
      $hintSidebar.removeClass("sidebar-out").addClass("sidebar-in");
    } else {
      $hintSidebar.addClass("sidebar-in");
    }
  });
}

export function SoundEffectSetup() {
  const audio = new Audio("Assets/Sounds/BtnClickSound.mp3");
  audio.preload = "auto";
  audio.volume = 0.3;
  audio.playsInline = true;

  $(".MC-BTN-CLICK").on("click", function () {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });
}

// This function Playertexture is not my original code. its generated from an AI model and modified by me to fit my needs.
export function Playertexture(ContainerID = "char-box", SkinURL = null, RotateCharacter = false) {
  const $container = $(`#${ContainerID}`);
  if (!$container.length) {
    console.warn(`Playertexture: container '#${ContainerID}' not found.`);
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  $container[0].appendChild(canvas);

  const createViewer = (SkinViewerClass) => {
    if (!SkinViewerClass) {
      console.error("Playertexture: SkinViewer class not available.");
      return null;
    }

    const getBoxSize = () => {
      const el = $container[0];
      const cs = window.getComputedStyle(el);
      const parsedW = parseInt(cs.width, 10);
      const parsedH = parseInt(cs.height, 10);
      const w = Number.isFinite(parsedW) && parsedW > 0 ? parsedW : el.clientWidth || 200;
      const h = Number.isFinite(parsedH) && parsedH > 0 ? parsedH : el.clientHeight || 300;
      return { w, h };
    };

    const size = getBoxSize();
    // Ensure canvas bitmap size matches container (important for crisp rendering)
    canvas.width = size.w;
    canvas.height = size.h;
    canvas.style.width = size.w + "px";
    canvas.style.height = size.h + "px";

    const viewer = new SkinViewerClass({
      canvas: canvas,
      width: size.w,
      height: size.h,
      skin: SkinURL || "https://skins.minecraft.net/MinecraftSkins/Steve.png", // this link may be broken in future
    });

    viewer.autoRotate = RotateCharacter;
    viewer.zoom = 0.7;

    // Slightly scale the model so it appears a bit larger in the char box
    try {
      const scaleFactor = 1.15; // tweak this value to scale more/less
      if (viewer.playerWrapper && viewer.playerWrapper.scale) {
        viewer.playerWrapper.scale.set(scaleFactor, scaleFactor, scaleFactor);
      } else if (viewer.playerObject && viewer.playerObject.scale) {
        viewer.playerObject.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }
    } catch (e) {
      // ignore if scaling is not available
    }

    // Make the model follow pointer position over the container
    try {
      const cfg = {
        maxHeadYaw: 0.6, // radians left/right for the head
        maxHeadPitch: 0.45, // radians up/down for the head
        wrapperYaw: 0.8, // radians for whole-model yaw
      };

      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

      // Smooth reset helpers
      const cancelSmoothReset = () => {
        try {
          if (viewer.__followMouse && viewer.__followMouse.resetAnimationId) {
            window.cancelAnimationFrame(viewer.__followMouse.resetAnimationId);
            viewer.__followMouse.resetAnimationId = null;
          }
        } catch (e) {}
      };

      const startSmoothReset = (duration = 300) => {
        try {
          const head = viewer.playerObject && viewer.playerObject.skin && viewer.playerObject.skin.head;
          if (!head) return;

          cancelSmoothReset();

          const startX = head.rotation.x || 0;
          const startY = head.rotation.y || 0;
          const startTime = performance.now();

          const step = (now) => {
            const t = Math.min(1, (now - startTime) / duration);
            const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
            try {
              head.rotation.x = startX * (1 - ease);
              head.rotation.y = startY * (1 - ease);
            } catch (e) {}
            if (t < 1) {
              viewer.__followMouse.resetAnimationId = window.requestAnimationFrame(step);
            } else {
              viewer.__followMouse.resetAnimationId = null;
              try {
                head.rotation.x = 0;
                head.rotation.y = 0;
              } catch (e) {}
            }
          };

          viewer.__followMouse.resetAnimationId = window.requestAnimationFrame(step);
        } catch (e) {}
      };

      const pointerMove = (ev) => {
        try {
          // cancel any running smooth reset so user input takes precedence
          if (viewer.__followMouse) cancelSmoothReset();

          const rect = $container[0].getBoundingClientRect();
          const clientX = ev.touches && ev.touches[0] ? ev.touches[0].clientX : ev.clientX;
          const clientY = ev.touches && ev.touches[0] ? ev.touches[0].clientY : ev.clientY;

          const nx = ((clientX - rect.left) / rect.width) * 2 - 1; // -1 .. 1
          const ny = ((clientY - rect.top) / rect.height) * 2 - 1; // -1 .. 1

          const targetHeadY = nx * cfg.maxHeadYaw;
          // map vertical so moving pointer up makes the head look up
          const targetHeadX = clamp(ny * cfg.maxHeadPitch, -cfg.maxHeadPitch, cfg.maxHeadPitch);

          // Only move the head, not the whole wrapper
          const head = viewer.playerObject && viewer.playerObject.skin && viewer.playerObject.skin.head;
          if (head) {
            head.rotation.y = targetHeadY;
            head.rotation.x = targetHeadX;
          }
        } catch (e) {
          // ignore pointer handler errors
        }
      };

      const resetPose = () => {
        // start a smooth reset when pointer leaves
        try {
          if (!viewer.__followMouse) viewer.__followMouse = {};
          startSmoothReset(300);
        } catch (e) {}
      };

      $container[0].addEventListener("pointermove", pointerMove, { passive: true });
      $container[0].addEventListener("touchmove", pointerMove, { passive: true });
      $container[0].addEventListener("pointerleave", resetPose, { passive: true });
      $container[0].addEventListener("touchend", resetPose, { passive: true });
      $container[0].addEventListener("mouseleave", resetPose, { passive: true });
      $container[0].addEventListener(
        "mouseout",
        function (e) {
          // if relatedTarget is null, pointer left the window
          if (!e || !e.relatedTarget) resetPose();
        },
        { passive: true }
      );

      // also listen for window-level leave events to reset when the pointer exits the browser window
      const onWindowPointerLeave = (e) => {
        resetPose();
      };
      const onWindowMouseOut = (e) => {
        if (!e || !e.relatedTarget) resetPose();
      };
      window.addEventListener("pointerleave", onWindowPointerLeave, { passive: true });
      window.addEventListener("mouseout", onWindowMouseOut, { passive: true });

      // expose handlers for cleanup
      viewer.__followMouse = { pointerMove, resetPose, onWindowPointerLeave, onWindowMouseOut };
    } catch (e) {
      // don't break viewer creation when follow feature fails
    }

    const onResize = () => {
      const newSize = getBoxSize();
      canvas.width = newSize.w;
      canvas.height = newSize.h;
      canvas.style.width = newSize.w + "px";
      canvas.style.height = newSize.h + "px";
      viewer.width = newSize.w;
      viewer.height = newSize.h;
    };

    $(window).on("resize", onResize);

    // attach viewer reference and a destroy helper to the container element so callers can cleanup
    try {
      $container[0].__skinViewer = viewer;
      viewer.__onResize = onResize;
      viewer.destroyViewer = function () {
        try {
          if (viewer.__onResize) {
            $(window).off("resize", viewer.__onResize);
          }
          // stop any animations / auto-rotate
          try {
            viewer.autoRotate = false;
          } catch (e) {}

          // call common cleanup APIs if present
          if (typeof viewer.dispose === "function") {
            try {
              viewer.dispose();
            } catch (e) {}
          }
          if (typeof viewer.destroy === "function") {
            try {
              viewer.destroy();
            } catch (e) {}
          }
          if (typeof viewer.stop === "function") {
            try {
              viewer.stop();
            } catch (e) {}
          }

          // remove canvas from DOM if still present
          try {
            if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
          } catch (e) {}

          // remove pointer listeners if attached
          try {
            if (viewer.__followMouse && $container && $container[0]) {
              try {
                $container[0].removeEventListener("pointermove", viewer.__followMouse.pointerMove);
              } catch (e) {}
              try {
                $container[0].removeEventListener("touchmove", viewer.__followMouse.pointerMove);
              } catch (e) {}
              try {
                $container[0].removeEventListener("pointerleave", viewer.__followMouse.resetPose);
              } catch (e) {}
              try {
                $container[0].removeEventListener("touchend", viewer.__followMouse.resetPose);
              } catch (e) {}
              try {
                $container[0].removeEventListener("mouseleave", viewer.__followMouse.resetPose);
              } catch (e) {}
              try {
                // the mouseout handler was added as an anonymous function, so removing by reference isn't possible here;
                // but we remove window-level handlers below which cover leaving the page as well.
                $container[0].removeEventListener("mouseout", viewer.__followMouse.resetPose);
              } catch (e) {}
              try {
                if (viewer.__followMouse.onWindowPointerLeave) window.removeEventListener("pointerleave", viewer.__followMouse.onWindowPointerLeave);
              } catch (e) {}
              try {
                if (viewer.__followMouse.onWindowMouseOut) window.removeEventListener("mouseout", viewer.__followMouse.onWindowMouseOut);
              } catch (e) {}
              try {
                // also cancel any smooth reset animation
                if (viewer.__followMouse && viewer.__followMouse.resetAnimationId) {
                  window.cancelAnimationFrame(viewer.__followMouse.resetAnimationId);
                  viewer.__followMouse.resetAnimationId = null;
                }
              } catch (e) {}
            }
          } catch (e) {}

          try {
            delete $container[0].__skinViewer;
          } catch (e) {}
        } catch (e) {
          console.warn("Error during viewer.destroyViewer:", e);
        }
      };
    } catch (e) {
      // ignore attach failures
    }

    return viewer;
  };

  // If the global bundle was included via a <script> tag, prefer that. Otherwise dynamically import.
  if (typeof window !== "undefined" && window.skinview3d && window.skinview3d.SkinViewer) {
    return createViewer(window.skinview3d.SkinViewer);
  }

  // Dynamic import returns a Promise that resolves to the created viewer (or null on failure).
  return import("https://unpkg.com/skinview3d/bundles/skinview3d.bundle.js")
    .then((mod) => {
      const SkinViewerClass = mod.SkinViewer || (mod.default && mod.default.SkinViewer) || (window.skinview3d && window.skinview3d.SkinViewer);
      return createViewer(SkinViewerClass);
    })
    .catch((err) => {
      console.error("Failed to load skinview3d:", err);
      return null;
    });
}

export function InventorySetup() {
  // item recipe pattern and inventory interaction
  let FrontendPattern = {
    slot_1: "iron_ingot",
    slot_2: null,
    slot_3: "feather",
    slot_4: null,
    slot_5: "quartz",
    slot_6: null,
    slot_7: null,
    slot_8: null,
    slot_9: null,
  };

  let BackendPattern = {
    slot_1: "iron_ingot",
    slot_2: "redstone_dust",
    slot_3: null,
    slot_4: "book",
    slot_5: null,
    slot_6: "ender_pearl",
    slot_7: null,
    slot_8: null,
    slot_9: null,
  };

  let DatabasePattern = {
    slot_1: "iron_ingot",
    slot_2: "redstone_dust",
    slot_3: null,
    slot_4: "book",
    slot_5: "quartz",
    slot_6: "ender_pearl",
    slot_7: null,
    slot_8: null,
    slot_9: null,
  };

  let BootstrapPattern = {
    slot_1: "iron_ingot",
    slot_2: null,
    slot_3: "feather",
    slot_4: "book",
    slot_5: null,
    slot_6: null,
    slot_7: null,
    slot_8: null,
    slot_9: null,
  };

  let JQueryPattern = {
    slot_1: null,
    slot_2: "redstone_dust",
    slot_3: "feather",
    slot_4: null,
    slot_5: "quartz",
    slot_6: null,
    slot_7: null,
    slot_8: null,
    slot_9: null,
  };

  let APIIntegrationPattern = {
    slot_1: null,
    slot_2: "redstone_dust",
    slot_3: null,
    slot_4: "book",
    slot_5: null,
    slot_6: "ender_pearl",
    slot_7: null,
    slot_8: null,
    slot_9: null,
  };

  let TroubleshootingPattern = {
    slot_1: "iron_ingot",
    slot_2: "redstone_dust",
    slot_3: null,
    slot_4: "book",
    slot_5: "quartz",
    slot_6: null,
    slot_7: null,
    slot_8: null,
    slot_9: null,
  };

  let InventoryItems = {
    slot_1: null,
    slot_2: null,
    slot_3: null,
    slot_4: null,
    slot_5: null,
    slot_6: null,
    slot_7: null,
    slot_8: null,
    slot_9: null,
  };

  let currentDraggedItemName = null;
  let tooltipsOldItemID = null;

  function animatePickup(el) {
    el.classList.remove("item-drop");
    el.classList.add("item-pickup");

    setTimeout(() => {
      el.classList.remove("item-pickup");
    }, 150);
  }

  function animateDrop(el) {
    el.classList.remove("item-pickup");
    el.classList.add("item-drop");

    setTimeout(() => {
      el.classList.remove("item-drop");
    }, 150);
  }

  function invInstructionTextUpdate(InventoryItems, isforceClear = false) {
    const $inventoryInstruction = $("#inventory-instruction-text");
    const $originalText = "You can drag and drop the items into the inventory slots. Try to match the correct patterns to unlock special skills!";
    const $pickupText = "You can Right-Click to remove items from slots!";
    let isthereItemInSlot = false;

    for (const slot in InventoryItems) {
      if (InventoryItems[slot]) {
        isthereItemInSlot = true;
        break;
      }
    }
    if (isthereItemInSlot) {
      $inventoryInstruction.text($pickupText);
    } else {
      $inventoryInstruction.text($originalText);
    }

    if (isforceClear) {
      if (isthereItemInSlot) {
        $inventoryInstruction.text($pickupText);
      } else {
        $inventoryInstruction.text($originalText);
      }
    }
  }

  function AddTooltipData(SlotID, itemName, isMainSlot = false) {
    // normalize SlotID to a DOM element (accepts id string, DOM element, or jQuery object)
    const resolveSlotElement = (s) => {
      if (!s) return null;
      if (typeof s === "string") return document.getElementById(s);
      // jQuery object
      if (s.jquery && s.length) return s[0];
      // DOM element
      if (s.nodeType === 1) return s;
      return null;
    };

    if (isMainSlot) {
      if (recipeDatas[itemName]) {
        const tooltipInfo = recipeDatas[itemName];
        const SlotElement = resolveSlotElement(SlotID);
        if (!SlotElement) return;
        SlotElement.setAttribute("data-tooltip", "true");
        SlotElement.setAttribute("data-title", tooltipInfo.title);
        SlotElement.setAttribute("data-body", tooltipInfo.body);

        // If the tooltip plugin was already initialized on document ready, re-init on this element
        try {
          if (window.jQuery && typeof window.jQuery.fn.mcTooltip === "function") {
            window.jQuery(SlotElement).mcTooltip();
          }
        } catch (e) {
          // ignore initialization errors
        }

        // remember the element id for later removal
        tooltipsOldItemID = SlotElement.id || null;
      }
    }

    if (itemtooltipsData[itemName]) {
      const tooltipInfo = itemtooltipsData[itemName];
      const SlotElement = resolveSlotElement(SlotID);
      if (!SlotElement) return;
      SlotElement.setAttribute("data-tooltip", "true");
      SlotElement.setAttribute("data-title", tooltipInfo.title);
      SlotElement.setAttribute("data-body", tooltipInfo.body);

      // If the tooltip plugin was already initialized on document ready,
      // re-initialize the newly-marked element so it gets the handlers.
      try {
        if (window.jQuery && typeof window.jQuery.fn.mcTooltip === "function") {
          window.jQuery(SlotElement).mcTooltip();
        }
      } catch (e) {
        // ignore initialization errors
      }

      tooltipsOldItemID = SlotElement.id || null;
    }
  }

  function RemoveTooltipData(SlotID) {
    const SlotElement = typeof SlotID === "string" ? document.getElementById(SlotID) : SlotID;
    if (!SlotElement) return;

    try {
      // Remove data attributes
      SlotElement.removeAttribute("data-tooltip");
      SlotElement.removeAttribute("data-title");
      SlotElement.removeAttribute("data-body");

      // If jQuery is available, remove mcTooltip namespaced handlers attached by TooltipInit
      if (window.jQuery) {
        try {
          window.jQuery(SlotElement).off(".mcTooltip");
        } catch (e) {
          // ignore
        }
        // Hide global tooltip element if visible
        try {
          const $tooltip = window.jQuery("#tooltip");
          if ($tooltip.length && $tooltip.is(":visible")) $tooltip.hide();
        } catch (e) {}
      } else {
        // Fallback: hide tooltip element if present
        const tooltipEl = document.getElementById("tooltip");
        if (tooltipEl) tooltipEl.style.display = "none";
      }
    } catch (err) {
      console.warn("RemoveTooltipData error:", err);
    }

    tooltipsOldItemID = null;
  }

  const dragItems1 = $("#Dragable-Item-1");
  const dragItems2 = $("#Dragable-Item-2");
  const dragItems3 = $("#Dragable-Item-3");
  const dragItems4 = $("#Dragable-Item-4");
  const dragItems5 = $("#Dragable-Item-5");
  const dragItems6 = $("#Dragable-Item-6");

  // for every dragable item add description tooltip
  [dragItems1, dragItems2, dragItems3, dragItems4, dragItems5, dragItems6].forEach((item) => {
    const itemName = item[0].getAttribute("data-item-name");
    AddTooltipData(item[0], itemName, true);
  });

  let inventorySlots = document.querySelectorAll(".inv-slot");
  let itemSlots = document.querySelectorAll(".itm-slot");
  let mainInventorySlot = document.getElementById("inv-slot-MAIN");

  // Make any item draggable
  function makeDraggable(el) {
    el.draggable = true;
    el.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("item-id", e.target.id);
      currentDraggedItemName = e.target.getAttribute("data-item-name");
    });
  }

  // Make the source item draggable
  [dragItems1, dragItems2, dragItems3, dragItems4, dragItems5, dragItems6].forEach((item) => {
    makeDraggable(item[0]);
  });

  // Create a clone for original item ONLY
  function createClone(original) {
    let clone = original.cloneNode(true);
    clone.id = original.id + "-clone-" + Date.now();
    clone.setAttribute("data-original", "false");
    makeDraggable(clone);
    return clone;
  }

  // Inventory drop handler
  function handleDrop(e, slot) {
    e.preventDefault();

    let itemId = e.dataTransfer.getData("item-id");
    let original = document.getElementById(itemId);

    if (!original) return;

    let isOriginal = original.hasAttribute("data-original") && original.getAttribute("data-original") === "true";

    // Clear slot
    slot.innerHTML = "";

    if (isOriginal) {
      // Source → clone
      let clone = createClone(original);
      slot.appendChild(clone);
      animatePickup(clone);

      // Update InventoryItems
      let slotKey = slot.id.replace("inv-slot-", "slot_");
      let InventoryDropSlot = slot.id;
      InventoryItems[slotKey] = currentDraggedItemName;
      AddTooltipData(InventoryDropSlot, currentDraggedItemName);
    } else {
      // Inventory → move item
      slot.appendChild(original);
      animateDrop(original);

      // Find and clear old slot
      let oldSlotkey = null;
      for (let key in InventoryItems) {
        if (InventoryItems[key] === currentDraggedItemName) {
          oldSlotkey = key;
          break;
        }
      }

      // Clear old slot
      if (oldSlotkey) {
        InventoryItems[oldSlotkey] = null;
      }

      // Set new slot
      let slotKey = slot.id.replace("inv-slot-", "slot_");
      let InventoryDropSlot = slot.id;
      InventoryItems[slotKey] = currentDraggedItemName;

      RemoveTooltipData(tooltipsOldItemID);
      AddTooltipData(InventoryDropSlot, currentDraggedItemName);
    }

    invInstructionTextUpdate(InventoryItems);

    let FrontendMatch = true;
    let BackendMatch = true;
    let DatabaseMatch = true;
    let APIIntegrationMatch = true;
    let BootstrapMatch = true;
    let JQueryMatch = true;
    let TroubleshootingMatch = true;

    for (let i = 1; i <= 9; i++) {
      let slotKey = "slot_" + i;
      if (InventoryItems[slotKey] !== FrontendPattern[slotKey]) FrontendMatch = false;
      if (InventoryItems[slotKey] !== BackendPattern[slotKey]) BackendMatch = false;
      if (InventoryItems[slotKey] !== DatabasePattern[slotKey]) DatabaseMatch = false;
      if (InventoryItems[slotKey] !== APIIntegrationPattern[slotKey]) APIIntegrationMatch = false;
      if (InventoryItems[slotKey] !== BootstrapPattern[slotKey]) BootstrapMatch = false;
      if (InventoryItems[slotKey] !== JQueryPattern[slotKey]) JQueryMatch = false;
      if (InventoryItems[slotKey] !== TroubleshootingPattern[slotKey]) TroubleshootingMatch = false;
    }

    console.log(
      "FrontendMatch:",
      FrontendMatch,
      "BackendMatch:",
      BackendMatch,
      "DatabaseMatch:",
      DatabaseMatch,
      "APIIntegrationMatch:",
      APIIntegrationMatch,
      "BootstrapMatch:",
      BootstrapMatch,
      "JQueryMatch:",
      JQueryMatch,
      "TroubleshootingMatch:",
      TroubleshootingMatch
    );

    mainInventorySlot.innerHTML = "";
    $("#item-info-box").css("visibility", "hidden");

    if (FrontendMatch) {
      const data = recipeDatas["frontend"];
      mainInventorySlot.innerHTML = `<img src="${data.itemSrc}" alt="" class="slot-image ms-0" id="FrontEnd-Item" draggable="false"/>`;
      AddTooltipData(mainInventorySlot, "frontend", true);

      $("#item-info-box").css("visibility", "visible");
      $("#item-name").text(data.title);
      $("#item-description").text(data.Long_Desc);
      localStorage.setItem("unlockedSkill_diamond", "true");
      hintrecipeData();
    }

    if (BackendMatch) {
      const data = recipeDatas["backend"];
      mainInventorySlot.innerHTML = `<img src="${data.itemSrc}" alt="" class="slot-image ms-0" id="BackEnd-Item" draggable="false"/>`;
      AddTooltipData(mainInventorySlot, "backend", true);

      $("#item-info-box").css("visibility", "visible");
      $("#item-name").text(data.title);
      $("#item-description").text(data.Long_Desc);
      localStorage.setItem("unlockedSkill_commandblock", "true");
      hintrecipeData();
    }

    if (DatabaseMatch) {
      const data = recipeDatas["database"];
      mainInventorySlot.innerHTML = `<img src="${data.itemSrc}" alt="" class="slot-image ms-0" id="Database-Item" draggable="false"/>`;
      AddTooltipData(mainInventorySlot, "database", true);

      $("#item-info-box").css("visibility", "visible");
      $("#item-name").text(data.title);
      $("#item-description").text(data.Long_Desc);
      localStorage.setItem("unlockedSkill_spawnegg", "true");
      hintrecipeData();
    }

    if (APIIntegrationMatch) {
      const data = recipeDatas["api_integration"];
      mainInventorySlot.innerHTML = `<img src="${data.itemSrc}" alt="" class="slot-image ms-0" id="APIIntegration-Item" draggable="false"/>`;
      AddTooltipData(mainInventorySlot, "api_integration", true);

      $("#item-info-box").css("visibility", "visible");
      $("#item-name").text(data.title);
      $("#item-description").text(data.Long_Desc);
      localStorage.setItem("unlockedSkill_lodestone", "true");
      hintrecipeData();
    }

    if (BootstrapMatch) {
      const data = recipeDatas["bootstrap"];
      mainInventorySlot.innerHTML = `<img src="${data.itemSrc}" alt="" class="slot-image ms-0" id="Bootstrap-Item" draggable="false"/>`;
      AddTooltipData(mainInventorySlot, "bootstrap", true);

      $("#item-info-box").css("visibility", "visible");
      $("#item-name").text(data.title);
      $("#item-description").text(data.Long_Desc);
      localStorage.setItem("unlockedSkill_lever", "true");
      hintrecipeData();
    }

    if (JQueryMatch) {
      const data = recipeDatas["jquery"];
      mainInventorySlot.innerHTML = `<img src="${data.itemSrc}" alt="" class="slot-image ms-0" id="JQuery-Item" draggable="false"/>`;
      AddTooltipData(mainInventorySlot, "jquery", true);

      $("#item-info-box").css("visibility", "visible");
      $("#item-name").text(data.title);
      $("#item-description").text(data.Long_Desc);
      localStorage.setItem("unlockedSkill_rockstone_dust", "true");
      hintrecipeData();
    }

    if (TroubleshootingMatch) {
      const data = recipeDatas["troubleshooting"];
      mainInventorySlot.innerHTML = `<img src="${data.itemSrc}" alt="" class="slot-image ms-0" id="Troubleshooting-Item" draggable="false"/>`;
      AddTooltipData(mainInventorySlot, "troubleshooting", true);
      $("#item-info-box").css("visibility", "visible");

      $("#item-name").text(data.title);
      $("#item-description").text(data.Long_Desc);
      localStorage.setItem("unlockedSkill_amethystshard", "true");
      hintrecipeData();
    }
  }

  $("#item-info-box").css("visibility", "hidden");

  // INVENTORY SLOTS
  inventorySlots.forEach((slot) => {
    slot.addEventListener("dragover", (e) => e.preventDefault());
    slot.addEventListener("drop", (e) => handleDrop(e, slot));
  });

  // ITEM SLOTS (if moving back from inventory)
  itemSlots.forEach((slot) => {
    slot.addEventListener("dragover", (e) => e.preventDefault());
    slot.addEventListener("drop", (e) => handleDrop(e, slot));
  });

  $("#item-slot-clear").click(function () {
    // Clear inventory
    inventorySlots.forEach((slot) => {
      slot.innerHTML = "";
      RemoveTooltipData(slot.id);
    });
    $("#item-info-box").css("visibility", "hidden");

    for (let key in InventoryItems) {
      InventoryItems[key] = null;
    }

    mainInventorySlot.innerHTML = "";

    currentDraggedItemName = null;
    tooltipsOldItemID = null;

    invInstructionTextUpdate(InventoryItems, true);
  });

  inventorySlots.forEach((slot) => {
    slot.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      slot.innerHTML = "";
      RemoveTooltipData(slot.id);
      let slotKey = slot.id.replace("inv-slot-", "slot_");
      InventoryItems[slotKey] = null;
      mainInventorySlot.innerHTML = "";
      $("#item-info-box").css("visibility", "hidden");
      invInstructionTextUpdate(InventoryItems, true);
      console.log("Inventory slot cleared:", slot.id);
      console.log("Current InventoryItems state:", InventoryItems);
    });
  });
}

export function hintrecipeData() {
  const hintData = [
    {
      title: "Diamond",
      item_name: "diamond",
      hint_desc: "To craft a <b>flawless interface</b>, combine <b>Structure</b>, <b>Performance</b>, and <b>Precision</b> across the <b>top and center slots</b>.",
      Slots: ["1", "3", "5"],
    },
    {
      title: "Command Block",
      item_name: "commandblock",
      hint_desc: "<b>Robust servers</b> require <b>Structure</b> and <b>Logic</b> in the <b>top row</b>, supported by <b>Knowledge</b> and <b>Connectivity</b> in the <b>middle row</b>.",
      Slots: ["1", "2", "4", "6"],
    },
    {
      title: "Spawn Egg",
      item_name: "spawnegg",
      hint_desc: "This <b>complex recipe</b> needs five ingredients! Ensure <b>Structure, Logic, Knowledge, Precision, and Connectivity</b> are all present in the <b>top and middle rows</b>.",
      Slots: ["1", "2", "4", "5", "6"],
    },
    {
      title: "Armor Stand",
      item_name: "armorstand",
      hint_desc: "Deploy a <b>standardized structure</b> by combining <b>Structure</b>, <b>Performance</b>, and <b>Knowledge</b> in the <b>top-left and middle-left</b> quadrant.",
      Slots: ["1", "3", "4"],
    },
    {
      title: "Lever",
      item_name: "lever",
      hint_desc: "Create the <b>simple control</b> by placing <b>Logic</b> next to <b>Performance</b> in the <b>top row</b>, with <b>Precision</b> directly in the <b>center slot</b>.",
      Slots: ["2", "3", "5"],
    },
    {
      title: "Lodestone",
      item_name: "lodestone",
      hint_desc: "Establish a <b>stable endpoint</b> by connecting <b>Logic</b>, <b>Knowledge</b>, and <b>Connectivity</b> in a <b>diagonal line</b> across the <b>left side of the grid</b>.",
      Slots: ["2", "4", "6"],
    },
    {
      title: "Amethyst Shard",
      item_name: "amethystshard",
      hint_desc: "To <b>fix the system</b>, ensure <b>Structure</b> and <b>Logic</b> are in the <b>top-left</b>, and <b>Knowledge</b> and <b>Precision</b> are placed right below them.",
      Slots: ["1", "2", "4", "5"],
    },
  ];

  const Skill_diamond = {
    slot_1: "iron_ingot",
    slot_2: null,
    slot_3: "feather",
    slot_4: null,
    slot_5: "quartz",
    slot_6: null,
    slot_7: null,
    slot_8: null,
    slot_9: null,
    outcome: "diamond",
  };

  const Skill_commandblock = {
    slot_1: "iron_ingot",
    slot_2: "redstone_dust",
    slot_3: null,
    slot_4: "book",
    slot_5: null,
    slot_6: "ender_pearl",
    slot_7: null,
    slot_8: null,
    slot_9: null,
    outcome: "commandblock",
  };

  const Skill_spawnegg = {
    slot_1: "iron_ingot",
    slot_2: "redstone_dust",
    slot_3: null,
    slot_4: "book",
    slot_5: "quartz",
    slot_6: "ender_pearl",
    slot_7: null,
    slot_8: null,
    slot_9: null,
    outcome: "spawnegg",
  };

  const Skill_redstone_torch = {
    slot_1: "iron_ingot",
    slot_2: null,
    slot_3: "feather",
    slot_4: "book",
    slot_5: null,
    slot_6: null,
    slot_7: null,
    slot_8: null,
    slot_9: null,
    outcome: "armorstand",
  };

  const Skill_lever = {
    slot_1: null,
    slot_2: "redstone_dust",
    slot_3: "feather",
    slot_4: null,
    slot_5: "quartz",
    slot_6: null,
    slot_7: null,
    slot_8: null,
    slot_9: null,
    outcome: "lever",
  };

  const Skill_lodestone = {
    slot_1: null,
    slot_2: "redstone_dust",
    slot_3: null,
    slot_4: "book",
    slot_5: null,
    slot_6: "ender_pearl",
    slot_7: null,
    slot_8: null,
    slot_9: null,
    outcome: "lodestone",
  };

  const Skill_amethystshard = {
    slot_1: "iron_ingot",
    slot_2: "redstone_dust",
    slot_3: null,
    slot_4: "book",
    slot_5: "quartz",
    slot_6: null,
    slot_7: null,
    slot_8: null,
    slot_9: null,
    outcome: "amethystshard",
  };

  // create hint boxes dynamically
  const hintContainer = $("#hint-content");
  const unlock = "<img src='./Assets/confirm.png' alt='Unlock Icon' class='hint-icon align-self-start me-0' />";
  const lock = "<img src='./Assets/cancel.png' alt='Lock Icon' class='hint-icon align-self-start me-0' />";
  const iron_ingot = "<img src='https://minecraft.wiki/images/Iron_Ingot_JE3_BE2.png?849cb' alt='Iron Ingot' class='slot-image-small' draggable='false' />";
  const redstone_dust = "<img src='https://minecraft.wiki/images/Redstone_Dust_JE2_BE2.png?8cf17' alt='Redstone Dust' class='slot-image-small' draggable='false' />";
  const feather = "<img src='https://minecraft.wiki/images/Feather_JE3_BE2.png?b869b' alt='Feather' class='slot-image-small' draggable='false' />";
  const book = "<img src='https://minecraft.wiki/images/Book_and_Quill_JE2_BE2.png?2128f' alt='Book' class='slot-image-small' draggable='false' />";
  const quartz = "<img src='https://minecraft.wiki/images/Nether_Quartz_JE2_BE2.png?d0049' alt='Quartz' class='slot-image-small' draggable='false' />";
  const ender_pearl = "<img src='https://minecraft.wiki/images/Ender_Pearl_JE3_BE2.png?829a7' alt='Ender Pearl' class='slot-image-small' draggable='false' />";

  const diamond = "<img src='https://minecraft.wiki/images/Diamond_JE3_BE3.png?99d00' alt='Diamond' class='slot-image' draggable='false' />";
  const command_block = "<img src='https://minecraft.wiki/images/Impulse_Command_Block.gif?fb024' alt='Command Block' class='slot-image' draggable='false' />";
  const spawn_egg = "<img src='https://minecraft.wiki/images/Invicon_Villager_Spawn_Egg.png?ef5c9' alt='Spawn Egg' class='slot-image' draggable='false' />";
  const lodestone = "<img src='https://minecraft.wiki/images/Lodestone_JE1_BE1.png?3348f' alt='Lodestone' class='slot-image' />";
  const redstone_torch = "<img src='https://minecraft.wiki/images/Redstone_Torch_JE5.png?ceef5' alt='Armor Stand' class='slot-image' draggable='false' />";
  const lever = "<img src='https://minecraft.wiki/images/Wall_Lever_%28S%29_JE5-L3.png?039e0' alt='Lever' class='slot-image' />";
  const amethyst_shard = "<img src='https://minecraft.wiki/images/Amethyst_Shard_JE2_BE1.png?56555' alt='Amethyst Shard' class='slot-image' draggable='false' />";

  function checkSkillUnlock(skillKey) {
    return localStorage.getItem(skillKey) === "true";
  }

  function displayRequiredItem(itemName, isoutcome = false, slotID = null) {
    const skillsMap = {
      diamond: Skill_diamond,
      commandblock: Skill_commandblock,
      spawnegg: Skill_spawnegg,
      redstone_torch: Skill_redstone_torch,
      lever: Skill_lever,
      lodestone: Skill_lodestone,
      amethystshard: Skill_amethystshard,
    };

    const skillObj = skillsMap[itemName];
    if (!skillObj) return "";
    let itemimage = "";

    if (slotID) {
      const slotKey = `slot_${slotID}`;
      const requiredItem = skillObj[slotKey];
      switch (requiredItem) {
        case "iron_ingot":
          itemimage = iron_ingot;
          break;
        case "redstone_dust":
          itemimage = redstone_dust;
          break;
        case "feather":
          itemimage = feather;
          break;
        case "book":
          itemimage = book;
          break;
        case "quartz":
          itemimage = quartz;
          break;
        case "ender_pearl":
          itemimage = ender_pearl;
          break;
        default:
          return "";
      }
    }

    if (isoutcome) {
      switch (skillObj.outcome) {
        case "diamond":
          itemimage = diamond;
          break;
        case "commandblock":
          itemimage = command_block;
          break;
        case "spawnegg":
          itemimage = spawn_egg;
          break;
        case "redstone_torch":
          itemimage = redstone_torch;
          break;
        case "lever":
          itemimage = lever;
          break;
        case "lodestone":
          itemimage = lodestone;
          break;
        case "amethystshard":
          itemimage = amethyst_shard;
          break;
        default:
          itemimage = "";
          break;
      }
    }

    return itemimage;
  }

  hintContainer.empty();

  hintData.forEach((hint, index) => {
    const hintBox = $(`
    <div class="vstack hint-box-container">
      <div class="hstack position-relative">
        ${checkSkillUnlock(`unlockedSkill_${hint.item_name}`) ? unlock : lock}
        <div class="hint-text p-2 mx-0">
          <p class="mb-0 fw-bold">
            <div class="hstack">
              <span class="hint-text-title">${hint.title}</span>
              <small class="ms-auto hint-text-slots">Slots: ${hint.Slots.join(", ")}</small>
            </div>
          <p class="mb-0 hint-text-desc" style="font-size: 0.9rem">${hint.hint_desc}</p>
        </div>
      </div>
      <div class="container-fluid ${checkSkillUnlock(`unlockedSkill_${hint.item_name}`) ? "" : "d-none"}">
        <div class="row p-2 g-2">
          <div class="col-6 d-flex justify-content-end align-items-end">
            <div class="vstack">
              <div class="hstack justify-content-end">
                <div class="slot small-slot">${displayRequiredItem(hint.item_name, false, "1") || ""}</div>
                <div class="slot small-slot">${displayRequiredItem(hint.item_name, false, "2") || ""}</div>
                <div class="slot small-slot">${displayRequiredItem(hint.item_name, false, "3") || ""}</div>
              </div>
              <div class="hstack justify-content-end">
                <div class="slot small-slot">${displayRequiredItem(hint.item_name, false, "4") || ""}</div>
                <div class="slot small-slot">${displayRequiredItem(hint.item_name, false, "5") || ""}</div>
                <div class="slot small-slot">${displayRequiredItem(hint.item_name, false, "6") || ""}</div>
              </div>
              <div class="hstack justify-content-end">
                <div class="slot small-slot">${displayRequiredItem(hint.item_name, false, "7") || ""}</div>
                <div class="slot small-slot">${displayRequiredItem(hint.item_name, false, "8") || ""}</div>
                <div class="slot small-slot">${displayRequiredItem(hint.item_name, false, "9") || ""}</div>
              </div>
            </div>
          </div>
          <div class="col-6 d-flex justify-content-center align-items-center">
            <div class="vstack">
              <div class="hstack justify-content-start">
                <div class="slot small-slot small-h-slot" style="visibility: hidden;"></div>
              </div>
              <div class="hstack justify-content-center">
                <div class="slot slot-inv" id="hint-outcome-slot-${index}">${displayRequiredItem(hint.item_name, true) || ""}</div>
              </div>
              <div class="hstack justify-content-start">
                <div class="slot small-slot small-h-slot" style="visibility: hidden;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `);
    hintContainer.append(hintBox);
  });
}
