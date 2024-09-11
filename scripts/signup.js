import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

/**
 * Firebase configuration object.
 * @type {Object}
 */
const firebaseConfig = {
  apiKey: "AIzaSyDqK-uqAFM-1r6-EwyKQjvymD6pAgjWgpY",
  authDomain: "join-337-userlist.firebaseapp.com",
  projectId: "join-337-userlist",
  storageBucket: "join-337-userlist.appspot.com",
  messagingSenderId: "742031210353",
  appId: "1:742031210353:web:0829ecb28f78c0971868d0",
  databaseURL: "https://join-337-userlist-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", init);

/**
 * Navigates the browser window to the 'index.html' page.
 */
function navigateBack() {
  window.location.href = "index.html";
}

/**
 * Add the event listener for the arrow container
 */
document.getElementById("backArrow").addEventListener("click", navigateBack);

/**
 * Initializes the signup form and its elements.
 */
function init() {
  const signupForm = document.getElementById("signupForm");
  const signupButton = document.getElementById("signupButton");
  const acceptPolicyImage = document.getElementById("acceptPolicy");

  if (signupForm && signupButton && acceptPolicyImage) {
    setupFormSubmission(signupForm);
  }
}

/**
 * Toggles the checkbox image and enables/disables the signup button.
 */
function toggleCheckboxImage() {
  const image = document.getElementById("acceptPolicy");
  const checkboxDiv = document.querySelector(".check-box");

  if (image.src.includes("checkbox.png")) {
    image.src = "./assets/img/checkbox-checked.png";
    checkboxDiv.dataset.checked = "true";
  } else {
    image.src = "./assets/img/checkbox.png";
    checkboxDiv.dataset.checked = "false";
  }
}

const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

/**
 * Sets up the form submission event listener.
 * @param {HTMLFormElement} form - The signup form element.
 */
function setupFormSubmission(form) {
  form.addEventListener("submit", handleFormSubmit);
}

/**
 * Handles the form submission event.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmit(event) {
  event.preventDefault();

  if (validateInputs()) {
    signupUser(name.value, email.value, password.value);
  }
}

function setError(element, message) {
  if (element.classList.contains("check-box")) {
    const errorDisplay = document.querySelector(".error-checkbox");
    errorDisplay.innerText = message;
    element.classList.add("error");
  } else {
    const signupContainer = element.parentElement;
    const errorDisplay = signupContainer.querySelector(".error-position");

    errorDisplay.innerText = message;
    signupContainer.classList.add("error");
    signupContainer.classList.remove("success");
  }
}

function setSuccess(element) {
  if (element.classList.contains("check-box")) {
    const errorDisplay = document.querySelector(".error-checkbox");
    errorDisplay.innerText = "";
    element.classList.remove("error");
  } else {
    const signupContainer = element.parentElement;
    const errorDisplay = signupContainer.querySelector(".error-position");

    errorDisplay.innerText = "";
    signupContainer.classList.remove("error");
    signupContainer.classList.add("success");
  }
}

/**
 * Validates the email format.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateInputs() {
  let isValid = true;

  if (!validateNameField()) isValid = false;
  if (!validateEmailField()) isValid = false;
  if (!validatePasswordField()) isValid = false;
  if (!validateConfirmPasswordField()) isValid = false;
  if (!validateCheckboxField()) isValid = false;

  return isValid;
}

function validateNameField() {
  const nameValue = name.value.trim();

  if (nameValue === "") {
    setError(name, "Name is required.");
    return false;
  } else if (!validateName(nameValue)) {
    setError(name, "First and last name are required.");
    return false;
  } else {
    setSuccess(name);
    return true;
  }
}

function validateEmailField() {
  const emailValue = email.value.trim();

  if (emailValue === "") {
    setError(email, "Email is required.");
    return false;
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address.");
    return false;
  } else {
    setSuccess(email);
    return true;
  }
}

function validatePasswordField() {
  const passwordValue = password.value.trim();

  if (passwordValue === "") {
    setError(password, "Password is required.");
    return false;
  } else if (passwordValue.length < 8) {
    setError(password, "Password must be at least 8 characters.");
    return false;
  } else {
    setSuccess(password);
    return true;
  }
}

function validateConfirmPasswordField() {
  const confirmPasswordValue = confirmPassword.value.trim();
  const passwordValue = password.value.trim();

  if (confirmPasswordValue === "") {
    setError(confirmPassword, "Please confirm your password.");
    return false;
  } else if (confirmPasswordValue !== passwordValue) {
    setError(confirmPassword, "Passwords do not match.");
    return false;
  } else {
    setSuccess(confirmPassword);
    return true;
  }
}

function validateCheckboxField() {
  const checkboxDiv = document.querySelector(".check-box");
  const isCheckboxChecked = checkboxDiv.dataset.checked === "true";

  if (!isCheckboxChecked) {
    setError(checkboxDiv, "You must accept the Privacy Policy.");
    return false;
  } else {
    setSuccess(checkboxDiv);
    return true;
  }
}

/**
 * Validates the name to ensure it contains at least a first and last name.
 * @param {string} name - The name to validate.
 * @returns {boolean} True if the name is valid, false otherwise.
 */
function validateName(name) {
  const nameParts = name.split(" ");
  return nameParts.length >= 2 && nameParts[0] && nameParts[1];
}

/**
 * Signs up the user by pushing their data to the Firebase Realtime Database.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 */
function signupUser(name, email, password) {
  const usersRef = ref(database, "users");
  push(usersRef, {
    name: name,
    email: email,
    password: password,
  })
    .then(() => {
      signupSuccessfully();
    })
    .catch(() => {
      alert("Error signing up, please try again.");
    });
}

/**
 * Displays a success message and redirects to the homepage after a delay.
 */
function signupSuccessfully() {
  const successMessage = document.getElementById("successMessage");
  successMessage.classList.add("show");

  setTimeout(function () {
    successMessage.classList.remove("show");
    window.location.href = "index.html";
  }, 3000);
}

window.toggleCheckboxImage = toggleCheckboxImage;
