let TASKS_URL = "https://join-337-userlist-default-rtdb.firebaseio.com/tasks";

let taskCategory = "";

/**
 * 
 * function collects task data, saves it to the database, navigates to the task board, and clears all input fields.
 */
async function addTaskToDatabase() {
  const newTask = collectTaskData();
  await saveTaskToDatabase(newTask);
  goToBoard();
  clearAll();
}

/**
 * function collects task details from input fields and returns them as an object.
 * @returns 
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
 * collects edited task details from input fields and returns them as an object.
 * @returns 
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
 * function retrieves the value of an input field by its ID. * 
 * @param {*} id 
 * @returns 
 */
function getInputValueById(id) {
  return document.getElementById(id).value;
}

/**
 * retrieves and trims the inner text of the category selection element.
 * @returns 
 */
function getCategory() {
  return document.getElementById("aT_select_category").innerHTML.trim();
}

/**
 * returns the active priority level or defaults to "Medium."
 * @returns 
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
 * returns the active edited priority level or defaults to "Medium."
 * @returns 
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
 * saves a task to the database and logs a success message or an error if the operation fails.
 * @param {*} task 
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

async function refreshTaskBoard() {
  clearTaskContainers();
  updateHtmlTodo();
  updateHtmlProgress();
  updateHtmlAwait();
  updateHtmlDone();
  await fetchTasks();
}

/**
 * redirects the user to the board page.
 * 
 */
function goToBoard() {
  window.location.href = "board.html";
}

/**
 *  clears the content of various task container elements.
 * 
 */
function clearTaskContainers() {
  document.getElementById("small_card_todo").innerHTML = "";
  document.getElementById("small_card_progress").innerHTML = "";
  document.getElementById("small_card_await").innerHTML = "";
  document.getElementById("small_card_done").innerHTML = "";
}
