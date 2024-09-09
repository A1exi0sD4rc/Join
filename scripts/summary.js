let toDo = document.getElementById("toDoCount");
let done = document.getElementById("doneCount");
let inProgress = document.getElementById("inProgressCount");
let awaitFeedback = document.getElementById("awaitFeedbackCount");
let urgent = document.getElementById("urgentCount");
let allTasks = document.getElementById("allTasks");

/**
 * This function initializes the summary html.
 */
async function summaryInit() {
  includeHTML();
  awaitGenerateInitials();
  generateCounts();
}

/**
 * This function defines and generates the numbers for counting the tasks in the different categories.
 */
function generateCounts() {
  toDo.innerHTML = counter("to-do");
  done.innerHTML = counter("done");
  inProgress.innerHTML = counter("in-progress");
  awaitFeedback.innerHTML = counter("await-feedback");
  urgent.innerHTML = countUrgentTasks();
  allTasks.innerHTML = countAllTasks();
}

/**
 * This function calculates the number of tasks in a category.
 * @param {string} category - board category
 * @returns number of tasks in a category
 */
function counter(category) {
  return tasksArray.filter((task) => task.board_category === category).length;
}
