const BASE_URL_TASKS =
  "https://join-337-userlist-default-rtdb.firebaseio.com/tasks";
let tasks = [];

const BASE_URL_ASSIGNED =
  "https://join-337-userlist-default-rtdb.firebaseio.com/tasks";
let bigassigned = [];

let draggedTo;

const artColors = {
  "Technical Task": "#1FD7C1",
  "User Story": "#0038FF",
};

const prios = {
  Low: "assets/img/Prio_low.svg",
  Medium: "assets/img/Prio_med.svg",
  Urgent: "assets/img/Prio_high.svg",
};

async function initBoardJs() {
  includeHTML();
  awaitGenerateInitials();
  await fetchTasks();
  updateHtmlTodo();
  updateHtmlProgress();
  updateHtmlAwait();
  updateHtmlDone();
  changeArtBackground();
  await getContacts();
}

/**
 * retrieves data from API , converts them to JSON format and pushs the result to the tasks variable.
 *
 * @param {path} path
 */
async function fetchTasks(path = "") {
  let response = await fetch(BASE_URL_TASKS + path + ".json");
  data = await response.json();
  tasks = [];
  for (let key in data) {
    tasks.push({ id: key, ...data[key] });
  }
}

/**
 * filters tasks marked as "todo" and dynamically updates the section with task cards including their background-color and priority img.
 */
function updateHtmlTodo() {
  let todo = tasks.filter((x) => x["category"] == "todo");
  document.getElementById("small_card_todo").innerHTML = "";
  if (todo.length < 1) {
    document.getElementById("small_card_todo").innerHTML = renderNoTasksToDo();
  } else {
    for (let index = 0; index < todo.length; index++) {
      const elementToDo = todo[index];
      document.getElementById("small_card_todo").innerHTML +=
        renderTaskCardToDo(elementToDo);
      changeArtBackground(`art_small_${elementToDo.id}`);
      addPrioImg(elementToDo);
    }
  }
}

/**
 * filters tasks marked as "progress" and dynamically updates the section with task cards including their background-color and priority img.
 */
function updateHtmlProgress() {
  let progress = tasks.filter((x) => x["category"] == "progress");
  document.getElementById("small_card_progress").innerHTML = "";
  if (progress.length < 1) {
    document.getElementById("small_card_progress").innerHTML =
      renderNoTasksProgress();
  } else {
    for (let index = 0; index < progress.length; index++) {
      const elementProgress = progress[index];
      document.getElementById("small_card_progress").innerHTML +=
        renderTaskCardToDo(elementProgress);
      changeArtBackground(`art_small_${elementProgress.id}`);
      addPrioImg(elementProgress);
    }
  }
}

/**
 * filters tasks marked as "await" and dynamically updates the section with task cards including their background-color and priority img.
 */
function updateHtmlAwait() {
  let await = tasks.filter((x) => x["category"] == "await");
  document.getElementById("small_card_await").innerHTML = "";
  if (await.length < 1) {
    document.getElementById("small_card_await").innerHTML =
      renderNoTasksAwait();
  } else {
    for (let index = 0; index < await.length; index++) {
      const elementAwait = await[index];
      document.getElementById("small_card_await").innerHTML +=
        renderTaskCardAwait(elementAwait);
      changeArtBackground(`art_small_${elementAwait.id}`);
      addPrioImg(elementAwait);
    }
  }
}

/**
 * filters tasks marked as "done" and dynamically updates the section with task cards including their background-color and priority img.
 */
function updateHtmlDone() {
  let done = tasks.filter((x) => x["category"] == "done");
  document.getElementById("small_card_done").innerHTML = "";
  if (done.length < 1) {
    document.getElementById("small_card_done").innerHTML = renderNoTaskDone();
  } else {
    for (let index = 0; index < done.length; index++) {
      const elementDone = done[index];
      document.getElementById("small_card_done").innerHTML +=
        renderTaskCardAwait(elementDone);
      changeArtBackground(`art_small_${elementDone.id}`);
      addPrioImg(elementDone);
    }
  }
}

/**
 * changes the background-color of a div depending on his catergory/textContent
 *
 * @param {number} id
 */
function changeArtBackground(id) {
  const toChangeBg = document.getElementById(id);
  if (toChangeBg) {
    toChangeBg.style.backgroundColor = artColors[toChangeBg.textContent.trim()];
  }
}

/**
 * adds a specific priority Icon/img to the task card.
 *
 * @param {object} tasks -
 */
function addPrioImg(tasks) {
  const prioimg = prios[tasks.prio];
  const prio_small = document.getElementById(`prio_small_${tasks.id}`);
  if (prioimg) {
    prio_small.innerHTML = `<img src="${prioimg}">`;
  }
}

/**
 * adds a specific priority Icon/img to the big task card.
 *
 * @param {object} tasks -
 */
function addPrioBigImg(bigelement) {
  const prioBigImg = prios[bigelement.prio];
  const big_prio_img = document.getElementById(`big_prio_img_${bigelement.id}`);
  if (prioBigImg) {
    big_prio_img.innerHTML = `${bigelement["prio"]}  <img src="${prioBigImg}">`;
  }
}

/**
 * filters tasks based on the search input.
 */
function filterTasks() {
  const searchValue = document
    .querySelector(".search_task_input")
    .value.toLowerCase();
  clearAndFilterTasks(searchValue);
}

/**
 * displays a window with a warning message if the search field is empty.
 */
function emptySearchInput() {
  const emptySearchInput = document.getElementById("search_task_input").value;
  if (emptySearchInput == "") alert("You must enter a search term.");
}

/**
 * updates the task sections after filter function.
 *
 * @param {*} searchValue
 */
function clearAndFilterTasks(searchValue) {
  document.getElementById("small_card_todo").innerHTML = "";
  document.getElementById("small_card_progress").innerHTML = "";
  document.getElementById("small_card_await").innerHTML = "";
  document.getElementById("small_card_done").innerHTML = "";
  tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchValue) ||
        task.description.toLowerCase().includes(searchValue)
    )
    .forEach((task) => {
      const categoryElement = document.getElementById(
        `small_card_${task.category}`
      );
      if (categoryElement) {
        categoryElement.innerHTML += renderTaskCardToDo(task);
        changeArtBackground(`art_small_${task.id}`);
        addPrioImg(task);
      }
    });
}

/**
 * this function looks through each task to see if its id matches the taskId that was passed in and displays the big task card.
 *
 * @param {*} taskId
 */
function showBigTask(taskId) {
  const bigelement = tasks.find((task) => task.id === taskId);
  if (bigelement) {
    document.getElementById("big_card_bg").classList.remove("d_none");
    document.getElementById("big_card_bg").innerHTML = "";
    document.getElementById("big_card_bg").innerHTML =
      renderBigTaskCard(bigelement);
    changeArtBackground(`big_art_${bigelement.id}`);
    addPrioBigImg(bigelement);
    document.body.style.overflow = "hidden";
  }
}

/**
 * function to close the big card.
 */
function hideBigTask() {
  document.getElementById("big_card_bg").classList.add("d_none");
  document.getElementById("big_card_bg").innerHTML = "";
  document.body.style.overflow = "";
}

/**
 * retrieves data from API , converts them to JSON format and pushs the result to the bigassigned variable.
 *
 * @param {*} path
 */
async function assignedToBigCard(path = "") {
  let assigned = await fetch(BASE_URL_ASSIGNED + path + ".json");
  bigassigned = await assigned.json();
}

/**
 *
 */
function bigAssignedTo() {
  for (let index = 0; index < bigassigned.length; index++) {
    const assigned = bigassigned[index];
    document.getElementById("assigned_big_name").innerHTML +=
      renderBigTaskCard(assigned);
  }
}

/**
 * deletes aktive card from board and database.
 *
 */
async function deleteTask() {
  const taskId = document
    .getElementById("big_card")
    ?.getAttribute("data-task-id");
  if (!taskId) return;
  const response = await fetch(`${BASE_URL_TASKS}/${taskId}.json`, {
    method: "DELETE",
  });
  if (!response.ok) return;
  document.getElementById(taskId)?.remove();
  tasks = tasks.filter((task) => task.id !== taskId);
  hideBigTask();
  await refreshTaskBoard();
}

/**
 * Opens the task form or navigates to the 'add_task.html' page depending on screen width.
 *
 * @function openForm
 * @returns {void} No return value.
 */
function openForm() {
  if (window.innerWidth <= 1000) {
    window.location.href = "./add_task.html";
  } else {
    openOverlay();
    const taskForm = document.getElementById("taskForm");
    taskForm.classList.add("active");
    document.body.classList.add("no-scroll");
  }
}

/**
 * Activates the overlay for the task form.
 *
 * @function openOverlay
 * @returns {void} No return value.
 */
function openOverlay() {
  const overlay = document.getElementById("taskOverlay");
  overlay.classList.add("active");
}

/**
 * Closes the task form and overlay, and resets the page.
 *
 * @function closeForm
 * @returns {void} No return value.
 */
function closeForm() {
  clearAll();
  const taskForm = document.getElementById("taskForm");
  taskForm.classList.remove("active");
  setTimeout(() => {
    taskForm.style.display = "none";
    document.getElementById("taskOverlay").style.display = "none";
  }, 300);
  document.body.classList.remove("no-scroll");
}
