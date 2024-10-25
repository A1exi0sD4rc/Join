function renderTaskCardToDo(elementToDo) {
  const subtasks = elementToDo.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);
  const truncatedDescription = truncateText(elementToDo["description"], 35);

  return `
    <div onclick="showBigTask('${elementToDo["id"]}')" 
         class="task_card_small" id="${elementToDo["id"]}" 
         draggable="true" ondragstart="startDrag('${elementToDo["id"]}')">

      <div class="task_card_small_content">

        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementToDo["id"]}">${elementToDo["art"]}</div>
        </div>

      <div class="title_desc_small_div">
        <div class="title_small">${elementToDo["title"]}</div>
        <div class="description_small">${truncatedDescription}</div>
      </div>

        ${subAmountHtml}

    <div class="assigned_prio_small">
      <div class="assigned_small">${renderAssignedContacts(elementToDo["assigned"])}</div>
      <div class="prio_small" id="prio_small_${elementToDo["id"]}">${elementToDo["prio"]}</div>
    </div>

      </div>
    </div>
  `;
}

function renderTaskCardProgress(elementProgress) {
  const subtasks = elementProgress.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);
  const truncatedDescription = truncateText(elementProgress["description"], 35);

  return `
    <div onclick="showBigTask('${elementProgress["id"]}')" 
         class="task_card_small" id="${elementProgress["id"]}" 
         draggable="true" ondragstart="startDrag('${elementProgress["id"]}')">

      <div class="task_card_small_content">

        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementProgress["id"]}">${elementProgress["art"]}</div>
        </div>

        <div class="title_desc_small_div">
          <div class="title_small">${elementProgress["title"]}</div>
          <div class="description_small">${truncatedDescription}</div>
        </div>

        ${subAmountHtml}

        <div class="assigned_prio_small">
          <div class="assigned_small">${renderAssignedContacts(
            elementProgress["assigned"]
          )}</div>
          <div class="prio_small" id="prio_small_${elementProgress["id"]}">${elementProgress["prio"]}</div>
        </div>

      </div>
    </div>
  `;
}

function renderTaskCardAwait(elementAwait) {
  const subtasks = elementAwait.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);
  const truncatedDescription = truncateText(elementAwait["description"], 35);

  return `
    <div onclick="showBigTask('${elementAwait["id"]}')" 
         class="task_card_small" id="${elementAwait["id"]}" 
         draggable="true" ondragstart="startDrag('${elementAwait["id"]}')">

      <div class="task_card_small_content">

        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementAwait["id"]}">${elementAwait["art"]}</div>
        </div>

        <div class="title_desc_small_div">
          <div class="title_small">${elementAwait["title"]}</div>
          <div class="description_small">${truncatedDescription}</div>
        </div>

        ${subAmountHtml}

        <div class="assigned_prio_small">
          <div class="assigned_small">${renderAssignedContacts(
            elementAwait["assigned"]
          )}</div>
          <div class="prio_small" id="prio_small_${elementAwait["id"]}">${elementAwait["prio"]}</div>
        </div>

      </div>
    </div>
  `;
}

function renderTaskCardDone(elementDone) {
  const subtasks = elementDone.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);
  const truncatedDescription = truncateText(elementDone["description"], 35);

  return `
    <div onclick="showBigTask('${elementDone["id"]}')" 
         class="task_card_small" id="${elementDone["id"]}" 
         draggable="true" ondragstart="startDrag('${elementDone["id"]}')">

      <div class="task_card_small_content">

        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementDone["id"]}">${elementDone["art"]}</div>
        </div>

        <div class="title_desc_small_div">
          <div class="title_small">${elementDone["title"]}</div>
          <div class="description_small">${truncatedDescription}</div>
        </div>

        ${subAmountHtml}

        <div class="assigned_prio_small">
          <div class="assigned_small">${renderAssignedContacts(
            elementDone["assigned"]
          )}</div>
          <div class="prio_small" id="prio_small_${elementDone["id"]}">${elementDone["prio"]}</div>
        </div>

      </div>
    </div>
  `;
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

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

function generateSubAmountHtml(subtasks) {
  const totalSubtasks = Object.keys(subtasks).length;
  const completedSubtasks = Object.values(subtasks).filter(
    (subtask) => subtask.completed
  ).length;
  return totalSubtasks > 0
    ? `
      <div class="sub_amount_small">

        <div class="subtasks_bar_small">
          <div class="subtasks_bar_fill" style="width: ${(completedSubtasks / totalSubtasks) * 100}%; background-color: #4589FF;"></div>
        </div>

        <div class="amount_subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</div>

      </div>
    `
    : "";
}

function renderBigTaskCard(bigelement) {
  return `
    <div id="big_card" class="big_card" data-task-id="${bigelement["id"]}">
      <div class="big_card_art_close">
      <div class="big_art" id="big_art_${bigelement["id"]}">${bigelement["art"]}</div>
      <div class="big_card_close" onclick="hideBigTask()"><img src="assets/img/close.svg"></div>
    </div>

    <div class="title_big">${bigelement["title"]}</div>
    <div class="big_description" id="big_description_${bigelement["description"]}">${bigelement["description"]}</div>
      
    <div class="big_due" id="big_due">
      <div class="big_due_date_txt" id="big_due_date_txt">Due date:</div>
      <div class="big_due_date" id="big_due_date">${formatDate(bigelement["due_date"])}</div>
    </div>

    <div class="big_prio">
      <div class="big_prio_txt" id="big_prio_txt">Priority:</div>
      <div class="big_prio_img" id="big_prio_img_${bigelement["id"]}"> ${bigelement["prio"]}</div>
    </div>

    <div class="big_assigned">
      <div class="big_assigned_txt">Assigned To:</div>
      <div class="assigned_div">${renderBigAssignedContacts(bigelement.assigned)}</div>
    </div>

    <div class="big_subs">
      <div class="big_subs_txt">Subtasks</div>
      <div class="subtasks_container">${renderSubtasks(bigelement.subtask, bigelement.id)}</div>
    </div>

    <div class="big_del_edit">

      <div class="big_del" onclick="deleteTask()">

        <div class="big_del_icon">
          <svg width="16" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.5 18C2.95 18 2.47917 17.8042 2.0875 17.4125C1.69583 17.0208 1.5 16.55 1.5 16V3C1.21667 3 0.979167 2.90417 0.7875 2.7125C0.595833 2.52083 0.5 2.28333 0.5 2C0.5 1.71667 0.595833 1.47917 0.7875 1.2875C0.979167 1.09583 1.21667 1 1.5 1H5.5C5.5 0.716667 5.59583 0.479167 5.7875 0.2875C5.97917 0.0958333 6.21667 0 6.5 0H10.5C10.7833 0 11.0208 0.0958333 11.2125 0.2875C11.4042 0.479167 11.5 0.716667 11.5 1H15.5C15.7833 1 16.0208 1.09583 16.2125 1.2875C16.4042 1.47917 16.5 1.71667 16.5 2C16.5 2.28333 16.4042 2.52083 16.2125 2.7125C16.0208 2.90417 15.7833 3 15.5 3V16C15.5 16.55 15.3042 17.0208 14.9125 17.4125C14.5208 17.8042 14.05 18 13.5 18H3.5ZM3.5 3V16H13.5V3H3.5ZM5.5 13C5.5 13.2833 5.59583 13.5208 5.7875 13.7125C5.97917 13.9042 6.21667 14 6.5 14C6.78333 14 7.02083 13.9042 7.2125 13.7125C7.40417 13.5208 7.5 13.2833 7.5 13V6C7.5 5.71667 7.40417 5.47917 7.2125 5.2875C7.02083 5.09583 6.78333 5 6.5 5C6.21667 5 5.97917 5.09583 5.7875 5.2875C5.59583 5.47917 5.5 5.71667 5.5 6V13ZM9.5 13C9.5 13.2833 9.59583 13.5208 9.7875 13.7125C9.97917 13.9042 10.2167 14 10.5 14C10.7833 14 11.0208 13.9042 11.2125 13.7125C11.4042 13.5208 11.5 13.2833 11.5 13V6C11.5 5.71667 11.4042 5.47917 11.2125 5.2875C11.0208 5.09583 10.7833 5 10.5 5C10.2167 5 9.97917 5.09583 9.7875 5.2875C9.59583 5.47917 9.5 5.71667 9.5 6V13Z" fill="currentColor"/>
          </svg>
        </div>
        
          <span class="delspan">Delete</span>

      </div>

        <img src="assets/img/line.svg">

    <div class="big_edit" onclick="editTask('${bigelement["id"]}')">
      <div class="big_edit_icon">
        <svg width="18" height="18" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 17H3.9L12.525 8.375L11.125 6.975L2.5 15.6V17ZM16.8 6.925L12.55 2.725L13.95 1.325C14.3333 0.941667 14.8042 0.75 15.3625 0.75C15.9208 0.75 16.3917 0.941667 16.775 1.325L18.175 2.725C18.5583 3.10833 18.7583 3.57083 18.775 4.1125C18.7917 4.65417 18.6083 5.11667 18.225 5.5L16.8 6.925ZM15.35 8.4L4.75 19H0.5V14.75L11.1 4.15L15.35 8.4Z" fill="currentColor"/>
        </svg>
      </div>
        <span class="editspan">Edit</span>

      </div>
    </div>

    </div>
  `;
}

function renderSubtasks(subtasks, taskId) {
  if (!subtasks || typeof subtasks !== "object") {
    return `<span class="subtask_title"></span>`;
  }

  return Object.keys(subtasks)
    .map((key, index) => {
      const subtask = subtasks[key];
      const checkboxSrc = subtask.completed
        ? "assets/img/checkbox-checked.png"
        : "assets/img/checkbox.png";
      return `
        <div class="subtask_item" id="subtask_${taskId}_${index}">
          <img src="${checkboxSrc}" class="subtask_checkbox" id="subtask_checkbox_${taskId}_${index}" onclick="toggleSubtask('${taskId}', ${index})">
          <span class="subtask_title">${subtask.title}</span>
        </div>
      `;
    })
    .join("");
}

async function toggleSubtask(taskId, subtaskIndex) {
  try {
    const taskResponse = await fetch(`${TASKS_URL}/${taskId}.json`);
    const taskData = await taskResponse.json();
    const subtaskKey = `subtask${subtaskIndex + 1}`;
    const subtask = taskData.subtask?.[subtaskKey];
    if (!subtask) {
      console.error(`Subtask ${subtaskKey} not found.`);
      return;
    }

    subtask.completed = !subtask.completed;

    const checkboxImage = document.getElementById(
      `subtask_checkbox_${taskId}_${subtaskIndex}`
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

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function renderNoTasksToDo() {
  return `
    <div class="no_tasks"><div class="no_tasks_txt">No tasks To do</div></div>
  `;
}

function renderNoTasksProgress() {
  return `
    <div class="no_tasks"><div class="no_tasks_txt">No tasks in Progress</div></div>
  `;
}

function renderNoTasksAwait() {
  return `
    <div class="no_tasks"><div class="no_tasks_txt">No feedback awaited</div></div>
  `;
}

function renderNoTaskDone() {
  return `
    <div class="no_tasks"><div class="no_tasks_txt">No tasks Done</div></div>
  `;
}