/**
 * Trims the subtask input field value and returns the trimmed subtask text.
 * @param {HTMLInputElement} inputField - The input field element.
 * @returns {string} - The trimmed subtask text.
 */
function getTrimmedSubtaskText(inputField) {
  return inputField.value.trim();
}

/**
 * Generates a unique ID for a new subtask based on the current timestamp.
 * @returns {string} - The generated subtask ID.
 */
function generateSubtaskId() {
  return `subtask_${new Date().getTime()}`;
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
 * Removes a subtask from the subtasks array by its ID.
 * @param {string} subtaskId - The ID of the subtask to be removed.
 */
function removeSubtaskFromArray(subtaskId) {
  subtasks = subtasks.filter((subtask) => subtask.id !== subtaskId);
}

/**
 * Creates HTML for a new subtask item.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The unique ID of the subtask.
 * @returns {string} - The HTML string for the subtask.
 */
function createSubtaskHTML(subtaskText, subtaskId) {
  return /*html*/ `
    <ul class="task-item" data-id="${subtaskId}" ondblclick="editSubtask(this)">
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
