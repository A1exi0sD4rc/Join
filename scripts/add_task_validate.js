/**
 * Validates the title input field.
 * @returns {boolean} - Returns true if the title is valid, otherwise false.
 */
function validateTitle() {
  const titleInput = document.getElementById("aT_title");
  const titleError = document.getElementById("titleError");
  titleInput.addEventListener("input", () => {
    titleInput.classList.remove("invalid");
    titleError.classList.remove("error-show");
  });
  if (titleInput.value.trim() === "") {
    titleInput.classList.add("invalid");
    titleError.classList.add("error-show");
    return false;
  }
  return true;
}

/**
 * Validates the date input field.
 * @returns {boolean} - Returns true if the date is valid, otherwise false.
 */
function validateDate() {
  const dateInput = document.getElementById("aT_date");
  const dateError = document.getElementById("dateError");
  dateInput.addEventListener("input", () => {
    dateInput.classList.remove("invalid");
    dateError.classList.remove("error-show");
  });
  if (dateInput.value === "") {
    dateInput.classList.add("invalid");
    dateError.classList.add("error-show");
    return false;
  }
  return true;
}

/**
 * Validates the category selection.
 * @returns {boolean} - Returns true if a valid category is selected, otherwise false.
 */
function validateCategory() {
  const categoryDiv = document.getElementById("aT_select_category");
  const categoryError = document.getElementById("categoryError");
  if (categoryDiv.innerText.trim() === "Select task category") {
    categoryDiv.classList.add("invalid");
    categoryError.classList.add("error-show");
    return false;
  } else {
    categoryDiv.classList.remove("invalid");
    categoryError.classList.remove("error-show");
    return true;
  }
}

/**
 * Validates the entire form (title, date, and category).
 */
async function validateForm() {
  const submitButton = document.getElementById("createTaskBtn");
  if (isSubmitDisabled(submitButton)) {
    return;
  }
  disableSubmitButton(submitButton);
  const isTitleValid = validateTitle();
  const isDateValid = validateDate();
  const isCategoryValid = validateCategory();
  handleCategoryError(isCategoryValid);
  if (isTitleValid && isDateValid && isCategoryValid) {
    await showTaskAddedToBoardMessage();
  }
  enableSubmitButton(submitButton);
}

/**
 * Checks if the submit button is disabled.
 */
function isSubmitDisabled(button) {
  return button.style.pointerEvents === "none";
}

/**
 * Disables the submit button.
 */
function disableSubmitButton(button) {
  button.style.pointerEvents = "none";
}

/**
 * Enables the submit button.
 */
function enableSubmitButton(button) {
  button.style.pointerEvents = "auto";
}

/**
 * Handles the category error display.
 */
function handleCategoryError(isValid) {
  const categoryDiv = document.getElementById("aT_select_category");
  const categoryError = document.getElementById("categoryError");
  if (isValid) {
    categoryDiv.classList.remove("invalid");
    categoryError.classList.remove("error-show");
  }
}

/**
 * Resets all form validation errors (title, date, and category).
 */
function resetValidationErrors() {
  resetTitleValidation();
  resetDateValidation();
  resetCategoryValidation();
}

/**
 * Resets the validation state for the title field.
 */
function resetTitleValidation() {
  const titleInput = document.getElementById("aT_title");
  const titleError = document.getElementById("titleError");
  if (titleInput && titleError) {
    titleInput.classList.remove("invalid");
    titleError.classList.remove("error-show");
  }
}

/**
 * Resets the validation state for the date field.
 */
function resetDateValidation() {
  const dateInput = document.getElementById("aT_date");
  const dateError = document.getElementById("dateError");
  if (dateInput && dateError) {
    dateInput.classList.remove("invalid");
    dateError.classList.remove("error-show");
  }
}

/**
 * Resets the validation state for the category selection.
 */
function resetCategoryValidation() {
  const categoryDiv = document.getElementById("aT_select_category");
  const categoryError = document.getElementById("categoryError");
  if (categoryDiv && categoryError) {
    categoryDiv.classList.remove("invalid");
    categoryError.classList.remove("error-show");
  }
}

/**
 * Displays a message indicating that a task has been added to the board.
 * @returns {Promise<void>} A promise that resolves when the task message has been hidden.
 */
function showTaskAddedToBoardMessage() {
  return new Promise((resolve) => {
    const taskMessage = document.getElementById("taskMessage");
    taskMessage.classList.add("show");
    setTimeout(async () => {
      await addTaskToDatabase();
      setTimeout(() => {
        taskMessage.classList.remove("show");
        resolve();
      }, 500);
    }, 1000);
  });
}
