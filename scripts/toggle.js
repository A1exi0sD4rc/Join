let input_toggle = document.getElementById("toggleButton");
let password_input = document.getElementById("loginPassword");

/**
 * Changes the image of the input toggle to 'visibility.png'.
 */
function changeImage() {
  input_toggle.src = "./assets/img/visibility.png";
}

/**
 * Toggles the password visibility and changes the input toggle image accordingly.
 */
function toggle() {
  if (password_input.type === "password") {
    password_input.type = "text";
    input_toggle.src = "./assets/img/visibility_off.png";
  } else {
    password_input.type = "password";
    input_toggle.src = "./assets/img/visibility.png";
  }
}
