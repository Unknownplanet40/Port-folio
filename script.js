import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.180.0/three.module.min.js";

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the cube map (Minecraft panorama images)
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  "textures/panorama_3.png", // +x
  "textures/panorama_1.png", // -x
  "textures/panorama_4.png", // +y (top)
  "textures/panorama_5.png", // -y (bottom)
  "textures/panorama_2.png", // +z
  "textures/panorama_0.png"  // -z
]);

scene.background = texture;

// Camera in the center
camera.position.set(0, 0, 0);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Slowly rotate like Minecraft's main menu
  camera.rotation.y += 0.0008; // on

  renderer.render(scene, camera);
}
animate();

// Make it responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// splash text
//id = splash-text

const splashTexts = [
  "Portfolio 1.0",
  "Caps Portfolio",
  "Made by Caps",
  "Hello World!",
  "Welcome to my site!",
  "Enjoy your stay!",
  "Coding is fun!",
  "Minecraft vibes",
  "Three.js magic",
  "WebGL wonder",
];  

function getRandomSplashText() {
  const index = Math.floor(Math.random() * splashTexts.length);
  return splashTexts[index];
}

document.getElementById("splash-text").innerText = getRandomSplashText();
const underConstruction = true; // Change to false if the portfolio is finished
if (underConstruction) {
  document.getElementById("loading-text").innerText = "Loading...";
  document.getElementById("loading-text").style.fontFamily = "Mojang";
  setTimeout(() => {
    document.getElementById("loading-text").style.fontFamily = "MinecraftiaRegular";
    document.getElementById("loading-text").innerText = "Ready!";
    setTimeout(() => {
      document.getElementById("loading-text").innerText =
        "This Portfolio is not finished yet!";
      setTimeout(() => {
        document.querySelector(".loadings").classList.add("fade-out");
      }, 4000);
    }, 1000);
  }, 2500);
} else {
  setTimeout(() => {
    document.querySelector(".loadings").classList.add("fade-out");
  }, 4000);
}