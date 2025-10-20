const CACHE_NAME = "portfolio-cache-v1";
const OFFLINE_URL = "offline.html";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/Assets/PWA/1.png",
  "/Assets/PWA/2.png",
  "/Assets/PWA/3.png",
  "/Assets/Sounds/BG-Music.ogg",
  "/Assets/Sounds/BtnClickSound.mp3",
  "/Assets/AboutME.png",
  "/Assets/button.png",
  "/Assets/button_highlighted.png",
  "/Assets/button_highlighted_md.png",
  "/Assets/button_highlighted_sm.png",
  "/Assets/button_md.png",
  "/Assets/button_sm.png",
  "/Assets/dialog.png",
  "/Assets/dialogBG.png",
  "/Assets/draft_report.png",
  "/Assets/github-ico.png",
  "/Assets/Gprofile.gif",
  "/Assets/info.png",
  "/Assets/Logo.png",
  "/Assets/map.png",
  "/Assets/pixelprofile.png",
  "/Data/AboutME.json",
  "/fonts/Minecraftia-Regular.ttf",
  "/fonts/mojang.otf",
  "/textures/Panoramas/BuzzyBees/panorama_0.png",
  "/textures/Panoramas/BuzzyBees/panorama_1.png",
  "/textures/Panoramas/BuzzyBees/panorama_2.png",
  "/textures/Panoramas/BuzzyBees/panorama_3.png",
  "/textures/Panoramas/BuzzyBees/panorama_4.png",
  "/textures/Panoramas/BuzzyBees/panorama_5.png",
  "/textures/Panoramas/ChaseTheSkys/panorama_0.png",
  "/textures/Panoramas/ChaseTheSkys/panorama_1.png",
  "/textures/Panoramas/ChaseTheSkys/panorama_2.png",
  "/textures/Panoramas/ChaseTheSkys/panorama_3.png",
  "/textures/Panoramas/ChaseTheSkys/panorama_4.png",
  "/textures/Panoramas/ChaseTheSkys/panorama_5.png",
  "/textures/Panoramas/Cliffs/panorama_0.png",
  "/textures/Panoramas/Cliffs/panorama_1.png",
  "/textures/Panoramas/Cliffs/panorama_2.png",
  "/textures/Panoramas/Cliffs/panorama_3.png",
  "/textures/Panoramas/Cliffs/panorama_4.png",
  "/textures/Panoramas/Cliffs/panorama_5.png",
  "/textures/Panoramas/GardenAwakens/panorama_0.png",
  "/textures/Panoramas/GardenAwakens/panorama_1.png",
  "/textures/Panoramas/GardenAwakens/panorama_2.png",
  "/textures/Panoramas/GardenAwakens/panorama_3.png",
  "/textures/Panoramas/GardenAwakens/panorama_4.png",
  "/textures/Panoramas/GardenAwakens/panorama_5.png",
  "/textures/Panoramas/Nether/panorama_0.png",
  "/textures/Panoramas/Nether/panorama_1.png",
  "/textures/Panoramas/Nether/panorama_2.png",
  "/textures/Panoramas/Nether/panorama_3.png",
  "/textures/Panoramas/Nether/panorama_4.png",
  "/textures/Panoramas/Nether/panorama_5.png",
  "/textures/experience_bar_background.png",
  "/textures/experience_bar_progress.png",
  "/textures/panorama_overlay.png",
  "/font.css",
  "/manifest.json",
  "/script.js",
  "/service-worker.js",
  "/style.css"
];


self.addEventListener("install", (event) => {
    console.log("[ServiceWorker] Install");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("[ServiceWorker] Caching app shell");
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() =>  {
                console.log("[ServiceWorker] All required resources have been cached");
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error("[ServiceWorker] Failed to cache resources during install:", error);
            })
    );
});

self.addEventListener("activate", (event) => {
    console.log("[ServiceWorker] Activate");
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("[ServiceWorker] Removing old cache:", key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => {
            console.log("[ServiceWorker] Claiming clients for current Service Worker");
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", (event) => {
    console.log("[ServiceWorker] Fetch", event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log("[ServiceWorker] Found in cache:", event.request.url);
                    return response;
                }
                console.log("[ServiceWorker] Not found in cache, fetching:", event.request.url);
                return fetch(event.request);
            })
    );
});


