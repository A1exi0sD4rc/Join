let TASKS_URL = "https://join337-40cd8-default-rtdb.europe-west1.firebasedatabase.app/tasks";

let taskCategory = "";

/**
 * Adds a new task to the database, redirects to the board view, and clears input fields.
 * @async
 * @function addTaskToDatabase
 * @returns {Promise<void>}
 */
async function addTaskToDatabase() {
  const newTask = collectTaskData();
  await saveTaskToDatabase(newTask);
  goToBoard();
  clearAll();
}

/**
 * Collects task details from input fields and returns them as an object.
 * @function collectTaskData
 * @returns {Object} Task data including title, description, due date, category, priority, assigned contacts, and subtasks.
 */
function collectTaskData() {
  const title = getInputValueById("aT_title");
  const description = getInputValueById("aT_description");
  const dueDate = getInputValueById("aT_date");
  const category = getCategory();
  const prio = getActivePriority();
  const contacts = selectedContacts;
  let subtasksObject = {};
  subtasks.forEach((subtask, index) => {
    subtasksObject[`subtask${index + 1}`] = {
      completed: subtask.completed,
      title: subtask.title,
    };
  });
  return {
    art: category,
    assigned: contacts,
    category: "todo",
    description: description,
    prio: prio,
    due_date: dueDate,
    subtask: subtasksObject,
    title: title,
  };
}

/**
 * Collects edited task details from input fields and returns them as an object.
 * @function collectTaskDataEdit
 * @returns {Object} Edited task data including title, description, due date, category, priority, assigned contacts, and subtasks.
 */
function collectTaskDataEdit() {
  const title = getInputValueById("aT_title_edit");
  const description = getInputValueById("aT_description_edit");
  const dueDate = getInputValueById("aT_date_edit");
  const categorySelect = getCategoryEdit();
  const prio = getActivePriorityEdit();
  const contacts = selectedContacts;
  const category = taskCategory;
  let subtasksObject = {};
  subtasks.forEach((subtask, index) => {
    subtasksObject[`subtask${index + 1}`] = {
      completed: subtask.completed,
      title: subtask.title,
    };
  });
  return {
    art: categorySelect,
    assigned: contacts,
    category: category,
    description: description,
    prio: prio,
    due_date: dueDate,
    subtask: subtasksObject,
    title: title,
  };
}

/**
 * Retrieves the value of an input field by its ID.
 * @function getInputValueById
 * @param {string} id - The ID of the input element.
 * @returns {string} The value of the input field.
 */
function getInputValueById(id) {
  return document.getElementById(id).value;
}

/**
 * Retrieves and trims the inner text of the category selection element.
 * @function getCategory
 * @returns {string} The selected category as a string.
 */
function getCategory() {
  return document.getElementById("aT_select_category").innerHTML.trim();
}

/**
 * Returns the active priority level or defaults to "Medium."
 * @function getActivePriority
 * @returns {string} The priority level: "Urgent", "Medium", or "Low".
 */
function getActivePriority() {
  if (
    document.querySelector("#boxUrgent").classList.contains("urgent_box_active")
  ) {
    return "Urgent";
  } else if (
    document.querySelector("#boxMedium").classList.contains("medium_box_active")
  ) {
    return "Medium";
  } else if (
    document.querySelector("#boxLow").classList.contains("low_box_active")
  ) {
    return "Low";
  } else {
    return "Medium";
  }
}

/**
 * Returns the active edited priority level or defaults to "Medium."
 * @function getActivePriorityEdit
 * @returns {string} The edited priority level: "Urgent", "Medium", or "Low".
 */
function getActivePriorityEdit() {
  if (
    document
      .querySelector("#boxUrgentEdit")
      .classList.contains("urgent_box_active")
  ) {
    return "Urgent";
  } else if (
    document
      .querySelector("#boxMediumEdit")
      .classList.contains("medium_box_active")
  ) {
    return "Medium";
  } else if (
    document.querySelector("#boxLowEdit").classList.contains("low_box_active")
  ) {
    return "Low";
  } else {
    return "Medium";
  }
}

/**
 * Saves a task to the database and logs a success message or an error if the operation fails.
 * @async
 * @function saveTaskToDatabase
 * @param {Object} task - The task data to be saved.
 * @returns {Promise<void>}
 */
async function saveTaskToDatabase(task) {
  try {
    const response = await fetch(`${TASKS_URL}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error("Error adding task");
    }
    console.log("Task successfully added");
  } catch (error) {
    console.error("Network error:", error);
  }
}

/**
 * Refreshes the task board by clearing and updating task containers and fetching tasks.
 * @async
 * @function refreshTaskBoard
 * @returns {Promise<void>}
 */
async function refreshTaskBoard() {
  clearTaskContainers();
  updateHtmlTodo();
  updateHtmlProgress();
  updateHtmlAwait();
  updateHtmlDone();
  await fetchTasks();
}

/**
 * Redirects the user to the board page.
 * @function goToBoard
 */
function goToBoard() {
  window.location.href = "board.html";
}

/**
 * Clears the content of various task container elements.
 * @function clearTaskContainers
 */
function clearTaskContainers() {
  document.getElementById("small_card_todo").innerHTML = "";
  document.getElementById("small_card_progress").innerHTML = "";
  document.getElementById("small_card_await").innerHTML = "";
  document.getElementById("small_card_done").innerHTML = "";
}
