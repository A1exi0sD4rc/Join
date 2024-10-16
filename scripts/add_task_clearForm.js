/**
 * Clears all input fields and resets the form state.
 */
function clearAll() {
  clearTitle();
  clearDescription();
  clearSelectedContacts();
  clearDate();
  clearPrio();
  clearSubtasks();
  clearCategory();
  resetValidationErrors();
}

/**
 * Clears the title input field.
 */
function clearTitle() {
  const inputField = document.getElementById("aT_title");
  if (inputField) {
    inputField.value = "";
  }
}

/**
 * Clears the description textarea.
 */
function clearDescription() {
  const textarea = document.getElementById("aT_description");
  if (textarea) {
    textarea.value = "";
  }
}

/**
 * Clears the selected contacts and updates the UI.
 */
function clearSelectedContacts() {
  selectedContacts = [];
  sessionStorage.removeItem("selectedContacts");
  renderContacts();
  displaySelectedContacts();
}

/**
 * Clears the date input field and resets its color.
 */
function clearDate() {
  const dateField = document.getElementById("aT_date");
  if (dateField) {
    dateField.value = "";
    dateField.style.color = "#d1d1d1";
  }
}

/**
 * Resets the priority selection to default state.
 */
function clearPrio() {
  deactivateAll();
  const boxMedium = document.getElementById("boxMedium");
  boxMedium.classList.remove("aT_set_prio");
  boxMedium.classList.add("medium_box_active");
}

/**
 * Clears all subtasks from the list and resets the input field.
 */
function clearSubtasks() {
  const subtaskList = document.getElementById("created_subtasks");
  subtaskList.innerHTML = "";
  const inputField = document.getElementById("aT_add_subtasks");
  inputField.value = "";
  resetDivVisibility();
}

/**
 * Clears the selected category and resets the category dropdown.
 */
function clearCategory() {
  const arrowCatConImage = document
    .getElementById("select_category_arrow_container")
    .querySelector("img");
  inputFieldCategeory.textContent = originalText;
  arrowCatConImage.classList.remove("rotate");
  dropDownCategories.classList.add("d-none");
}
