/**
 * This function initializes the summary html.
 */
async function summaryInit() {
  // checkLogin(); // Implemented but don't need for tests or functions, only activate when uploaded on the server!
  includeHTML();
  initPage();
  generateCounts();
  generateGreets();
  generateUpcomingDate();
  awaitGenerateInitials();
}

/**
 * This function defines and generates the numbers for counting the tasks in the different categories.
 */
function generateCounts() {
  let toDo = document.getElementById("toDoCount");
  let done = document.getElementById("doneCount");
  let inProgress = document.getElementById("inProgressCount");
  let awaitFeedback = document.getElementById("awaitFeedbackCount");
  let urgent = document.getElementById("urgentCount");
  let allTasks = document.getElementById("allTasks");
  toDo.innerHTML = counter("todo");
  done.innerHTML = counter("done");
  inProgress.innerHTML = counter("progress");
  awaitFeedback.innerHTML = counter("await");
  urgent.innerHTML = countUrgentTasks();
  allTasks.innerHTML = countAllTasks();
}

/**
 * This function calculates the number of tasks in a category.
 * @param {string} category - board category
 * @returns number of tasks in a category
 */
function counter(category) {
  return tasks.filter((task) => task.category === category).length;
}

/**
 * This function calculates the number of urgent tasks.
 * @returns number of urgent tasks
 */
function countUrgentTasks() {
  return tasks.filter((task) => task.prio === "Urgent").length;
}

/**
 * This function calculates the number of all tasks.
 * @returns number of all tasks
 */
function countAllTasks() {
  return tasks.length;
}

/**
 * This function fills the variables of the greeting container like daytime and name of the logged in user.
 */
function generateGreets() {
  let greetingTime = getGreeting();
  let userName = sessionStorage.getItem("userName");
  let content = document.getElementById("greeting-container");
  content.innerHTML =
    userName === "Guest"
      ? `<span class="greet-text">Good ${greetingTime}!</span>`
      : `<span class="greet-text">Good ${greetingTime},</span>
                   <span class="greet-user-name">${userName}</span>`;
}

/**
 * This function generates the greeting dependant on the date time
 * @returns greeting dependant on the date time
 */
function getGreeting() {
  let now = new Date();
  let hours = now.getHours();
  if (hours >= 5 && hours < 12) return "morning";
  if (hours >= 12 && hours < 18) return "afternoon";
  if (hours >= 18 && hours < 24) return "evening";
  return "night";
}

/**
 * This function generates the due date of the most urgent task.
 */
function generateUpcomingDate() {
  let content = document.getElementById("upcomingDate");
  // content.innerHTML = getClosestUrgentDueDate(); Function can be implemented when tasks have a due date.
  content.innerHTML = "Oktober 10, 2024"; // Here for dinamic date.
}

/**
 * Displays a greeting animation.
 */
function showGreeting() {
  const animationScreen = document.getElementById("animationScreen");
  let greetingTime = getGreeting();
  let userName = sessionStorage.getItem("userName");
  animationScreen.innerHTML =
    userName === "Guest"
      ? `<span class="greet-text">Good ${greetingTime}</span>`
      : `<div class="greeting-user-animation"><span class="greet-text">Good ${greetingTime},</span>
           <span class="greet-user-name">${userName}</div></span>`;
  animationScreen.classList.remove("d-none");
  animationScreen.classList.add("fadeIn");
  setTimeout(hideGreeting, 1000);
}

/**
 * Hides the greeting animation.
 */
function hideGreeting() {
  const animationScreen = document.getElementById("animationScreen");
  const summaryCardContainer = document.querySelector(
    ".summary-card-container"
  );
  animationScreen.classList.remove("fadeIn");
  animationScreen.classList.add("fadeOut");
  setTimeout(() => {
    animationScreen.classList.add("hidden");
    if (summaryCardContainer) summaryCardContainer.classList.add("visible");
  }, 1000);
}

/**
 * Initializes the page based on window width.
 */
function initPage() {
  const summaryCardContainer = document.querySelector(
    ".summary-card-container"
  );
  if (window.innerWidth >= 800) {
    localStorage.setItem("greetingShown", "true");
    summaryCardContainer.classList.add("visible");
  } else {
    if (!localStorage.getItem("greetingShown")) {
      localStorage.setItem("greetingShown", "true");
      showGreeting();
    } else {
      summaryCardContainer.classList.add("visible");
    }
  }
}
