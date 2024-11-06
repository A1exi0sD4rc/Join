const categories = ["todo", "progress", "await", "done"];

/**
 * Changes the category of a task based on the arrow clicked and updates it in the database.
 *
 * @param {string} taskId - The ID of the task to update.
 * @param {string} direction - The direction to move the task ("up" or "down").
 */
async function changeTaskCategory(taskId, direction) {
  let task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  let currentCategoryIndex = categories.indexOf(task.category);
  let newCategoryIndex =
    direction === "up"
      ? Math.max(0, currentCategoryIndex - 1)
      : Math.min(categories.length - 1, currentCategoryIndex + 1);

  if (currentCategoryIndex === newCategoryIndex) return;

  task.category = categories[newCategoryIndex];
  await updateTaskInDatabase(task);
  refreshTaskBoard();
}

/**
 * Generates HTML for up and/or down arrow icons based on the task category.
 * The up arrow moves the task to the previous category, and the down arrow
 * moves it to the next category. When clicked, these arrows prevent the
 * event from bubbling up to avoid opening the big task view.
 *
 * @param {string} category - The current category of the task (e.g., "todo", "progress", "await", "done").
 * @param {string} taskId - The unique identifier of the task.
 * @returns {string} - HTML string for the up and/or down arrow icons, with click event handlers attached.
 */
function renderArrows(category, taskId) {
  let arrowUpHtml = "";
  let arrowDownHtml = "";

  if (category === "done") {
    arrowUpHtml = `<img class="arrow_up" src="./assets/img/arrow_up.svg" onclick="moveTaskUp('${taskId}', event)">`;
  } else if (category === "todo") {
    arrowDownHtml = `<img class="arrow_down" src="./assets/img/arrow_down.svg" onclick="moveTaskDown('${taskId}', event)">`;
  } else {
    arrowUpHtml = `<img class="arrow_up" src="./assets/img/arrow_up.svg" onclick="moveTaskUp('${taskId}', event)">`;
    arrowDownHtml = `<img class="arrow_down" src="./assets/img/arrow_down.svg" onclick="moveTaskDown('${taskId}', event)">`;
  }

  return `${arrowUpHtml}${arrowDownHtml}`;
}

/**
 * Event handler for the up arrow click to move task up a category.
 * Prevents the click event from propagating to avoid triggering the big task view.
 *
 * @param {string} taskId - The unique identifier of the task to be moved.
 * @param {Event} event - The click event triggered by clicking the up arrow icon.
 */
function moveTaskUp(taskId, event) {
  event.stopPropagation();
  changeTaskCategory(taskId, "up");
}

/**
 * Event handler for the down arrow click to move task down a category.
 * Prevents the click event from propagating to avoid triggering the big task view.
 *
 * @param {string} taskId - The unique identifier of the task to be moved.
 * @param {Event} event - The click event triggered by clicking the up arrow icon.
 */
function moveTaskDown(taskId, event) {
  event.stopPropagation();
  changeTaskCategory(taskId, "down");
}
