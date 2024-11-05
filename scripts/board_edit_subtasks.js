let originalSubtasks = {};
let newSubtasks = {};
let currentTaskId = null;

/**
 * Saves the edited task to the database, updating existing data and managing subtasks.
 * Checks for changes to subtasks, updates modified ones, deletes removed ones, and adds new subtasks.
 * Refreshes the task board and displays the updated task in the expanded view.
 *
 * @async
 * @param {string} taskId - The unique identifier for the task being updated.
 * @returns {Promise<void>} - A promise that resolves when the task and subtasks are successfully saved to the database.
 * @throws {Error} - Throws an error if there's a network issue or an error in updating the task.
 */
async function saveEditedTaskToDatabase(taskId) {
  const updatedTask = collectTaskDataEdit();
  updatedTask.assigned = selectedContacts;

  const updatedSubtasks = { ...originalSubtasks, ...newSubtasks };

  const subtasksToDelete = Object.keys(originalSubtasks).filter(
    (originalId) => !updatedSubtasks[originalId]
  );

  try {
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

    for (const subtaskId of subtasksToDelete) {
      await deleteSubtaskFromDatabase(taskId, subtaskId);
    }

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

    originalSubtasks = { ...updatedSubtasks };
    newSubtasks = {};

    await refreshTaskBoard();
    showBigTask(taskId);
  } catch (error) {
    console.error("Network error:", error);
  }
}

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
 * Adds a new subtask to the list in the edit view, generating a unique ID and HTML for the subtask.
 * Updates the new subtasks object and clears the input field after adding the subtask.
 */
function addSubtaskToListEdit() {
  const subtaskContainer = document.getElementById("created_subtasks_edit");
  const subtaskInput = document.getElementById("aT_add_subtasks_edit");
  const subtaskTitle = subtaskInput.value.trim();

  if (subtaskTitle !== "") {
    const maxSubtaskIndex = Math.max(
      ...Object.keys({ ...originalSubtasks, ...newSubtasks }).map((key) => {
        const match = key.match(/subtask(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
    );

    const nextSubtaskId = `subtask${maxSubtaskIndex + 1}`;

    const newSubtask = {
      title: subtaskTitle,
      completed: false,
    };

    newSubtasks[nextSubtaskId] = newSubtask;

    const subtaskHTML = createSubtaskHTMLEdit(newSubtask.title, nextSubtaskId);
    subtaskContainer.innerHTML += subtaskHTML;

    subtaskInput.value = "";
    resetDivVisibilityEdit();
  }
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
  document.querySelectorAll(".edit-subtask-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const subtaskId = this.getAttribute("data-id");
      const subtaskTitleElement = document
        .getElementById(subtaskId)
        .querySelector(".task-text");
      const newTitle = prompt(
        "Enter new title:",
        subtaskTitleElement.textContent
      );

      if (newTitle) {
        updateSubtaskTitle(subtaskId, newTitle);
        subtaskTitleElement.textContent = newTitle;
      }
    });
  });

  const subtaskCheckboxes = document.querySelectorAll(".subtask-checkbox");
  subtaskCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("click", (event) => {
      const taskId = event.target.dataset.taskId;
      const subtaskId = event.target.dataset.subtaskId;
      toggleSubtask(taskId, subtaskId);
    });
  });

  document.querySelectorAll(".delete-subtask-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const subtaskId = this.getAttribute("data-id");
      deleteSubtaskEdit(subtaskId);
      document.getElementById(subtaskId).remove();
    });
  });
}
