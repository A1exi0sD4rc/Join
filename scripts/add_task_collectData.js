let TASKS_URL = "https://join-337-userlist-default-rtdb.firebaseio.com/tasks";

async function addTaskToDatabase() {
  const newTask = collectTaskData();
  await saveTaskToDatabase(newTask);
  goToBoard();
}

function collectTaskData() {
  const title = getInputValueById("aT_title");
  const description = getInputValueById("aT_description");
  const category = getCategory();
  const prio = getActivePriority();

  return {
    art: category,
    assigned: "", //Empty for now.
    category: "todo", // Default
    description: description,
    prio: prio,
    subtask: "", // Empty for now
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
  await fetchTasks();
  updateHtmlTodo();
  updateHtmlProgress();
  updateHtmlAwait();
  updateHtmlDone();
}

function goToBoard() {
  window.location.href = "board.html";
}
