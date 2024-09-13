/**
 * Updates the image source and background color based on screen width.
 */
function updateImageSource() {
  const isSmallScreen = window.innerWidth <= 720;

  // Switch image and styles based on screen width
  if (isSmallScreen) {
    document.body.style.backgroundColor = "#2A3647";
    image.src = "./assets/img/logo_white.svg";
    startingScreen.style.transform = "translate(-50%, -50%)";
  } else {
    document.body.style.backgroundColor = "#F6F7F8";
    image.src = "./assets/img/logo_black.svg";
    startingScreen.style.transform = "translate(-50%, -50%)";
  }
}

// Cache DOM elements
const startingScreen = document.getElementById("startingScreen");
const image = document.getElementById("responsiveImage");

// Update image on page load and window resize
window.addEventListener("resize", updateImageSource);
window.addEventListener("load", updateImageSource);

/**
 * Event handler for the end of the startingScreen animation.
 * Changes the image source and background color if the window width is 720 pixels or less.
 */
startingScreen.addEventListener("animationend", function () {
  if (window.innerWidth <= 720) {
    image.src = "./assets/img/logo_black.svg";
    document.body.style.backgroundColor = "#F6F7F8";
  }
});
