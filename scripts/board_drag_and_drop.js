let draggedTaskId;

/**
 * assigns the value of id to the variable draggedTo, to follow the element being dragged in a drag and drop operation.
 *
 * @param {number} id
 */
function startDrag(id) {
  draggedTaskId = id;
  const card = document.getElementById(id);
  card.classList.add("rotate");
}

/**
 * stops the drag action and removes the rotate class from the card element.
 *
 * @param {number} id
 */
function endDrag(id) {
  const card = document.getElementById(id);
  card.classList.remove("rotate");
}

/**
 * enables dropping elements onto the target div.
 *
 * @param {event} ev
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * changes the category of the task being dragged to the new category.
 *
 * @param {string} category
 */
async function moveTo(newCategory) {
  const taskId = draggedTaskId;
  let task = tasks.find((t) => t.id === taskId);

  if (task) {
    const currentTaskData = await fetch(`${TASKS_URL}/${taskId}.json`);
    const updatedTaskData = await currentTaskData.json();

    if (updatedTaskData && updatedTaskData.subtask) {
      task.subtask = updatedTaskData.subtask;
    }

    task.category = newCategory;
    updateHtmlTodo();
    updateHtmlProgress();
    updateHtmlAwait();
    updateHtmlDone();
    updateTaskInDatabase(task);
  }
}

/**
 * adds an border to the selected/aktive div.
 *
 * @param {number} id
 */
function addHighlightBorder(id) {
  document.getElementById(id).classList.add("drag_area_border");
}

/**
 * removes the border if no div is selected/aktive.
 *
 * @param {number} id
 */
function removeHighlightBorder(id) {
  document.getElementById(id).classList.remove("drag_area_border");
}

/**
 * updates the task on database.
 *
 * @param {number} task
 */
async function updateTaskInDatabase(task) {
  try {
    const response = await fetch(`${TASKS_URL}/${task.id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error("Error updating task");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}
