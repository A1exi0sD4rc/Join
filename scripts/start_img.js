/**
 * DOM Elements.
 */
const startingScreen = document.getElementById("startingScreen");
const image = document.getElementById("responsiveImage");

/**
 * Updates the image source and background color based on screen width.
 */
function updateImageSource() {
  const isSmallScreen = window.innerWidth <= 720;

  if (isSmallScreen) {
    image.src = "./assets/img/logo_white.svg";
    startingScreen.style.transform = "translate(-50%, -50%)";
  } else {
    image.src = "./assets/img/logo_black.svg";
    startingScreen.style.transform = "translate(-50%, -50%)";
  }
}

/**
 * Handles the background color transition to match the logo's animation.
 */
function triggerBackgroundTransition() {
  setTimeout(() => {
    document.body.style.transition = "background-color 1s ease";
    document.body.style.backgroundColor = "#F6F7F8";
  }, 500);
}

startingScreen.addEventListener("animationstart", function () {
  if (window.innerWidth <= 720) {
    triggerBackgroundTransition();
  }
});

/**
 * Handles when the logo finishes animating, switching the logo source.
 */
startingScreen.addEventListener("animationend", function () {
  if (window.innerWidth <= 720) {
    image.src = "./assets/img/logo_black.svg";
  }
});

/**
 * Update image on page load and window resize.
 */
window.addEventListener("resize", updateImageSource);
window.addEventListener("load", updateImageSource);
