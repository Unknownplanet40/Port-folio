import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.180.0/three.module.min.js";

//settings
const enableLoadingScreen = true; // set to false to disable loading screen
const underDevelopment = true; // set to true to show under development message
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const enablebackgroundAnimation = true; // set to false to disable background animation
const rotationSpeed = 0.0008; // rotation speed of the background
const enableBGMusic = true; // set to false to disable background music

$(".btn-Clicksound").on("click", function () {
  const audio = new Audio("Assets/Sounds/BtnClickSound.mp3");
  audio.play();
});

$(document).ready(function () {
  let BGMUSIC;
  if (enableBGMusic) {
    BGMUSIC = new Audio("Assets/Sounds/BG-Music.ogg");
    BGMUSIC.loop = true;
    BGMUSIC.volume = 0.5;

    const playMusic = () => {
      BGMUSIC.play();
      $(window).off("click keydown", playMusic);
    };

    $(window).on("click keydown", playMusic);

    // Remove automatic play on window load to avoid NotAllowedError

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        BGMUSIC.pause();
      } else {
        if (BGMUSIC.paused) {
          BGMUSIC.play().catch(() => {});
        }
      }
    });
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  $("body").append(renderer.domElement);

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
    if (enablebackgroundAnimation) {
      camera.rotation.y += rotationSpeed;
    }
    renderer.render(scene, camera);
  }
  animate();

  $(window).on("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const splashTexts = [
    "Portfolio 1.0!",
    "Caps Portfolio!",
    "Made by Caps!!!",
    "Hello World!!!",
    "Enjoy your stay!",
    "Coding is fun!!",
    "Minecraft vibes!",
    "Three.js magic!!",
    "WebGL wonder!!!",
  ];

  function getRandomSplashText() {
    const index = Math.floor(Math.random() * splashTexts.length);
    return splashTexts[index];
  }

  $("#splash-text").text(getRandomSplashText());

  if (enableLoadingScreen) {
    const randomDelay = Math.random() * 2000 + 1000;
    if (underDevelopment) {
      $(window).on("load", function () {
        $(".loading-text").text("Loading...");
        setTimeout(function () {
          $(".loading-text").css("font-family", "MinecraftiaRegular");
          $(".loading-text").text("This Portfolio is under development!");
            $("#loading-help-text").fadeOut(500);
          setTimeout(function () {
            $("#loading-screen").fadeOut(500, function () {
              $(this).remove();
              $("#PopupModal").modal("show");
            });
          }, Math.random() * 2000 + 2000);
        }, randomDelay);
      });
    } else {
      $(window).on("load", function () {
        setTimeout(function () {
          $("#loading-screen").fadeOut(500, function () {
            $(this).remove();
          });
        }, randomDelay);
      });
    }
  } else {
    $("#loading-screen").remove();
  }

  $("#current-year").text(new Date().getFullYear());

  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    $("#owner-name").text("Unknownplanet40 (on localhost)");
  } else if (
    window.location.hostname === "unknownplanet40.github.io" &&
    window.location.pathname.startsWith("/Port-folio/")
  ) {
    const owner = window.location.hostname.split(".github")[0];
    $("#owner-name").text(owner.charAt(0).toUpperCase() + owner.slice(1));
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const owner = urlParams.get("owner") || "Your Name";
    $("#owner-name").text(owner);
  }
});
