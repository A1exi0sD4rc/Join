/**
 * Renders the subtasks in the edit view by generating HTML for each subtask
 * and displaying it within the 'created_subtasks_edit' container.
 * Calls a function to add event listeners to enable subtask editing functionality.
 *
 * @param {Object} subtasks - The object containing subtasks to be rendered, where each key is a subtask ID
 * and each value is a subtask object with properties such as `title` and `completed` status.
 */
function renderSubtasksEdit(subtasks) {
  const subtaskContainer = document.getElementById("created_subtasks_edit");
  subtaskContainer.innerHTML = "";

  Object.entries(subtasks).forEach(([subtaskId, subtask]) => {
    const subtaskHTML = createSubtaskHTMLEdit(subtask.title, subtaskId);
    subtaskContainer.innerHTML += subtaskHTML;
  });

  addSubtaskListeners();
}

function divFocus() {
  document.getElementById("aT_add_subtasks_edit").focus();
}

function divBlur() {
  document.getElementById("aT_add_subtasks_edit").blur();
}

/**
 * Deletes a subtask from the list when the delete button is clicked.
 * @param {HTMLImageElement} deleteButton - The button that triggers the deletion.
 */
async function deleteSubtaskEdit(deleteButton) {
  const taskItem = deleteButton.closest(".task-item");
  const subtaskId = getSubtaskId(taskItem);
  if (!currentTaskId) return;

  const deletionSuccessful = await deleteSubtaskFromDatabase(
    currentTaskId,
    subtaskId
  );

  if (deletionSuccessful) {
    taskItem.remove();
    delete originalSubtasks[subtaskId];
    delete newSubtasks[subtaskId];
  } else {
    console.error(`Failed to delete subtask ${subtaskId} from the database.`);
  }
}

/**
 * Reassigns IDs for all subtasks in sequential order for a specific task.
 * Fetches all subtasks, renames them, and saves the reordered subtasks to the database.
 *
 * @async
 * @param {string} taskId - The unique identifier of the task containing the subtasks to reorder.
 * @returns {Promise<void>} - A promise that resolves when the subtasks are successfully reassigned and saved.
 */
async function reassignSubtaskIds(taskId) {
  const subtasks = await fetchSubtasksFromDatabase(taskId);
  if (!subtasks) return;

  const updatedSubtasks = {};
  let index = 1;

  for (const [oldSubtaskId, subtask] of Object.entries(subtasks)) {
    const newSubtaskId = `subtask${index}`;
    updatedSubtasks[newSubtaskId] = subtask;
    index++;
  }

  await saveReorderedSubtasksToDatabase(taskId, updatedSubtasks);
  renderSubtasksEdit(updatedSubtasks);
}

/**
 * Retrieves the input element from the task item.
 * @param {HTMLElement} taskItem - The task item element.
 * @returns {HTMLInputElement|null} - The input element or null if not found.
 */
function getTaskInputElement(taskItem) {
  return taskItem.querySelector("input");
}

/**
 * Gets the subtask ID from the task item.
 * @param {HTMLElement} taskItem - The task item element.
 * @returns {string} - The subtask ID.
 */
function getSubtaskId(taskItem) {
  return taskItem.getAttribute("data-id");
}

/**
 * Updates the subtask title in the data structure.
 * @param {string} subtaskId - The ID of the subtask.
 * @param {string} newTitle - The new title of the subtask.
 */
function updateSubtaskTitle(subtaskId, newTitle) {
  const subtaskIndex = subtasks.findIndex(
    (subtask) => subtask.id === subtaskId
  );
  if (subtaskIndex !== -1) {
    subtasks[subtaskIndex].title = newTitle;
  }
}

/**
 * Updates the DOM for the edited task item.
 * @param {HTMLElement} taskItem - The task item element.
 * @param {string} newTitle - The new title of the subtask.
 */
function updateDOM(taskItem, newTitle) {
  const taskTextElement = createTaskTextElement(newTitle);
  taskItem.querySelector(".task-text").innerText = newTitle;
}

/**
 * Adds a new subtask to the edit list if the input is valid.
 */
function addSubtaskToListEdit() {
  const subtaskTitle = getSubtaskInputValue();
  if (subtaskTitle) {
    const nextSubtaskId = generateNextSubtaskId();
    const newSubtask = createNewSubtask(subtaskTitle, nextSubtaskId);
    addSubtaskToDOM(newSubtask, nextSubtaskId);
    resetSubtaskInput();
    resetDivVisibilityEdit();
  }
}

/**
 * Retrieves and trims the value from the subtask input field.
 * @returns {string} The trimmed subtask title if valid, otherwise an empty string.
 */
function getSubtaskInputValue() {
  const subtaskInput = document.getElementById("aT_add_subtasks_edit");
  return subtaskInput.value.trim();
}

/**
 * Generates the next unique subtask ID based on existing subtasks.
 * @returns {string} The next subtask ID in the format 'subtaskX'.
 */
function generateNextSubtaskId() {
  const maxSubtaskIndex = Math.max(
    ...Object.keys({ ...originalSubtasks, ...newSubtasks }).map((key) => {
      const match = key.match(/subtask(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
  );
  return `subtask${maxSubtaskIndex + 1}`;
}

/**
 * Creates a new subtask object and adds it to the newSubtasks object.
 * @param {string} title - The title of the new subtask.
 * @param {string} subtaskId - The unique ID of the new subtask.
 * @returns {Object} The new subtask object.
 */
function createNewSubtask(title, subtaskId) {
  const newSubtask = {
    title: title,
    completed: false,
  };
  newSubtasks[subtaskId] = newSubtask;
  return newSubtask;
}

/**
 * Adds the subtask's HTML to the DOM in the subtask container.
 * @param {Object} subtask - The new subtask object.
 * @param {string} subtaskId - The ID of the new subtask.
 */
function addSubtaskToDOM(subtask, subtaskId) {
  const subtaskContainer = document.getElementById("created_subtasks_edit");
  const subtaskHTML = createSubtaskHTMLEdit(subtask.title, subtaskId);
  subtaskContainer.innerHTML += subtaskHTML;
}

/**
 * Resets the subtask input field after adding a subtask.
 */
function resetSubtaskInput() {
  document.getElementById("aT_add_subtasks_edit").value = "";
}

/**
 * Hides the subtask input field and shows the buttons for canceling and saving.
 */
function toggleDivVisibilityEdit() {
  document
    .getElementById("aktive_input_addSubtask_edit")
    .classList.add("d-none");
  document
    .getElementById("close_and_check_btns_edit")
    .classList.remove("d-none");
}

/**
 * Resets the visibility of the subtask input field and hides the buttons for canceling and saving.
 */
function resetDivVisibilityEdit() {
  document
    .getElementById("aktive_input_addSubtask_edit")
    .classList.remove("d-none");
  document.getElementById("close_and_check_btns_edit").classList.add("d-none");
}

/**
 * Creates HTML for a new subtask item.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The unique ID of the subtask.
 * @returns {string} - The HTML string for the subtask.
 */
function createSubtaskHTMLEdit(title, id) {
  return /*html*/ `
    <ul class="task-item" data-id="${id}">
      <li class="task-text" onclick="editSubtaskEdit(this)">${title}</li>
      <div class="task-controls">
        <img src="./assets/img/subTask_edit.svg" alt="Edit" class="task-btn edit-btn" onclick="editSubtaskEdit(this)">
        <div class="separator_subtasks"></div>
        <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn delete-btn" onclick="deleteSubtaskEdit(this)">
      </div>
    </ul>`;
}

/**
 * Updates the task item to show the editing input field.
 * @param {HTMLElement} taskItem - The subtask item element.
 * @param {string} currentText - The current text of the subtask.
 */
function updateTaskItemForEditingEdit(taskItem, currentText) {
  taskItem.innerHTML = /*html*/ `
    <input type="text" maxlength="100" value="${currentText}" class="edit-input">
    <div class="task-controls">
      <div class="edit-modus-btns" onclick="deleteSubtaskEdit(this)">
        <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn-input delete-btn-input">
      </div>
      <div class="separator_subtasks"></div>
      <div class="edit-modus-btns"  onclick="saveSubtaskEdit(this)">
        <img src="./assets/img/edit_subtask_check.svg" alt="Save" class="task-btn-input save-btn-input">
      </div>
    </div>`;
}

/**
 * Enables editing of a subtask in the edit view by allowing the user to update the title.
 *
 * @param {HTMLElement} editButton - The edit button element clicked to initiate editing for a subtask.
 */
function editSubtaskEdit(editButton) {
  const taskItem = editButton.closest(".task-item");
  const taskTextElement = getTaskTextElement(taskItem);
  const currentText = taskTextElement.textContent;
  updateTaskItemForEditingEdit(taskItem, currentText);
  focusAndSetCursorAtEnd(taskItem);
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
 * Adds event listeners for editing, deleting, and toggling completion status of subtasks.
 * Handles edit, delete, and checkbox click events for managing subtasks.
 */
function addSubtaskListeners() {
  addEditSubtaskListeners();
  addToggleSubtaskListeners();
  addDeleteSubtaskListeners();
}

/**
 * Adds event listeners to all "Edit" buttons for subtasks.
 */
function addEditSubtaskListeners() {
  document.querySelectorAll(".edit-subtask-btn").forEach((button) => {
    button.addEventListener("click", handleEditSubtask);
  });
}

/**
 * Handles the editing of a subtask's title.
 * @this {HTMLElement} The "Edit" button clicked.
 */
function handleEditSubtask() {
  const subtaskId = this.getAttribute("data-id");
  const subtaskTitleElement = document
    .getElementById(subtaskId)
    .querySelector(".task-text");
  const newTitle = prompt("Enter new title:", subtaskTitleElement.textContent);

  if (newTitle) {
    updateSubtaskTitle(subtaskId, newTitle);
    subtaskTitleElement.textContent = newTitle;
  }
}

/**
 * Adds event listeners to all subtask checkboxes to toggle completion state.
 */
function addToggleSubtaskListeners() {
  document.querySelectorAll(".subtask-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("click", handleToggleSubtask);
  });
}

/**
 * Toggles the completion state of a subtask.
 * @param {Event} event - The click event from the checkbox.
 */
function handleToggleSubtask(event) {
  const taskId = event.target.dataset.taskId;
  const subtaskId = event.target.dataset.subtaskId;
  toggleSubtask(taskId, subtaskId);
}

/**
 * Adds event listeners to all "Delete" buttons for subtasks.
 */
function addDeleteSubtaskListeners() {
  document.querySelectorAll(".delete-subtask-btn").forEach((button) => {
    button.addEventListener("click", handleDeleteSubtask);
  });
}

/**
 * Handles the deletion of a subtask.
 * @this {HTMLElement} The "Delete" button clicked.
 */
function handleDeleteSubtask() {
  const subtaskId = this.getAttribute("data-id");
  deleteSubtaskEdit(subtaskId);
  document.getElementById(subtaskId).remove();
}
