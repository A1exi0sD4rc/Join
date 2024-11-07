let originalSubtasks = {};
let newSubtasks = {};
let currentTaskId = null;

/**
 * Saves edited task data, including updates to the main task and its subtasks, to the database.
 *
 * @async
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @returns {Promise<void>} - Completes when the task and subtasks have been updated and UI refreshed.
 */
async function saveEditedTaskToDatabase(taskId) {
  const updatedTask = collectTaskDataEdit();
  updatedTask.assigned = selectedContacts;
  const updatedSubtasks = { ...originalSubtasks, ...newSubtasks };
  const subtasksToDelete = findSubtasksToDelete(
    originalSubtasks,
    updatedSubtasks
  );

  try {
    await updateSubtasksEdit(taskId, updatedSubtasks);
    await deleteSubtasksEdit(taskId, subtasksToDelete);
    await updateMainTask(taskId, updatedTask, updatedSubtasks);

    originalSubtasks = { ...updatedSubtasks };
    newSubtasks = {};

    await refreshUI(taskId);
  } catch (error) {
    console.error("Network error:", error);
  }
}

/**
 * Identifies subtasks that need to be deleted by comparing original and updated subtasks.
 *
 * @param {Object} originalSubtasks - The original subtasks of the task.
 * @param {Object} updatedSubtasks - The updated subtasks after editing.
 * @returns {string[]} - An array of subtask IDs that should be deleted.
 */
function findSubtasksToDelete(originalSubtasks, updatedSubtasks) {
  return Object.keys(originalSubtasks).filter(
    (originalId) => !updatedSubtasks[originalId]
  );
}

/**
 * Updates existing and new subtasks in the database.
 *
 * @async
 * @param {string} taskId - The unique identifier of the task whose subtasks are updated.
 * @param {Object} updatedSubtasks - An object containing updated subtasks with their data.
 * @returns {Promise<void>} - Completes when all necessary subtask updates are done.
 */
async function updateSubtasksEdit(taskId, updatedSubtasks) {
  for (const subtaskId in updatedSubtasks) {
    const original = originalSubtasks[subtaskId];
    const updated = updatedSubtasks[subtaskId];

    if (
      !original ||
      original.title !== updated.title ||
      original.completed !== updated.completed
    ) {
      await updateSubtaskInDatabase(taskId, subtaskId, updated);
    }
  }
}

/**
 * Deletes specified subtasks from the database.
 *
 * @async
 * @param {string} taskId - The unique identifier of the task whose subtasks are deleted.
 * @param {string[]} subtasksToDelete - An array of subtask IDs to delete.
 * @returns {Promise<void>} - Completes when all specified subtasks are deleted.
 */
async function deleteSubtasksEdit(taskId, subtasksToDelete) {
  for (const subtaskId of subtasksToDelete) {
    await deleteSubtaskFromDatabase(taskId, subtaskId);
  }
}

/**
 * Updates the main task information in the database, including its subtasks.
 *
 * @async
 * @param {string} taskId - The unique identifier of the task to update.
 * @param {Object} updatedTask - The updated task data, including title, description, etc.
 * @param {Object} updatedSubtasks - An object containing the updated subtasks.
 * @returns {Promise<void>} - Completes when the main task is updated in the database.
 * @throws Will throw an error if the database update fails.
 */
async function updateMainTask(taskId, updatedTask, updatedSubtasks) {
  updatedTask.subtask = updatedSubtasks;
  const response = await fetch(`${TASKS_URL}/${taskId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error updating task: ${errorData.message || "Unknown error"}`
    );
  }

  const updatedTaskData = await response.json();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { id: taskId, ...updatedTaskData };
  }
}

/**
 * Refreshes the task board and displays the updated task in a detailed view.
 *
 * @async
 * @param {string} taskId - The unique identifier of the task to display.
 * @returns {Promise<void>} - Completes when the task board is refreshed and the task is displayed.
 */
async function refreshUI(taskId) {
  await refreshTaskBoard();
  showBigTask(taskId);
}

/**
 * Saves the edited subtask title and updates the DOM.
 * @param {HTMLImageElement} saveButton - The save button clicked.
 */
async function saveSubtaskEdit(saveButton) {
  const taskItem = saveButton.closest(".task-item");
  const inputElement = getTaskInputElement(taskItem);
  if (!inputElement || !currentTaskId) return;

  const subtaskId = getSubtaskId(taskItem);
  const newTitle = inputElement.value.trim();

  if (newTitle) {
    newSubtasks[subtaskId] = {
      title: newTitle,
      completed: newSubtasks[subtaskId]?.completed || false,
    };

    await updateSubtaskInDatabase(
      currentTaskId,
      subtaskId,
      newSubtasks[subtaskId]
    );
    updateDOM(taskItem, newTitle);
  }
}

/**
 * Updates a specific subtask in the database with new data.
 *
 * @async
 * @param {string} taskId - The unique identifier of the task containing the subtask.
 * @param {string} subtaskId - The unique identifier of the subtask to update.
 * @param {Object} subtask - The subtask object containing updated data, including `title` and `completed` status.
 * @returns {Promise<void>} - A promise that resolves when the subtask is updated in the database.
 */
async function updateSubtaskInDatabase(taskId, subtaskId, subtask) {
  await fetch(`${TASKS_URL}/${taskId}/subtask/${subtaskId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subtask),
  });
}

/**
 * Deletes a specific subtask from the database.
 *
 * @async
 * @param {string} taskId - The unique identifier of the task containing the subtask.
 * @param {string} subtaskId - The unique identifier of the subtask to delete.
 * @returns {Promise<boolean>} - A promise that resolves to true if the subtask was deleted successfully, false otherwise.
 */
async function deleteSubtaskFromDatabase(taskId, subtaskId) {
  try {
    const response = await fetch(
      `${TASKS_URL}/${taskId}/subtask/${subtaskId}.json`,
      {
        method: "DELETE",
      }
    );
    return response.ok;
  } catch (error) {
    console.error(`Error in deleteSubtaskFromDatabase: ${error}`);
    return false;
  }
}

/**
 * Saves the reordered subtasks to the database for a specified task.
 *
 * @async
 * @param {string} taskId - The unique identifier of the task containing the reordered subtasks.
 * @param {Object} reorderedSubtasks - The object containing reordered subtasks.
 * @returns {Promise<void>} - A promise that resolves when the reordered subtasks are saved to the database.
 */
async function saveReorderedSubtasksToDatabase(taskId, reorderedSubtasks) {
  try {
    const response = await fetch(`${TASKS_URL}/${taskId}/subtask.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reorderedSubtasks),
    });
    if (!response.ok) {
      console.error("Failed to update subtasks order:", response.statusText);
    }
  } catch (error) {
    console.error("Error in saveReorderedSubtasksToDatabase:", error);
  }
}

/**
 * Fetches all subtasks from the database for a specified task.
 *
 * @async
 * @param {string} taskId - The unique identifier of the task to retrieve subtasks for.
 * @returns {Promise<Object>} - A promise that resolves to an object containing subtasks, where each key is a subtask ID.
 */
async function fetchSubtasksFromDatabase(taskId) {
  const response = await fetch(`${TASKS_URL}/${taskId}/subtask.json`);
  const subtasks = await response.json();
  if (!subtasks) return {};

  return subtasks;
}

/**
 * Saves the provided subtasks data to the database.
 *
 * @param {Object} subtasks - The object containing subtasks to be saved, where each key is a subtask ID.
 */
function saveSubtasksToDatabase(subtasks) {
  const subtaskId = getSubtaskId(taskItem);
  fetch(`${TASKS_URL}/${subtaskId}/subtask.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subtasks),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Subtasks saved successfully.");
      } else {
        console.error("Failed to save subtasks:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Error saving subtasks:", error);
    });
}
