/**
 * shortens a string to a specified maximum length, adding "..." if the text exceeds that length.
 * @param {*} text
 * @param {*} maxLength
 * @returns
 */
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

/**
 * creates HTML for displaying up to three contact initials and shows a "+N" for any additional contacts.
 * If none are assigned, it returns an empty div.
 * @param {*} assigned
 * @returns
 */
function renderAssignedContacts(assigned) {
  if (assigned && assigned.length > 0) {
    const maxDisplayedContacts = 3;
    let displayedContacts = assigned.slice(0, maxDisplayedContacts);
    let extraContacts = assigned.length - maxDisplayedContacts;
    let contactsHtml = displayedContacts
      .map((contact) => {
        let initials = getInitials(contact.name.replace(" (You)", ""));
        return `
        <div class="assigned-contact" style="position: relative; display: inline-block;">
          <svg width="36" height="36" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
            <text x="21" y="27" text-anchor="middle" font-size="16" font-weight="400" fill="white">${initials}</text>
          </svg>
        </div>
      `;
      })
      .join("");

    if (extraContacts > 0) {
      contactsHtml += `
        <div class="assigned-contact" style="position: relative; display: inline-block;">
          <svg width="36" height="36" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="21" r="20" fill="#2a3647" stroke="white" stroke-width="2"/>
            <text x="21" y="27" text-anchor="middle" font-size="16" font-weight="400" fill="white">+${extraContacts}</text>
          </svg>
        </div>
      `;
    }

    return contactsHtml;
  } else {
    return `
      <div class="assigned-contact" style="position: relative; display: inline-block;"></div>
    `;
  }
}

/**
 * generates HTML for a progress bar showing completed subtasks and their total count,
 * returning an empty string if there are no subtasks.
 * @param {*} subtasks
 * @returns
 */
function generateSubAmountHtml(subtasks) {
  const totalSubtasks = Object.keys(subtasks).length;
  const completedSubtasks = Object.values(subtasks).filter(
    (subtask) => subtask.completed
  ).length;
  return totalSubtasks > 0
    ? `
      <div class="sub_amount_small">

        <div class="subtasks_bar_small">
          <div class="subtasks_bar_fill" style="width: ${
            (completedSubtasks / totalSubtasks) * 100
          }%; background-color: #4589FF;"></div>
        </div>

        <div class="amount_subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</div>

      </div>
    `
    : "";
}

/**
 * generates HTML for displaying a list of subtasks, including checkboxes to indicate completion,
 * based on the provided subtasks object and task ID.
 * @param {*} subtasks
 * @param {*} taskId
 * @returns
 */
function renderSubtasks(subtasks, taskId) {
  if (!subtasks || typeof subtasks !== "object") {
    return `<span class="subtask_title"></span>`;
  }

  return Object.keys(subtasks)
    .map((key) => {
      const subtask = subtasks[key];
      const checkboxSrc = subtask.completed
        ? "assets/img/checkbox-checked.png"
        : "assets/img/checkbox.png";
      return `
        <div class="subtask_item" id="subtask_${taskId}_${key}">
          <img src="${checkboxSrc}" class="subtask_checkbox" id="subtask_checkbox_${taskId}_${key}" onclick="toggleSubtask('${taskId}', '${key}')">
          <span class="subtask_title">${subtask.title}</span>
        </div>
      `;
    })
    .join("");
}

/**
 * toggles a subtask's completion status and updates the UI and database accordingly.
 * @param {*} taskId
 * @param {*} subtaskKey
 * @returns
 */
async function toggleSubtask(taskId, subtaskKey) {
  try {
    const taskResponse = await fetch(`${TASKS_URL}/${taskId}.json`);
    const taskData = await taskResponse.json();

    const subtask = taskData.subtask?.[subtaskKey];

    if (!subtask) {
      console.error(`Subtask ${subtaskKey} not found.`);
      return;
    }
    subtask.completed = !subtask.completed;

    const checkboxImage = document.getElementById(
      `subtask_checkbox_${taskId}_${subtaskKey}`
    );
    checkboxImage.src = subtask.completed
      ? "assets/img/checkbox-checked.png"
      : "assets/img/checkbox.png";

    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (taskToUpdate) {
      taskToUpdate.subtask[subtaskKey] = subtask;
    }

    updateSubtasksUI(taskId, taskData);
    await updateTaskInDatabase({ ...taskData, id: taskId });
  } catch (error) {
    console.error("Error toggling subtask:", error);
  }
}

/**
 * updates the progress bar and displayed count of completed
 * subtasks for a specific task based on the provided task data.
 * @param {*} taskId
 * @param {*} taskData
 */
function updateSubtasksUI(taskId, taskData) {
  const subtasks = taskData.subtask;
  const totalSubtasks = Object.keys(subtasks).length;
  const completedSubtasks = Object.values(subtasks).filter(
    (st) => st.completed
  ).length;
  const progressBarFill = document.querySelector(
    `#${taskId} .subtasks_bar_fill`
  );

  if (progressBarFill) {
    const progressPercentage = (completedSubtasks / totalSubtasks) * 100;
    progressBarFill.style.width = `${progressPercentage}%`;
  }

  const subAmountElement = document.querySelector(
    `#${taskId} .amount_subtasks`
  );

  if (subAmountElement) {
    subAmountElement.innerHTML = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  }
}

/**
 * creates HTML for displaying assigned contacts' initials and names or returns an empty element if there are none.
 * @param {*} assigned
 * @returns
 */
function renderBigAssignedContacts(assigned) {
  if (assigned) {
    return assigned
      .map((contact) => {
        let displayName = contact.name.replace(" (You)", "");
        let initials = getInitials(displayName);
        return `
        <div class="big_assigned_user">
          <div class="assigned_logo_name">
            <svg width="36" height="36" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="21" cy="21" r="21" fill="${contact.bgcolor}" stroke="white" stroke-width="3"/>
              <text x="21" y="27" text-anchor="middle" font-size="17" font-weight="400" fill="white">${initials}</text>
            </svg>
            <div class="assigned_big_name">${displayName}</div>
          </div>
        </div>
      `;
      })
      .join("");
  } else {
    return `
     <div class="assigned-contact" style="position: relative; display: inline-block; opacity: 0;"></div>
    `;
  }
}

/**
 *
 * @param {*} dateString
 * @returns
 */
function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * returns HTML indicating that there are no tasks to do.
 * @returns
 */
function renderNoTasksToDo() {
  return `
    <div class="no_tasks"><div class="no_tasks_txt">No tasks To do</div></div>
  `;
}

/**
 * returns HTML that displays a message indicating there are no tasks in progress.
 * @returns
 */
function renderNoTasksProgress() {
  return `
    <div class="no_tasks"><div class="no_tasks_txt">No tasks in Progress</div></div>
  `;
}

/**
 * returns HTML that shows a message indicating there is no feedback awaited.
 * @returns
 */
function renderNoTasksAwait() {
  return `
    <div class="no_tasks"><div class="no_tasks_txt">No feedback awaited</div></div>
  `;
}

/**
 * returns HTML that displays a message stating there are no tasks done.
 * @returns
 */
function renderNoTaskDone() {
  return `
    <div class="no_tasks"><div class="no_tasks_txt">No tasks Done</div></div>
  `;
}
