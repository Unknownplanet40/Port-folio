import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.180.0/three.module.min.js";

export function PanoramaBackground(ContainerID = "PanoramaContainer", EnableBackgroundAnimation = true, RotationSpeed = 0.001) {
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
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isTouchDevice && isMobileUA) {
    // Ensure viewport disallows scaling (helps most browsers)
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.content = 'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no';

    // Add CSS to reduce touch-driven gestures on the panorama container
    $('html, body, #' + ContainerID).css({
      'touch-action': 'none',         // prevents pinch/zoom and double-tap gestures in supporting browsers
      '-ms-touch-action': 'none',
      'overscroll-behavior': 'none',
      '-webkit-user-select': 'none',
      'user-select': 'none',
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

    document.addEventListener('gesturestart', onGestureStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: false });

    // Clean up listeners if the panorama container is removed
    const cleanup = () => {
      document.removeEventListener('gesturestart', onGestureStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
    const removeObserver = new MutationObserver(() => {
      if (!document.getElementById(ContainerID)) {
        cleanup();
        removeObserver.disconnect();
      }
    });
    removeObserver.observe(document.body, { childList: true, subtree: true });
  }

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  $(`#${ContainerID}`).append(renderer.domElement);

  const enableBackgroundAnimation = EnableBackgroundAnimation;
  const rotationSpeed = RotationSpeed;

  const loader = new THREE.CubeTextureLoader();
  const PathToThemes = "textures/Panoramas/";
  const themes = [
    "BuzzyBees",
    "ChaseTheSkys",
    "Cliffs",
    "GardenAwakens",
    "Nether",
  ];

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
    requestAnimationFrame(animate);
    camera.rotation.y += rotationSpeed;
    renderer.render(scene, camera);
  }
  animate();

  $(window).on("resize", function () {
    // ensure device pixel ratio is capped to prevent apparent "zoom" on high-DPI mobile devices
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

export function LoadingScreenFadeOut(isUnderDevelopment = false) {
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
          $(this)
            .css("font-family", "MinecraftiaRegular")
            .css("font-size", "clamp(16px, 4vw, 24px)")
            .text("Portfolio is still under development.")
            .fadeIn(500);
            $("#SubLoadingText").fadeOut(300);
        })
        .fadeIn(500, function () {
          setTimeout(() => {
            $("#LoadingScreen").fadeOut(1000, function () {
              $(this).remove();
              localStorage.setItem("StarttheSound", "true");
            });
          }, 2000);
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
  const addInteractionListeners = () =>
    interactionEvents.forEach((ev) => window.addEventListener(ev, onFirstInteraction, { passive: true }));
  const removeInteractionListeners = () =>
    interactionEvents.forEach((ev) => window.removeEventListener(ev, onFirstInteraction));
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