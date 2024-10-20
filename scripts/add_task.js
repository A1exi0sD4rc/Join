/**
 * Initializes the Add Task page by including HTML and fetching contacts.
 * Also generates the initials for each contact.
 */
async function initAddTask() {
  includeHTML();
  await getContacts();
  awaitGenerateInitials();
}

/**
 * Trims the input field value and returns the trimmed subtask text.
 * @param {HTMLInputElement} inputField - The input field element.
 * @returns {string} - The trimmed subtask text.
 */
function getTrimmedSubtaskText(inputField) {
  return inputField.value.trim();
}

/**
 * Creates HTML for a new subtask item.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The unique ID of the subtask.
 * @returns {string} - The HTML string for the subtask.
 */
function createSubtaskHTML(subtaskText, subtaskId) {
  return /*html*/ `
    <ul class="task-item" data-id="${subtaskId}">
      <li class="task-text">${subtaskText}</li>
      <div class="task-controls">
        <img src="./assets/img/subTask_edit.svg" alt="Edit" class="task-btn edit-btn" onclick="editSubtask(this)">
        <div class="separator_subtasks"></div>
        <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn delete-btn" onclick="deleteSubtask(this)">
      </div>
    </ul>`;
}

/**
 * Appends a new subtask to the subtask list.
 * @param {string} newListHTML - The HTML string for the new subtask.
 */
function appendSubtaskToList(newListHTML) {
  document.getElementById("created_subtasks").innerHTML += newListHTML;
}

/**
 * Clears the value of the input field.
 * @param {HTMLInputElement} inputField - The input field element.
 */
function clearInputField(inputField) {
  inputField.value = "";
}

/**
 * Enables editing of the subtask by replacing the text with an input field.
 * @param {HTMLImageElement} editButton - The edit button clicked.
 */
function editSubtask(editButton) {
  const taskItem = editButton.closest(".task-item");
  const taskTextElement = getTaskTextElement(taskItem);
  const currentText = taskTextElement.textContent;
  updateTaskItemForEditing(taskItem, currentText);
  focusAndSetCursorAtEnd(taskItem);
}

/**
 * Retrieves the task text element from a task item.
 * @param {HTMLElement} taskItem - The subtask item element.
 * @returns {HTMLElement} - The task text element.
 */
function getTaskTextElement(taskItem) {
  return taskItem.querySelector(".task-text");
}

/**
 * Updates the task item to show the editing input field.
 * @param {HTMLElement} taskItem - The subtask item element.
 * @param {string} currentText - The current text of the subtask.
 */
function updateTaskItemForEditing(taskItem, currentText) {
  taskItem.innerHTML = /*html*/ `
    <input type="text" maxlength="100" value="${currentText}" class="edit-input">
    <div class="task-controls">
      <div class="edit-modus-btns" onclick="deleteSubtask(this)">
        <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn-input delete-btn-input">
      </div>
      <div class="separator_subtasks"></div>
      <div class="edit-modus-btns"  onclick="saveTask(this)">
        <img src="./assets/img/edit_subtask_check.svg" alt="Save" class="task-btn-input save-btn-input">
      </div>
    </div>`;
}

document.addEventListener("click", handleDocumentClick);
const inputFieldContacts = document.getElementById("aT_select_contacts");
const categoryList = document.getElementById("category_list");
const arrowConContainer = document.getElementById(
  "select_contacts_arrow_container"
);
const arrowConConImage = arrowConContainer.querySelector("img");
const dropDowncontacts = document.getElementById("contact_list");
const selectedContactsCon = document.getElementById("selected_contacts");

/**
 * Sets focus on the input field and positions the cursor at the end of the text.
 * @param {HTMLElement} taskItem - The subtask item element being edited.
 */
function focusAndSetCursorAtEnd(taskItem) {
  const inputField = taskItem.querySelector(".edit-input");
  inputField.focus();
  const textLength = inputField.value.length;
  inputField.setSelectionRange(textLength, textLength);
}

/**
 * Saves the edited subtask title and updates the DOM.
 * @param {HTMLImageElement} saveButton - The save button clicked.
 */
function saveTask(saveButton) {
  const taskItem = saveButton.closest(".task-item");
  const inputElement = getInputElement(taskItem);
  if (!inputElement) {
    console.error("Input element not found");
    return;
  }

  const subtaskId = taskItem.getAttribute("data-id");
  const newTitle = inputElement.value.trim();

  const subtaskIndex = subtasks.findIndex(
    (subtask) => subtask.id === subtaskId
  );
  if (subtaskIndex !== -1) {
    subtasks[subtaskIndex].title = newTitle;
  }

  const taskTextElement = createTaskTextElement(newTitle);
  const taskControls = taskItem.querySelector(".task-controls");
  updateTaskItem(taskItem, taskTextElement, taskControls);
  updateTaskControls(taskControls);
}

/**
 * Retrieves the input element from a task item being edited.
 * @param {HTMLElement} taskItem - The subtask item element.
 * @returns {HTMLInputElement} - The input element.
 */
function getInputElement(taskItem) {
  return taskItem.querySelector(".edit-input");
}

/**
 * Creates an HTML element for the updated subtask text.
 * @param {string} newTitle - The new title of the subtask.
 * @returns {HTMLLIElement} - The task text element.
 */
function createTaskTextElement(newTitle) {
  const taskTextElement = document.createElement("li");
  taskTextElement.className = "task-text";
  taskTextElement.textContent = newTitle;
  return taskTextElement;
}

/**
 * Updates the task item in the DOM after editing.
 * @param {HTMLElement} taskItem - The subtask item element.
 * @param {HTMLElement} taskTextElement - The new task text element.
 * @param {HTMLElement} taskControls - The task controls element.
 */
function updateTaskItem(taskItem, taskTextElement, taskControls) {
  taskItem.innerHTML = "";
  taskItem.appendChild(taskTextElement);
  taskItem.appendChild(taskControls);
}

/**
 * Updates the task controls in the DOM after editing.
 * @param {HTMLElement} taskControls - The task controls element.
 */
function updateTaskControls(taskControls) {
  taskControls.innerHTML = /*html*/ `
    <img src="./assets/img/subTask_edit.svg" alt="Edit" class="task-btn edit-btn" onclick="editSubtask(this)">
    <div class="separator_subtasks"></div>
    <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn delete-btn" onclick="deleteSubtask(this)">
  `;
}

/**
 * Deletes a subtask from the list when the delete button is clicked.
 * @param {HTMLImageElement} deleteButton - The button that triggers the deletion.
 */
function deleteSubtask(deleteButton) {
  const taskItem = deleteButton.closest(".task-item");
  if (taskItem) {
    const subtaskId = taskItem.getAttribute("data-id");
    removeSubtaskFromArray(subtaskId);
    taskItem.remove();
  }
}

/**
 * Removes a subtask from the subtasks array by its ID.
 * @param {string} subtaskId - The ID of the subtask to be removed.
 */
function removeSubtaskFromArray(subtaskId) {
  subtasks = subtasks.filter((subtask) => subtask.id !== subtaskId);
}

/**
 * Generates a unique ID for a new subtask based on the current timestamp.
 * @returns {string} - The generated subtask ID.
 */
function generateSubtaskId() {
  return `subtask_${new Date().getTime()}`;
}

/**
 * Handles input events for the date input field and changes its text color if filled.
 */
const input = document.querySelector(".aT_input_date");
input.addEventListener("input", function () {
  if (this.value) {
    this.style.color = "#000000";
  }
});

/**
 * Event listeners for handling UI interactions related to subtasks
 */
document
  .getElementById("aT_add_subtasks")
  .addEventListener("click", toggleDivVisibility);
document
  .getElementById("aktive_input_addSubtask")
  .addEventListener("click", function () {
    document.getElementById("aT_add_subtasks").focus();
    toggleDivVisibility();
  });
document
  .getElementById("cancel_input_subtasks")
  .addEventListener("click", function () {
    document.getElementById("aT_add_subtasks").blur();
    resetDivVisibility();
  });
document
  .getElementById("check_input_subtask")
  .addEventListener("click", addSubtaskToList);
document
  .getElementById("aT_add_subtasks")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtaskToList();
    }
  });

let subtasks = [];
/**
 * Adds a subtask to the list if the input is valid.
 */
function addSubtaskToList() {
  const inputField = document.getElementById("aT_add_subtasks");
  const subtaskText = getTrimmedSubtaskText(inputField);
  if (subtaskText !== "") {
    const subtaskId = generateSubtaskId();
    const newListHTML = createSubtaskHTML(subtaskText, subtaskId);
    appendSubtaskToList(newListHTML);
    addSubtaskToArray(subtaskText, subtaskId);
    clearInputField(inputField);
    resetDivVisibility();
    scrollToListEnd();
  }
}

/**
 * Clears the input field for subtasks.
 */
function cancel_input_subtask() {
  document.getElementById("aT_add_subtasks").value = "";
}

/**
 * Hides the subtask input field and shows the buttons for canceling and saving.
 */
function toggleDivVisibility() {
  document.getElementById("aktive_input_addSubtask").classList.add("d-none");
  document.getElementById("close_and_check_btns").classList.remove("d-none");
}

/**
 * Resets the visibility of the subtask input field and hides the buttons for canceling and saving.
 */
function resetDivVisibility() {
  document.getElementById("aktive_input_addSubtask").classList.remove("d-none");
  document.getElementById("close_and_check_btns").classList.add("d-none");
}

/**
 * Scrolls the subtask container to the bottom of the list.
 */
function scrollToListEnd() {
  const subtaskContainer = document.getElementById("created_subtasks");
  subtaskContainer.scrollTop = subtaskContainer.scrollHeight;
}

/**
 * Adds a subtask to the array of subtasks.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The unique ID of the subtask.
 */
function addSubtaskToArray(subtaskText, subtaskId) {
  const subtask = {
    id: subtaskId,
    title: subtaskText,
    completed: false,
  };
  subtasks.push(subtask);
}

/**
 * Handles click events on the document to determine if certain UI elements (e.g. contacts or categories) should be closed or deactivated.
 * @param {MouseEvent} event - The click event.
 */
function handleDocumentClick(event) {
  const isInsideInputFieldContacts = inputFieldContacts.contains(event.target);
  const isInsideArrowConContainer = arrowConContainer.contains(event.target);
  const isInsideCategoryList = categoryList.contains(event.target);
  if (inputFieldContacts.classList.contains("active-border")) {
    if (!isInsideInputFieldContacts && !isInsideArrowConContainer) {
      handleContactsClick(event);
    }
  } else if (!categoryList.classList.contains("d-none")) {
    if (!isInsideCategoryList) {
      handleCategoryClick(event);
    }
  }
}

/**
 * Toggles the visibility of the contacts dropdown based on the current state.
 * @param {MouseEvent} event - The click event.
 */
function toggleDropdown(event) {
  event.stopPropagation();

  if (inputFieldContacts.classList.contains("active-border")) {
    deactivateFieldContacts();
  } else {
    activateFieldContacts();
  }
}

/**
 * Activates the contacts input field by showing the dropdown, focusing the input, and rotating the arrow icon.
 */
function activateFieldContacts() {
  inputFieldContacts.classList.add("active-border");
  arrowConConImage.classList.add("rotate");
  dropDowncontacts.classList.remove("d-none");
  selectedContactsCon.classList.add("d-none");
  renderContacts();
  inputFieldContacts.focus();
}

/**
 * Filters the contacts list based on the search term entered in the input field.
 * @param {string} searchTerm - The search term to filter contacts by.
 */
function filterContacts(searchTerm) {
  let filteredContacts = contactsAddTask.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  renderFilteredContacts(filteredContacts);
}

/**
 * Deactivates the contacts input field by hiding the dropdown and resetting the input.
 */
function deactivateFieldContacts() {
  inputFieldContacts.classList.remove("active-border");
  arrowConConImage.classList.remove("rotate");
  dropDowncontacts.classList.add("d-none");
  selectedContactsCon.classList.remove("d-none");
  inputFieldContacts.value = "";
  renderContacts();
  inputFieldContacts.blur();
}

/**
 * Deactivates the contacts field if a click occurs outside of the contacts input field and dropdown list.
 * @param {MouseEvent} event - The click event.
 */
function handleContactsClick(event) {
  if (
    !inputFieldContacts.contains(event.target) &&
    !arrowConContainer.contains(event.target) &&
    !dropDowncontacts.contains(event.target)
  ) {
    deactivateFieldContacts();
  }
}

/**
 * Deactivates the category field if a click occurs outside of the category input field and dropdown list.
 * @param {MouseEvent} event - The click event.
 */
function handleCategoryClick(event) {
  if (
    !inputFieldCategeory.contains(event.target) &&
    !arrowCatContainer.contains(event.target) &&
    !dropDownCategories.contains(event.target)
  ) {
    deactivateFieldCategory();
  }
}

arrowConContainer.addEventListener("click", toggleDropdown);
inputFieldContacts.addEventListener("click", toggleDropdown);

inputFieldContacts.addEventListener("input", function () {
  let searchQuery = inputFieldContacts.value.toLowerCase();
  filterContacts(searchQuery);
});

const inputFieldCategeory = document.getElementById("aT_select_category");
const arrowCatContainer = document.getElementById(
  "select_category_arrow_container"
);
const arrowImage = arrowCatContainer.querySelector("img");
const dropDownCategories = document.getElementById("category_list");
const categoryOptions = document.querySelectorAll(".categories");
const originalText = "Select task category";

function handleClickOutside(event) {
  if (
    !inputFieldCategeory.contains(event.target) &&
    !arrowCatContainer.contains(event.target) &&
    !dropDownCategories.contains(event.target)
  ) {
    deactivateFieldCategory();
  }
}

inputFieldCategeory.addEventListener("click", toggleField);
arrowCatContainer.addEventListener("click", toggleField);
document.addEventListener("click", handleClickOutside);
categoryOptions.forEach(function (option) {
  option.addEventListener("click", selectCategory);
});
