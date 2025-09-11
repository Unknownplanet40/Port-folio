import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.180.0/three.module.min.js";

//settings
const enableLoadingScreen = false; // set to false to disable loading screen
const underDevelopment = true; // set to true to show under development message
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const enablebackgroundAnimation = false; // set to false to disable background animation
const rotationSpeed = 0.0008; // rotation speed of the background

// Use jQuery for DOM manipulation and events
$(document).ready(function () {
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

  // Load the cube map (Minecraft panorama images)
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    "textures/panorama_3.png", // +x
    "textures/panorama_1.png", // -x
    "textures/panorama_4.png", // +y (top)
    "textures/panorama_5.png", // -y (bottom)
    "textures/panorama_2.png", // +z
    "textures/panorama_0.png", // -z
  ]);

  scene.background = texture;

  // Camera in the center
  camera.position.set(0, 0, 0);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    if (enablebackgroundAnimation) {
      camera.rotation.y += rotationSpeed;
    }
    renderer.render(scene, camera);
  }
  animate();

  // Make it responsive
  $(window).on("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // splash text
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
          setTimeout(function () {
            $("#loading-screen").fadeOut(500, function () {
              $(this).remove();
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
});
