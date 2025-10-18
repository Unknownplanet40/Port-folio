import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.180.0/three.module.min.js";

// Ensure jQuery is loaded before running the script
if (typeof $ === "undefined") {
  throw new Error(
    "jQuery is required for this script to work. Please include jQuery before this script."
  );
}

//Configuration Variables
let enableLoadingScreen = true; // set to false to disable loading screen
const underDevelopment = true; // set to true to show under development message
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let enablebackgroundAnimation = true; // set to false to disable background animation
const rotationSpeed = 0.0008; // rotation speed of the background
let enableBGMusic = true; // set to false to disable background music
let BGMUSIC;
const splashTexts = [
  "Portfolio 1.0!!!",
  "Caps Portfolio!!",
  "Made by Caps!!!!",
  "Hello World!!!!!",
  "Enjoy your stay!",
  "Coding is fun!!!",
  "Minecraft vibes!",
  "Three.js magic!!",
  "WebGL wonder!!!!",
];
let soundArray = [
  "https://minecraft.wiki/images/Page_turn1.ogg?213d1",
  "https://minecraft.wiki/images/Page_turn2.ogg?6e3e1",
  "https://minecraft.wiki/images/Page_turn3.ogg?5e9d9",
];

// Mobile Device Detection
if (isMobile) {
  $("#Mobile-loading-screen").removeClass("d-block d-md-none");
  enableLoadingScreen = false;
  enablebackgroundAnimation = false;
  enableBGMusic = false;
  let mobileText = [
    "It's seeems you're on a mobile device.",
    "For the best experience, please use a larger screen.",
    "This portfolio is optimized for desktops and tablets.",
    "Some features may not work properly on mobile devices.",
    "Consider visiting this portfolio on a laptop or desktop for full functionality.",
    "Thank you for understanding!",
  ];

  let index = 0;
  setInterval(() => {
    $("#IncompatibleForMobileText").fadeOut(500, function () {
      $(this).text(mobileText[index]);
      $(this).fadeIn(500);
    });
    index = (index + 1) % mobileText.length;
  }, 5000);
} else {
  $("#Mobile-loading-screen").addClass("d-none d-md-block");
  enableLoadingScreen = true;
  enablebackgroundAnimation = true;
  enableBGMusic = true;
  $("#IncompatibleForMobileText").text(
    "Please use a larger screen for the best experience."
  );
}

// FUNCTIONS --------------------------------------
// Three.js Panorama Background
function PanoramaBackground() {
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
}

// Get Random Splash Text
function getRandomSplashText() {
  const index = Math.floor(Math.random() * splashTexts.length);
  return splashTexts[index];
}

// Set Owner Name based on URL
function CopyRightName() {
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
}

// Display Mode Check for PWA or Standalone
function displayModeCheck() {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    if (window.innerWidth < 1366) {
      $("#PopupModal").modal("show");
      $("#popupModalLabel").text("It's best viewed on a larger screen.");
      $(".modal").not("#PopupModal").modal("hide");
    }
  } else {
    if (window.innerWidth < 1366) {
      $("#PopupModal").modal("show");
      $("#popupModalLabel").text("It's best viewed on a larger screen.");
      $(".modal").not("#PopupModal").modal("hide");
    }
  }
}

// Reset Inventory Function
function resetInventory() {
  for (let i = 1; i <= 9; i++) {
    $(`#inv-item-${i}`)
      .addClass("d-none")
      .attr({
        src: "",
        alt: "",
      })
      .removeAttr("data-tooltip data-title data-body");
  }

  let soundArray = [
    "https://minecraft.wiki/images/Enchanting_Table_enchant1.ogg?58e1c",
    "https://minecraft.wiki/images/Enchanting_Table_enchant2.ogg?cf629",
    "https://minecraft.wiki/images/Enchanting_Table_enchant3.ogg?0134e",
  ];
  var audio = new Audio(
    soundArray[Math.floor(Math.random() * soundArray.length)]
  );
  audio.play();
}

(function ($) {
  // jQuery plugin to initialize Minecraft-style tooltips
  $.fn.mcTooltip = function () {
    const $tooltip = $("#tooltip");
    // If tooltip container doesn't exist, abort early to avoid runtime errors
    if (!$tooltip.length) {
      console.warn("mcTooltip: #tooltip element not found, plugin disabled.");
      return this;
    }
    const $header = $("#tooltip-header");
    const $body = $("#tooltip-body");

    function positionTooltip(e, $el) {
      const padding = 12;
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      );

      // determine clientX/clientY (mouse event vs focus fallback)
      let clientX, clientY;
      if (e && typeof e.clientX === "number" && typeof e.clientY === "number") {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if ($el && $el.length) {
        const r = $el[0].getBoundingClientRect();
        clientX = Math.round(r.left + 10);
        clientY = Math.round(r.bottom + 10);
      } else {
        clientX = padding;
        clientY = padding;
      }

      let x = clientX + padding;
      let y = clientY + padding;

      // force a reflow to get accurate tooltip size after content change
      $tooltip.css({ left: "0px", top: "0px", display: "block", opacity: 1 });
      const rect = $tooltip[0].getBoundingClientRect();

      if (x + rect.width + padding > vw) x = clientX - rect.width - padding;
      if (y + rect.height + padding > vh) y = clientY - rect.height - padding;

      // Ensure values are non-negative
      x = Math.max(0, x);
      y = Math.max(0, y);

      $tooltip.css({ left: x + "px", top: y + "px" });
    }

    return this.each(function () {
      const $el = $(this);

      function show(ev) {
        const title = $el.attr("data-title") || "";
        const txt = $el.attr("data-body") || "";
        if ($header.length) $header.text(title);
        if ($body.length) $body.text(txt);
        $tooltip.show().css("opacity", "1");
        // use originalEvent for jQuery-wrapped events (mousemove/focus may pass different object)
        const native = ev && ev.originalEvent ? ev.originalEvent : ev;
        positionTooltip(native, $el);
      }

      function move(ev) {
        const native = ev && ev.originalEvent ? ev.originalEvent : ev;
        positionTooltip(native, $el);
      }

      function hide() {
        $tooltip.hide();
      }

      $el.on("mouseenter.mcTooltip", show);
      $el.on("mousemove.mcTooltip", move);
      $el.on("mouseleave.mcTooltip", hide);

      // Accessibility: show on focus, hide on blur
      $el.on("focus.mcTooltip", function (ev) {
        // for keyboard focus there is no mouse event; position using element rect
        show(ev);
      });
      $el.on("blur.mcTooltip", hide);
    });
  };

  // auto-initialize on elements with data-tooltip
  $(function () {
    $("[data-tooltip]").mcTooltip();
  });
})(jQuery);

$("#splash-text").text(getRandomSplashText());
$("#current-year").text(new Date().getFullYear());

$(document).ready(function () {
  // Button Click Sound Effect
  $(".btn-Clicksound").on("click", function () {
    const audio = new Audio("Assets/Sounds/BtnClickSound.mp3");
    audio.play();
  });

  PanoramaBackground();
  CopyRightName();

  // Background Music Setup
  if (enableBGMusic) {
    BGMUSIC = new Audio("Assets/Sounds/BG-Music.ogg");
    BGMUSIC.loop = true;
    BGMUSIC.volume = 0.5;

    const playMusic = () => {
      BGMUSIC.play();
    };

    $(window).on("click keydown", playMusic);

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

  // Slot Sound Effect
  $(".slot-sound").on("click", function () {
    var audio = new Audio(
      soundArray[Math.floor(Math.random() * soundArray.length)]
    );
    audio.play();
  });

  // Handle Window Resize
  $(window).on("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("#AboutMeModal").modal("hide");

    if (
      !$("#loading-screen").length ||
      $("#loading-screen").css("display") === "none" ||
      $("#loading-screen").hasClass("d-none")
    ) {
      if (window.innerWidth <= 968) {
        $("#PopupModal").modal("show");
        $("#popupModalLabel").text("Incompatible Screen Size");
        $(".modal").not("#PopupModal").modal("hide");
      } else {
        $("#popupModalLabel").text(
          "You need to interact with the page to enable sound effects."
        );
        $("#PopupModal").modal("hide");
      }
    }
  });

  // Loading Screen Sequence
  (function () {
    const randomDelay = Math.random() * 4000 + 1000;
    function runLoadingSequence() {
      if (!$("#loading-screen").length) {
        console.warn("⚠️ #loading-screen not found.");
        return;
      }

      if (!enableLoadingScreen) {
        console.log("Loading screen disabled.");
        $("#loading-screen").remove();
        console.log(
          "Loading screen removed at:",
          new Date().toLocaleTimeString()
        );
        return;
      }
      if (underDevelopment) {
        setTimeout(() => {
          $(".loading-text").fadeOut(500, function () {
            $(this)
              .css("font-family", "MinecraftiaRegular")
              .text("Portfolio is still under development.")
              .fadeIn(500);
          });
          $("#loading-help-text").fadeOut(500);

          setTimeout(() => {
            $("#loading-screen").fadeOut(500, function () {
              $(this).remove();
              $("#PopupModal").modal("show");
              $("#PopupModal").on("hidden.bs.modal", function () {
                // for future use
              });
            });
          }, Math.random() * 2000 + 2000);
        }, randomDelay);
      } else {
        setTimeout(() => {
          $("#loading-screen").fadeOut(500, function () {
            $();
          });
        }, randomDelay);
      }
    }

    if (document.readyState === "complete") {
      runLoadingSequence();
    } else {
      $(window).on("load", runLoadingSequence);
    }
  })();

  // detect if website is installed as PWA or in standalone mode
  displayModeCheck();

  // About Me Section Population and Interactions (Temporary Data)
  $("#playerName").text("Ryan James Capadocia");
  $("#age").text((2025 - 2002).toString() + " years old");
  $("#location").text("Philippines");
  $("#email").text("ryan.capadocia@example.com");
  $("#title").text("Aspiring Web Developer");
  $("#statusMessage").text("Building the future, one line of code at a time.");

  // About Me Button Click
  $("#AboutMeBtn").on("click", function () {
    if (window.innerWidth < 1366) {
      $("#PopupModal").modal("show");
      $("#popupModalLabel").text("It's best viewed on a larger screen.");
      $(".modal").not("#PopupModal").modal("hide");
    } else {
      $("#AboutMeModal").modal("show");
      $(".modal").not("#AboutMeModal").modal("hide");
      $("#popupModalLabel").text(
        "You need to interact with the page to enable sound effects."
      );
    }
  });

  $("#slot-1").on("click", function () {
    if (!$("#Info-1").hasClass("d-none")) {
      $("#Info-1").show();
      $("#Info-2").addClass("d-none");
    } else {
      $("#Info-2").fadeOut(200, function () {
        $(this).addClass("d-none");
        $("#Info-1").removeClass("d-none").hide().fadeIn(200);
      });
    }
  });

  $("#slot-2").on("click", function () {
    if (!$("#Info-2").hasClass("d-none")) {
      $("#Info-2").show();
      $("#Info-1").addClass("d-none");
    } else {
      $("#Info-1").fadeOut(200, function () {
        $(this).addClass("d-none");
        $("#Info-2").removeClass("d-none").hide().fadeIn(200);
      });
    }
  });

  $("#slot-1").on("click", function () {
    $("#Info-1").removeClass("d-none");
    $("#Info-2").addClass("d-none").fadeOut();
  });

  $("#slot-2").on("click", function () {
    $("#Info-2").removeClass("d-none");
    $("#Info-1").addClass("d-none").fadeOut();
  });

  $("#skill-item-1").on("click", function () {
    resetInventory();
    $("#inv-item-1")
      .attr({
        src: "https://minecraft.wiki/images/Paper_JE2_BE2.png?9c3be",
        alt: "HTML",
        "data-tooltip": "HTML",
        "data-title": "HTML",
        "data-body": "Structure - the foundation.",
      })
      .removeClass("d-none")
      .mcTooltip();

    // CSS Skill
    $("#inv-item-5")
      .attr({
        src: "https://minecraft.wiki/images/Feather_JE3_BE2.png?b869b",
        alt: "CSS",
        "data-tooltip": "CSS",
        "data-title": "CSS",
        "data-body": "Style - the visual flair.",
      })
      .removeClass("d-none")
      .mcTooltip();

    // JavaScript Skill
    $("#inv-item-9")
      .attr({
        src: "https://minecraft.wiki/images/Redstone_Dust_JE2_BE2.png?8cf17",
        alt: "JavaScript",
        "data-tooltip": "JavaScript",
        "data-title": "JavaScript",
        "data-body": "Interactivity - bringing life to the web.",
      })
      .removeClass("d-none")
      .mcTooltip();
  });

  $("#skill-item-2").on("click", function () {
    resetInventory();

    // furnace
    $("#inv-item-2")
      .attr({
        src: "https://minecraft.wiki/images/thumb/Lit_Blast_Furnace_%28S%29_BE1.png/240px-Lit_Blast_Furnace_%28S%29_BE1.png?13048",
        alt: "PHP",
        "data-tooltip": "",
        "data-title": "PHP",
        "data-body": "Backend - server-side scripting.",
      })
      .removeClass("d-none")
      .mcTooltip();

    // comparitor
    $("#inv-item-5")
      .attr({
        src: "https://minecraft.wiki/images/Powered_Subtracting_Redstone_Comparator_%28S%29_JE2_BE1.png?b6563&20250907040754",
        alt: "Comparitor",
        "data-tooltip": "",
        "data-title": "API Integration",
        "data-body": "Connecting services seamlessly.",
      })
      .removeClass("d-none")
      .mcTooltip();
  });

  $("#skill-item-3").on("click", function () {
    resetInventory();

    $("#inv-item-5")
      .attr({
        src: "https://minecraft.wiki/images/Ender_Pearl_JE3_BE2.png?829a7",
        alt: "mySQL",
        "data-tooltip": "",
        "data-title": "mySQL",
        "data-body": "Skilled in database design and management.",
      })
      .removeClass("d-none")
      .mcTooltip();
  });
});
