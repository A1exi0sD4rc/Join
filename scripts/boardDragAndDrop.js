/**
 * startDrag(id) assigns the value of id to the variable draggedTo, to follow the element being dragged in a drag and drop operation.
 *
 * @param {number} id - The id provides a unique identifier for the object.
 */
function startDrag(id) {
    draggedTo = id;
    const card = document.getElementById(id);
    card.classList.add('rotate')
}

function endDrag(id) {
    const card = document.getElementById(id);
    card.classList.remove('rotate');
}


/**
 * enables dropping elements onto the target div
 *
 * @param {event} ev - the event object, which contains information about the event and allows manipulation of the default behavior associated with it
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * changes the category of the task being dragged to the new category.
 *
 * @param {string} category - used to update the category of a specific task in the tasks array.
 */
function moveTo(category) {
    tasks[draggedTo]["category"] = category;
    updateHtmlTodo();
    updateHtmlProgress();
    updateHtmlAwait();
    updateHtmlDone();
}