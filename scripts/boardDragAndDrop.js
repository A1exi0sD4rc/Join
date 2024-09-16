/**
 * startDrag(id) assigns the value of id to the variable draggedTo, to follow the element being dragged in a drag and drop operation.
 *
 * @param {number} id
 */
function startDrag(id) {
  draggedTo = id;
  const card = document.getElementById(id);
  card.classList.add("rotate");
}


function endDrag(id) {
  const card = document.getElementById(id);
  card.classList.remove("rotate");
}


/**
 * enables dropping elements onto the target div
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
function moveTo(category) {
  const task = tasks.find((t) => t.id === draggedTo);
  if (task) {
    task.category = category;
  }
  updateHtmlTodo();
  updateHtmlProgress();
  updateHtmlAwait();
  updateHtmlDone();
}


function addHighlightBorder(id) {
  document.getElementById(id).classList.add("drag_area_border");
}


function removeHighlightBorder(id) {
  document.getElementById(id).classList.remove("drag_area_border");
}


async function updateTaskInDatabase(task) {
  await fetch(`${BASE_URL}/${task.id}.json`, {
    method: "PATCH",
    body: JSON.stringify({
      category: task.category,
    }),
  });
}
