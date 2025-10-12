import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.180.0/three.module.min.js";

// Ensure jQuery is loaded before running the script
if (typeof $ === "undefined") {
  throw new Error(
    "jQuery is required for this script to work. Please include jQuery before this script."
  );
}

//settings
let enableLoadingScreen = true; // set to false to disable loading screen
const underDevelopment = true; // set to true to show under development message
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let enablebackgroundAnimation = true; // set to false to disable background animation
const rotationSpeed = 0.0008; // rotation speed of the background
let enableBGMusic = true; // set to false to disable background music

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

  let soundArray = [
    "https://minecraft.wiki/images/Page_turn1.ogg?213d1",
    "https://minecraft.wiki/images/Page_turn2.ogg?6e3e1",
    "https://minecraft.wiki/images/Page_turn3.ogg?5e9d9",
  ];
  $(".slot-sound").on("click", function () {
    var audio = new Audio(
      soundArray[Math.floor(Math.random() * soundArray.length)]
    );
    audio.play();
  });

  // detect if website is installed as PWA or in standalone mode
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

  $("#playerName").text("Ryan James Capadocia");
  $("#age").text((2025 - 2002).toString() + " years old");
  $("#location").text("Philippines");
  $("#email").text("ryan.capadocia@example.com");
  $("#title").text("Aspiring Web Developer");
  $("#statusMessage").text("Building the future, one line of code at a time.");

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


  function resetInventory() {
    for (let i = 1; i <= 9; i++) {
      $(`#inv-item-${i}`).addClass("d-none").attr({ src: "", alt: "" }).fadeOut();
      $(`#inv-tooltip-${i}`).addClass("d-none text-start").html("");
      $(`#inv-tooltip-${i}`)
        .css({ width: "", minWidth: "" })
        .removeClass("text-start");
      $(`#inv-tooltip-${i}-text`).text("").removeClass("text-info text-light");
      $(`#inv-tooltip-${i}-description`).text("");
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

  $("#skill-item-1").on("click", function () {
    resetInventory();
    $("#inv-item-1")
      .attr({
        src: "https://minecraft.wiki/images/Paper_JE2_BE2.png?9c3be",
        alt: "HTML",
      })
      .removeClass("d-none");
    $("#inv-tooltip-1")
      .removeClass("d-none text-start")
      .html(
        '<strong class="text-info">HTML</strong><br>' +
          '<span class="text-nowrap text-secondary">Structure - the foundation.</span>'
      );
    $("#inv-tooltip-1")
      .css({ width: "auto", minWidth: "275px" })
      .addClass("text-start");

    // CSS Skill
    $("#inv-item-5")
      .attr({
        src: "https://minecraft.wiki/images/Feather_JE3_BE2.png?b869b",
        alt: "CSS",
      })
      .removeClass("d-none");
    $("#inv-tooltip-5")
      .removeClass("d-none text-start")
      .html(
        '<strong class="text-info">CSS</strong><br>' +
          '<span class="text-nowrap text-secondary">Style - the visual flair.</span>'
      );
    $("#inv-tooltip-5")
      .css({ width: "auto", minWidth: "275px" })
      .addClass("text-start");

    // JavaScript Skill
    $("#inv-item-9")
      .attr({
        src: "https://minecraft.wiki/images/Redstone_Dust_JE2_BE2.png?8cf17",
        alt: "JavaScript",
        style:
          "width: 48px; height: 48px; image-rendering: pixelated; image-rendering: crisp-edges",
      })
      .removeClass("d-none");
    $("#inv-tooltip-9")
      .removeClass("d-none text-start")
      .html(
        '<strong class="text-info">JavaScript</strong><br>' +
          '<span class="text-wrap text-secondary">Interactivity & logic.</span>'
      )
      .css({ width: "auto", minWidth: "275px" })
      .addClass("text-start");
  });

  $("#skill-item-2").on("click", function () {
    resetInventory();

    // furnace
    $("#inv-item-2")
      .attr({
        src: "https://minecraft.wiki/images/thumb/Lit_Blast_Furnace_%28S%29_BE1.png/240px-Lit_Blast_Furnace_%28S%29_BE1.png?13048",
        alt: "PHP",
      })
      .removeClass("d-none");
    $("#inv-tooltip-2")
      .removeClass("d-none text-start")
      .html(
        '<strong class="text-info">PHP</strong><br>' +
          '<span class="text-nowrap text-secondary">Server processing power.</span>'
      );
    $("#inv-tooltip-2")
      .css({ width: "auto", minWidth: "275px" })
      .addClass("text-start");
      
      // comparitor
    $("#inv-item-5")
      .attr({
        src: "https://minecraft.wiki/images/Powered_Subtracting_Redstone_Comparator_%28S%29_JE2_BE1.png?b6563&20250907040754",
        alt: "Comparitor",
      })
      .removeClass("d-none");
    $("#inv-tooltip-5")
      .removeClass("d-none text-start")
      .html(
        '<strong class="text-info">API Integration</strong><br>' +
          '<span class="text-nowrap text-secondary">Connecting services seamlessly.</span>'
      );
    $("#inv-tooltip-5")
      .css({ width: "auto", minWidth: "275px" })
      .addClass("text-start");
  });

  $("#skill-item-3").on("click", function () {
    resetInventory();
  });
});
