import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.180.0/three.module.min.js";

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
