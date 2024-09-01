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

let signup_toggle_confirm = document.getElementById("toggle_button_confirm");
let signup_password = document.getElementById("password");
let confirm_signup_password = document.getElementById("confirmPassword");
let signup_toggle = document.getElementById("toggle_button");

/**
 * Changes the image of the signup confirm toggle to 'visibility.png'.
 */
function changeImageSignupConfirm() {
  signup_toggle_confirm.src = "./assets/img/visibility.png";
}

/**
 * Changes the image of the signup toggle to 'visibility.png'.
 */
function changeImageSignup() {
  signup_toggle.src = "./assets/img/visibility.png";
}

/**
 * Toggles the confirm password visibility and changes the confirm toggle image accordingly.
 */
function signupToggleConfirm() {
  if (confirm_signup_password.type === "password") {
    confirm_signup_password.type = "text";
    signup_toggle_confirm.src = "./assets/img/visibility_off.png";
  } else {
    confirm_signup_password.type = "password";
    signup_toggle_confirm.src = "./assets/img/visibility.png";
  }
}

/**
 * Toggles the signup password visibility and changes the signup toggle image accordingly.
 */
function signupToggle() {
  if (signup_password.type === "password") {
    signup_password.type = "text";
    signup_toggle.src = "./assets/img/visibility_off.png";
  } else {
    signup_password.type = "password";
    signup_toggle.src = "./assets/img/visibility.png";
  }
}
