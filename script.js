import { PanoramaBackground, LoadingScreenFadeOut, ServiceWorkerRegister, Splashtext, CopyRightName, TooltipInit, ExternalLinkSetup, Playertexture } from "./Functions/JS_Functions.js";
import { BackgroundMusic, SoundEffectSetup, InventorySetup } from "./Functions/JS_Functions.js";

if (typeof $ === "undefined") {
  throw new Error("jQuery is required for this script to work. Please include jQuery before this script.");
}

let UNDER_DEVELOPMENT = true;
let ENABLE_BACKGROUND_ANIMATION = true;
let BACKGROUND_ROTATION_SPEED = 0.001;
let ENABLE_LOADING_SCREEN = true;
let PORTFOLIOVERSION = "2.0";
let ROTATE_CHARACTER = false;
let devmode = false;

if (devmode) {
  console.log("Development Mode is ON");
  ENABLE_LOADING_SCREEN = false;
  ENABLE_BACKGROUND_ANIMATION = false;
  ROTATE_CHARACTER = false;
}

$(document).ready(function () {
  PanoramaBackground("PanoramaContainer", ENABLE_BACKGROUND_ANIMATION, BACKGROUND_ROTATION_SPEED);
  LoadingScreenFadeOut(UNDER_DEVELOPMENT, ENABLE_LOADING_SCREEN);
  BackgroundMusic(true, 0.5);
  ServiceWorkerRegister();
  Splashtext("MCsplashText", PORTFOLIOVERSION);
  CopyRightName("current-year", "owner-name", PORTFOLIOVERSION);
  TooltipInit();
  ExternalLinkSetup();
  SoundEffectSetup();
  handleCharacterViewer();
  InventorySetup();

  if (UNDER_DEVELOPMENT) {
    $("#Modal-1").modal("show");
  }

});

function handleCharacterViewer() {
  let __charViewerRef = null;
  const initCharViewer = () => {
    const res = Playertexture("char-box", "Assets/custom-skin.png", ROTATE_CHARACTER);
    // handle promise or sync return
    if (res && typeof res.then === "function") {
      res.then((v) => {
        __charViewerRef = v;
      });
    } else {
      __charViewerRef = res;
    }
  };

  const destroyCharViewer = () => {
    const cleanup = (v) => {
      if (!v) return;
      try {
        if (typeof v.destroyViewer === "function") {
          v.destroyViewer();
        } else {
          try {
            v.autoRotate = false;
          } catch (e) {}
          if (typeof v.dispose === "function")
            try {
              v.dispose();
            } catch (e) {}
          if (typeof v.destroy === "function")
            try {
              v.destroy();
            } catch (e) {}
          if (typeof v.stop === "function")
            try {
              v.stop();
            } catch (e) {}
        }
      } catch (e) {
        console.warn("Error destroying char viewer:", e);
      }
      __charViewerRef = null;
      try {
        $("#char-box").empty();
      } catch (e) {}
    };

    if (__charViewerRef && typeof __charViewerRef.then === "function") {
      __charViewerRef.then(cleanup).catch(() => {});
    } else {
      cleanup(__charViewerRef);
    }
  };

  // Bind to Bootstrap modal events (Modal id: Modal-1)
  $(document).on("show.bs.modal", "#Modal-1", function () {
    initCharViewer();
  });
  $(document).on("hidden.bs.modal", "#Modal-1", function () {
    destroyCharViewer();
  });
}
