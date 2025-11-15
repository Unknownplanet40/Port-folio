import { PanoramaBackground, LoadingScreenFadeOut, BackgroundMusic, ServiceWorkerRegister, Splashtext, CopyRightName } from "./Functions/JS_Functions.js";

if (typeof $ === "undefined") {
  throw new Error("jQuery is required for this script to work. Please include jQuery before this script.");
}

let UNDER_DEVELOPMENT = true;
let ENABLE_BACKGROUND_ANIMATION = true;
let BACKGROUND_ROTATION_SPEED = 0.001;
let ENABLE_LOADING_SCREEN = true;
let PORTFOLIOVERSION = "2.0";

$(document).ready(function () {
  PanoramaBackground("PanoramaContainer", ENABLE_BACKGROUND_ANIMATION, BACKGROUND_ROTATION_SPEED);
  LoadingScreenFadeOut(UNDER_DEVELOPMENT, ENABLE_LOADING_SCREEN);
  BackgroundMusic(true, 0.5);
  ServiceWorkerRegister();
  Splashtext("MCsplashText", PORTFOLIOVERSION);
  CopyRightName("current-year", "owner-name", PORTFOLIOVERSION);
});
