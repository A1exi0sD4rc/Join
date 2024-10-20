/**
 * Activates the category field by rotating the arrow and showing the dropdown.
 */
function activateCatField() {
  arrowImage.classList.add("rotate");
  dropDownCategories.classList.remove("d-none");
}

/**
 * Deactivates the category field by hiding the dropdown and resetting the arrow icon.
 */
function deactivateFieldCategory() {
  arrowImage.classList.remove("rotate");
  dropDownCategories.classList.add("d-none");
}

/**
 * Toggles the category field dropdown based on the current state.
 * @param {MouseEvent} event - The click event.
 */
function toggleField(event) {
  event.stopPropagation();
  if (inputFieldCategeory.textContent !== originalText) {
    inputFieldCategeory.textContent = originalText;
  }
  if (arrowImage.classList.contains("rotate")) {
    deactivateFieldCategory();
  } else {
    activateCatField();
  }
}

/**
 * Selects a category from the dropdown list and validates the selection.
 * @param {MouseEvent} event - The click event on the category element.
 */
function selectCategory(event) {
  const selectedCategory = event.target.textContent;
  inputFieldCategeory.textContent = selectedCategory;
  deactivateFieldCategory();
  validateCategory();
}

/**
 * Activates a specific box by adding an active class and removing the inactive class.
 * @param {string} boxId - The ID of the box to be activated.
 * @param {string} activeClass - The class to be added to activate the box.
 */
function activateBox(boxId, activeClass) {
  deactivateAll();
  const box = document.getElementById(boxId);
  box.classList.remove("aT_set_prio");
  box.classList.add(activeClass);
}

/**
 * Deactivates all priority boxes by removing their active classes.
 * Adds a default priority class to each box.
 */
function deactivateAll() {
  document.getElementById("boxUrgent").classList.remove("urgent_box_active");
  document.getElementById("boxUrgent").classList.add("aT_set_prio");
  document.getElementById("boxMedium").classList.remove("medium_box_active");
  document.getElementById("boxMedium").classList.add("aT_set_prio");
  document.getElementById("boxLow").classList.remove("low_box_active");
  document.getElementById("boxLow").classList.add("aT_set_prio");
}
