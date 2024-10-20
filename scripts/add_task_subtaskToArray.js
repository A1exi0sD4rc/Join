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
