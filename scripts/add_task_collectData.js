let TASKS_URL = "https://join-337-userlist-default-rtdb.firebaseio.com/tasks";

async function addTaskToDatabase() {
  const newTask = collectTaskData();
  await saveTaskToDatabase(newTask);
  goToBoard();
  clearAll();
}

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
    category: "todo", //default
    description: description,
    prio: prio,
    due_date: dueDate,
    subtask: subtasksObject,
    title: title,
  };
}

function collectTaskDataEdit() {
  const title = getInputValueById("aT_title_edit");
  const description = getInputValueById("aT_description_edit");
  const dueDate = getInputValueById("aT_date_edit");
  const categorySelect = getCategoryEdit();
  const prio = getActivePriorityEdit();
  const contacts = selectedContacts;

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

function getInputValueById(id) {
  return document.getElementById(id).value;
}

function getCategory() {
  return document.getElementById("aT_select_category").innerHTML.trim();
}

function getActivePriority() {
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

function getActivePriorityEdit() {
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

function goToBoard() {
  window.location.href = "board.html";
}

function clearTaskContainers() {
  document.getElementById("small_card_todo").innerHTML = "";
  document.getElementById("small_card_progress").innerHTML = "";
  document.getElementById("small_card_await").innerHTML = "";
  document.getElementById("small_card_done").innerHTML = "";
}
