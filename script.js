import { PanoramaBackground, LoadingScreenFadeOut, ServiceWorkerRegister, Splashtext, CopyRightName, TooltipInit, ExternalLinkSetup, handleCharacterViewer } from "./Functions/JS_Functions.js";
import { BackgroundMusic, SoundEffectSetup, InventorySetup, hintrecipeData } from "./Functions/JS_Functions.js";

if (typeof $ === "undefined") {
  throw new Error("jQuery is required for this script to work. Please include jQuery before this script.");
}
let devmode = true;
let UNDER_DEVELOPMENT = false;
let ENABLE_BACKGROUND_ANIMATION = true;
let BACKGROUND_ROTATION_SPEED = 0.001;
let ENABLE_LOADING_SCREEN = true;
let PORTFOLIOVERSION = "2.0";
let ROTATE_CHARACTER = true;
let isStaticBG = false;
let isStaticPlayerCharacter = false;

if (devmode) {
  UNDER_DEVELOPMENT = true;
  ENABLE_LOADING_SCREEN = false;
  ENABLE_BACKGROUND_ANIMATION = false;
  ROTATE_CHARACTER = false;
  isStaticBG = true;
  isStaticPlayerCharacter = true;

  console.group("Development Mode Settings");
  console.warn("Development mode is enabled. Certain features may be disabled for testing purposes.");
  console.info("Some Graphical features are disabled to improve performance during development.");
  console.groupEnd();
}

$(document).ready(function () {
  PanoramaBackground("PanoramaContainer", ENABLE_BACKGROUND_ANIMATION, BACKGROUND_ROTATION_SPEED, isStaticBG);
  LoadingScreenFadeOut(UNDER_DEVELOPMENT, ENABLE_LOADING_SCREEN);
  BackgroundMusic(true, 0.5);
  ServiceWorkerRegister();
  Splashtext("MCsplashText", PORTFOLIOVERSION);
  CopyRightName("current-year", "owner-name", PORTFOLIOVERSION);
  TooltipInit();
  ExternalLinkSetup();
  SoundEffectSetup();
  handleCharacterViewer(ROTATE_CHARACTER, isStaticPlayerCharacter);
  InventorySetup();
  hintrecipeData();

  /*   if (UNDER_DEVELOPMENT) {
    $("#Modal-1").modal("show");
  } */
});
