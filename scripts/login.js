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
  localStorage.removeItem("greetingShown");
  goToSummary();
}

/**
 * Validates the email and password input fields asynchronously.
 *
 * This function retrieves the values from the email and password fields, validates them using
 * helper functions, and checks user credentials. Returns true if all validations pass, false otherwise.
 *
 * @async
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if inputs are valid, false otherwise.
 */
async function validateInputs() {
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");

  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  let isValid = true;

  isValid = validateEmail(email, emailValue) && isValid;
  isValid = validatePassword(password, passwordValue, emailValue) && isValid;

  isValid = await validateEmailAndCredentials(
    email,
    password,
    emailValue,
    passwordValue,
    isValid
  );

  return isValid;
}

/**
 * Validates the email and user credentials.
 *
 * This function checks if the email is valid and, if so, checks the user credentials against
 * a database or authentication service.
 *
 * @async
 * @param {HTMLElement} email - The email input element.
 * @param {HTMLElement} password - The password input element.
 * @param {string} emailValue - The trimmed email value.
 * @param {string} passwordValue - The trimmed password value.
 * @param {boolean} isValid - Indicates if the previous validations passed.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if credentials are valid, false otherwise.
 */
async function validateEmailAndCredentials(
  email,
  password,
  emailValue,
  passwordValue,
  isValid
) {
  if (isValid && emailValue !== "" && isValidEmail(emailValue)) {
    return (
      (await checkUserCredentials(
        email,
        password,
        emailValue,
        passwordValue
      )) && isValid
    );
  }
  return isValid;
}

/**
 * Validates the email input.
 *
 * This function checks if the email is provided and if it has a valid format.
 *
 * @param {HTMLElement} emailElement - The email input element.
 * @param {string} emailValue - The trimmed email value.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
function validateEmail(emailElement, emailValue) {
  return (
    validateEmailProvided(emailElement, emailValue) &&
    validateEmailFormat(emailElement, emailValue)
  );
}

/**
 * Validates if the email field is provided.
 *
 * Checks if the email value is empty and sets an error message if it is.
 *
 * @param {HTMLElement} emailElement - The email input element.
 * @param {string} emailValue - The trimmed email value.
 * @returns {boolean} - Returns true if the email is provided, false otherwise.
 */
function validateEmailProvided(emailElement, emailValue) {
  if (emailValue === "") {
    setError(emailElement, "Email is required.");
    return false;
  }
  return true;
}

/**
 * Validates the format of the email address.
 *
 * Checks if the email format is valid and sets success or error messages accordingly.
 *
 * @param {HTMLElement} emailElement - The email input element.
 * @param {string} emailValue - The trimmed email value.
 * @returns {boolean} - Returns true if the email format is valid, false otherwise.
 */
function validateEmailFormat(emailElement, emailValue) {
  if (!isValidEmail(emailValue)) {
    setError(emailElement, "Please provide a valid email address.");
    return false;
  }
  setSuccess(emailElement);
  return true;
}

/**
 * Validates the password input.
 *
 * Checks if the password is provided and calls the corresponding validation function.
 *
 * @param {HTMLElement} passwordElement - The password input element.
 * @param {string} passwordValue - The trimmed password value.
 * @param {string} emailValue - The trimmed email value.
 * @returns {boolean} - Returns true if the password is valid, false otherwise.
 */
function validatePassword(passwordElement, passwordValue, emailValue) {
  return validatePasswordProvided(passwordElement, passwordValue, emailValue);
}

/**
 * Validates if the password field is provided.
 *
 * Checks if the password value is empty and sets an error message if it is.
 *
 * @param {HTMLElement} passwordElement - The password input element.
 * @param {string} passwordValue - The trimmed password value.
 * @param {string} emailValue - The trimmed email value.
 * @returns {boolean} - Returns true if the password is provided, false otherwise.
 */
function validatePasswordProvided(passwordElement, passwordValue, emailValue) {
  if (passwordValue === "") {
    const errorMessage =
      emailValue !== "" ? "Provide the password." : "Password is required.";
    setError(passwordElement, errorMessage);
    return false;
  } else {
    setSuccess(passwordElement);
    return true;
  }
}

/**
 * Checks user credentials against a database or authentication service.
 *
 * @async
 * @param {HTMLElement} emailElement - The email input element.
 * @param {HTMLElement} passwordElement - The password input element.
 * @param {string} emailValue - The trimmed email value.
 * @param {string} passwordValue - The trimmed password value.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the credentials are valid, false otherwise.
 */
async function checkUserCredentials(
  emailElement,
  passwordElement,
  emailValue,
  passwordValue
) {
  return await validateUserCredentials(
    emailElement,
    passwordElement,
    emailValue,
    passwordValue
  );
}

/**
 * Validates user credentials with the provided email and password.
 *
 * @async
 * @param {HTMLElement} emailElement - The email input element.
 * @param {HTMLElement} passwordElement - The password input element.
 * @param {string} emailValue - The trimmed email value.
 * @param {string} passwordValue - The trimmed password value.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if validation passes, false otherwise.
 */
async function validateUserCredentials(
  emailElement,
  passwordElement,
  emailValue,
  passwordValue
) {
  const result = await validateUser(emailValue, passwordValue);
  return handleValidationResult(emailElement, passwordElement, result);
}

/**
 * Handles the validation result of user credentials.
 *
 * Sets error messages based on the result of user validation.
 *
 * @param {HTMLElement} emailElement - The email input element.
 * @param {HTMLElement} passwordElement - The password input element.
 * @param {Object} result - The result object from the user validation process.
 * @param {boolean} result.exists - Indicates if the user exists.
 * @param {boolean} result.isAuthenticated - Indicates if the password is correct.
 * @returns {boolean} - Returns true if validation is successful, false otherwise.
 */
function handleValidationResult(emailElement, passwordElement, result) {
  if (!result.exists) {
    setError(emailElement, "User does not exist.");
    return false;
  } else if (!result.isAuthenticated) {
    setError(passwordElement, "Password is wrong.");
    return false;
  }
  return true;
}

/**
 * Sets an error message for the specified element.
 *
 * Displays the error message and updates the styles of the parent container.
 *
 * @param {HTMLElement} element - The input element to set the error for.
 * @param {string} message - The error message to display.
 */
function setError(element, message) {
  const loginContainer = element.parentElement;
  const errorDisplay = loginContainer.querySelector(".error-position");

  errorDisplay.innerText = message;
  loginContainer.classList.add("error");
  loginContainer.classList.remove("success");
}

/**
 * Sets a success state for the specified element.
 *
 * Clears any error messages and updates the styles of the parent container.
 *
 * @param {HTMLElement} element - The input element to set the success for.
 */
function setSuccess(element) {
  const loginContainer = element.parentElement;
  const errorDisplay = loginContainer.querySelector(".error-position");

  errorDisplay.innerText = "";
  loginContainer.classList.remove("error");
  loginContainer.classList.add("success");
}

/**
 * Validates the format of the email address using a regular expression.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
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

  validateLogin().then((isValid) => {
    if (isValid) {
      const { email, password } = getLoginCredentials();
      handleRememberMe(email, password);
      authenticateUser(email, password);
    }
  });
}

async function validateLogin() {
  return await validateInputs();
}

/**
 * Retrieves the login credentials (email and password) from the input fields.
 * @returns {{ email: string, password: string }} An object containing the email and password.
 */
function getLoginCredentials() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  return { email, password };
}

/**
 * Handles storing the login credentials if the "Remember Me" option is enabled.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 */
function handleRememberMe(email, password) {
  if (localStorage.getItem("rememberMe") === "true") {
    storeCredentials(email, password);
  }
}

/**
 * Authenticates the user with the provided email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 */
function authenticateUser(email, password) {
  validateUser(email, password)
    .then((result) => handleAuthenticationResult(result))
    .catch(() =>
      showError("Error while trying to authenticate. Please try again later.")
    );
}

/**
 * Handles the result of the authentication attempt.
 * @param {{ isAuthenticated: boolean, name: string }} result - The result of the authentication attempt.
 */
function handleAuthenticationResult(result) {
  if (result.isAuthenticated) {
    handleSuccess(result.name);
  } else {
    showError("Incorrect email or password.");
  }
}

/**
 * Displays an error message in the designated error container.
 * @param {string} message - The error message to display.
 */
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
  return fetchUsers(usersRef)
    .then((users) => findUserByEmail(users, email, password))
    .catch(() => handleValidationError());
}

/**
 * Fetches users from the specified reference in the database.
 * @param {Object} usersRef - The reference to the users in the database.
 * @returns {Promise<Object|null>} A promise that resolves to the users object or null if none exist.
 */
function fetchUsers(usersRef) {
  return get(usersRef).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  });
}

/**
 * Finds a user by their email address in the provided users object.
 * @param {Object} users - The users object containing user data.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {{ exists: boolean, isAuthenticated: boolean }} An object indicating whether the user exists and if the password matches.
 */
function findUserByEmail(users, email, password) {
  if (!users) return { exists: false, isAuthenticated: false };

  for (let key in users) {
    if (users[key].email === email) {
      return validatePasswordMatch(users[key], password);
    }
  }

  return { exists: false, isAuthenticated: false };
}

/**
 * Validates whether the provided password matches the user's stored password.
 * @param {Object} user - The user object containing the stored password.
 * @param {string} password - The password to validate against the stored password.
 * @returns {{ exists: boolean, isAuthenticated: boolean, name?: string }} An object indicating whether the user exists and if the password matches.
 */
function validatePasswordMatch(user, password) {
  if (user.password === password) {
    return {
      exists: true,
      isAuthenticated: true,
      name: user.name,
    };
  } else {
    return { exists: true, isAuthenticated: false };
  }
}

/**
 * Handles a validation error by returning a standardized response indicating that no user exists.
 * @returns {{ exists: boolean, isAuthenticated: boolean }} An object indicating the user does not exist and is not authenticated.
 */
function handleValidationError() {
  return { exists: false, isAuthenticated: false };
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
  localStorage.removeItem("greetingShown");
  goToSummary();
  sessionStorage.setItem("userName", "Guest");
}

function goToSummary() {
  window.location.href = "summary.html";
}
