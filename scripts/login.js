import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
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

/**
 * Initializes Firebase app.
 * @type {firebase.app.App}
 */
const app = initializeApp(firebaseConfig);

/**
 * Gets the database service for the default app or a given app.
 * @type {firebase.database.Database}
 */
const database = getDatabase(app);

/**
 * Executes when the window loads.
 */
window.onload = function () {
  const rememberMe = localStorage.getItem("rememberMe");
  const checkbox = document.getElementById("checkbox");
  const emailField = document.getElementById("loginEmail");
  const passwordField = document.getElementById("loginPassword");

  if (rememberMe === "true") {
    checkbox.src = "./assets/img/checkbox-checked.png";
    emailField.value = localStorage.getItem("email");
    passwordField.value = localStorage.getItem("password");
  } else {
    checkbox.src = "./assets/img/checkbox.png";
  }

  init();
};

/**
 * Initializes the sign-in form.
 */
function init() {
  const signinForm = document.getElementById("signinForm");
  if (signinForm) {
    setupFormSubmission(signinForm);
  }
}

/**
 * Sets up the form submission event listener.
 * @param {HTMLFormElement} form - The form element to attach the event listener to.
 */
function setupFormSubmission(form) {
  form.addEventListener("submit", login);
}

/**
 * Handles the checkbox click event for remembering user credentials.
 */
function checkBoxClicked() {
  const checkbox = document.getElementById("checkbox");
  const rememberMe = localStorage.getItem("rememberMe");
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  if (rememberMe === "true") {
    checkbox.src = "./assets/img/checkbox.png";
    localStorage.setItem("rememberMe", "false");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
  } else {
    checkbox.src = "./assets/img/checkbox-checked.png";
    localStorage.setItem("rememberMe", "true");
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
  }
}

document.getElementById("checkbox").addEventListener("click", checkBoxClicked);

/**
 * Stores the user's credentials in local storage.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
function storeCredentials(email, password) {
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);
}

/**
 * Handles successful authentication.
 *
 * @param {string} userName - The authenticated user's name.
 */
function handleSuccess(userName) {
  sessionStorage.setItem("userName", userName);
  // localStorage.removeItem("greetingShown");
  goToSummary();
}

async function validateInputs() {
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");

  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  let isValid = true;

  if (!validateEmailProvided(email, emailValue)) {
    isValid = false;
  }

  if (!validatePasswordProvided(password, passwordValue, emailValue)) {
    isValid = false;
  }

  if (isValid && emailValue !== "" && isValidEmail(emailValue)) {
    if (
      !(await validateUserCredentials(
        email,
        password,
        emailValue,
        passwordValue
      ))
    ) {
      isValid = false;
    }
  }

  return isValid;
}

function validateEmailProvided(emailElement, emailValue) {
  if (emailValue === "") {
    setError(emailElement, "Email is required.");
    return false;
  } else if (!isValidEmail(emailValue)) {
    setError(emailElement, "Please provide a valid email address.");
    return false;
  } else {
    setSuccess(emailElement);
    return true;
  }
}

function validatePasswordProvided(passwordElement, passwordValue, emailValue) {
  if (passwordValue === "") {
    if (emailValue !== "") {
      setError(passwordElement, "Provide the password.");
    } else {
      setError(passwordElement, "Password is required.");
    }
    return false;
  } else {
    setSuccess(passwordElement);
    return true;
  }
}

async function validateUserCredentials(
  emailElement,
  passwordElement,
  emailValue,
  passwordValue
) {
  const result = await validateUser(emailValue, passwordValue);
  if (!result.exists) {
    setError(emailElement, "User does not exist.");
    return false;
  } else if (!result.isAuthenticated) {
    setError(passwordElement, "Password is wrong.");
    return false;
  }
  return true;
}

function setError(element, message) {
  const loginContainer = element.parentElement;
  const errorDisplay = loginContainer.querySelector(".error-position");

  errorDisplay.innerText = message;
  loginContainer.classList.add("error");
  loginContainer.classList.remove("success");
}

function setSuccess(element) {
  const loginContainer = element.parentElement;
  const errorDisplay = loginContainer.querySelector(".error-position");

  errorDisplay.innerText = "";
  loginContainer.classList.remove("error");
  loginContainer.classList.add("success");
}

function isValidEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Handles the login form submission.
 *
 * @param {Event} event - The form submission event.
 */
function login(event) {
  event.preventDefault();

  validateInputs().then((isValid) => {
    if (isValid) {
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (localStorage.getItem("rememberMe") === "true") {
        storeCredentials(email, password);
      }

      validateUser(email, password)
        .then((result) => {
          if (result.isAuthenticated) {
            handleSuccess(result.name);
          } else {
            showError("Incorrect email or password.");
          }
        })
        .catch(() =>
          showError(
            "Error while trying to authenticate. Please try again later."
          )
        );
    }
  });
}

function showError(message) {
  const errorContainer = document.querySelector(".error-position");
  errorContainer.innerText = message;
  document.getElementById("passwordContainer").classList.add("login-red");
}

/**
 * Validates the user credentials against the Firebase database.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} A promise that resolves to an object indicating if the user is authenticated and their name.
 */
async function validateUser(email, password) {
  const usersRef = ref(database, "users");
  return get(usersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        for (let key in users) {
          if (users[key].email === email) {
            if (users[key].password === password) {
              return {
                exists: true,
                isAuthenticated: true,
                name: users[key].name,
              };
            } else {
              return { exists: true, isAuthenticated: false };
            }
          }
        }
      }
      return { exists: false, isAuthenticated: false };
    })
    .catch(() => {
      return { exists: false, isAuthenticated: false };
    });
}

/**
 * onclick function signupButton.
 */
document.getElementById("signupButton").addEventListener("click", goTosignup);

/**
 * Redirects the user to the signup page.
 */
function goTosignup() {
  window.location.href = "signup.html";
}

document
  .getElementById("guestLoginButton")
  .addEventListener("click", guestLogin);

/**
 * Handles the guest login event.
 * @param {Event} event - The form submit event.
 */
function guestLogin(event) {
  event.preventDefault();
  // localStorage.removeItem("greetingShown");
  goToSummary();
  sessionStorage.setItem("userName", "Guest");
}

function goToSummary() {
  window.location.href = "summary.html";
}
