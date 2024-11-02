const contactName = document.getElementById("contacts-user-name");
const contactEmail = document.getElementById("contacts-user-email");
const contactNumber = document.getElementById("contacts-user-number");

/**
 * Sets up the form submission event listener for the contact form.
 * @param {HTMLFormElement} form - The contact form element.
 */
function setupContactFormSubmission(form) {
  form.addEventListener("submit", handleContactFormSubmit);
}

/**
 * Sets up the form submission event listener for the contact form.
 * @param {HTMLFormElement} form - The contact form element.
 */
function setupContactFormSubmissionEdit(form, index) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validateContactInputs()) {
      editSaveInit(index);
    }
  });
}

/**
 * Handles the contact form submission event.
 * @param {Event} event - The form submission event.
 */
function handleContactFormSubmit(event) {
  event.preventDefault();

  if (validateContactInputs()) {
    addContact(event);
  }
}

/**
 * Sets an error message on a form element.
 * @param {HTMLElement} element - The input element.
 * @param {string} message - The error message.
 */
function setContactError(element, message) {
  const errorDisplay = element.parentElement.querySelector(
    ".contacts-input-error"
  );
  errorDisplay.innerText = message;
  element.classList.add("error");
}

/**
 * Sets a success message on a form element.
 * @param {HTMLElement} element - The input element.
 */
function setContactSuccess(element) {
  const errorDisplay = element.parentElement.querySelector(
    ".contacts-input-error"
  );
  errorDisplay.innerText = "";
  element.classList.remove("error");
  element.classList.add("success");
}

/**
 * Validates the contact inputs.
 * @returns {boolean} True if all inputs are valid, false otherwise.
 */
function validateContactInputs() {
  let isValid = true;
  if (!validateContactName()) isValid = false;
  if (!validateContactEmail()) isValid = false;
  if (!validateContactNumber()) isValid = false;
  return isValid;
}

/**
 * Validates the contact name field.
 * @returns {boolean} True if the name is valid, false otherwise.
 */
function validateContactName() {
  const contactName = document.getElementById("contacts-user-name");
  const nameValue = contactName.value.trim();

  if (nameValue === "") {
    setContactError(contactName, "Name is required.");
    return false;
  } else if (!validateFullName(nameValue)) {
    setContactError(contactName, "First and last name are required.");
    return false;
  } else {
    setContactSuccess(contactName);
    return true;
  }
}

/**
 * Validates the contact email field.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateContactEmail() {
  const contactEmail = document.getElementById("contacts-user-email");
  const emailValue = contactEmail.value.trim();

  if (emailValue === "") {
    setContactError(contactEmail, "Email is required.");
    return false;
  } else if (!isValidEmail(emailValue)) {
    setContactError(contactEmail, "Provide a valid email address.");
    return false;
  } else {
    setContactSuccess(contactEmail);
    return true;
  }
}

/**
 * Validates the contact number field.
 * @returns {boolean} True if the number is valid, false otherwise.
 */
function validateContactNumber() {
  const contactNumber = document.getElementById("contacts-user-number");
  const numberValue = contactNumber.value.trim();

  if (numberValue === "") {
    setContactError(contactNumber, "Phone number is required.");
    return false;
  } else if (!isValidPhoneNumber(numberValue)) {
    setContactError(contactNumber, "Provide a valid phone number.");
    return false;
  } else {
    setContactSuccess(contactNumber);
    return true;
  }
}

/**
 * Validates that the name includes at least a first and last name.
 * @param {string} name - The name to validate.
 * @returns {boolean} True if the name is valid, false otherwise.
 */
function validateFullName(name) {
  const nameParts = name.split(" ");
  return nameParts.length >= 2 && nameParts[0] && nameParts[1];
}

/**
 * Validates if a string is a valid email.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validates if a string is a valid phone number.
 * @param {string} number - The phone number to validate.
 * @returns {boolean} True if the number is valid, false otherwise.
 */
function isValidPhoneNumber(number) {
  const re = /^\+?[0-9\s]{10,15}$/;
  return re.test(String(number).trim());
}
