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
