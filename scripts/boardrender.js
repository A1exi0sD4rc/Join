function renderTaskCardToDo(elementToDo) {
  const subtasks = elementToDo.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);

  return `
    <div onclick="showBigTask('${
      elementToDo["id"]
    }')" class="task_card_small" id="${
    elementToDo["id"]
  }" draggable="true" ondragstart="startDrag('${elementToDo["id"]}')">
      <div class="task_card_small_content">
        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementToDo["id"]}">${
    elementToDo["art"]
  }</div>
        </div>
        <div class="title_desc_small_div">
          <div class="title_small">${elementToDo["title"]}</div>
          <div class="description_small">${elementToDo["description"]}</div>
        </div>
        ${subAmountHtml}
        <div class="assigned_prio_small">
          <div class="assigned_small">
            ${renderAssignedContacts(elementToDo["assigned"])}
          </div>
          <div class="prio_small" id="prio_small_${elementToDo["id"]}">${
    elementToDo["prio"]
  }</div>
        </div>
      </div>
    </div>
  `;
}

function renderTaskCardProgress(elementProgress) {
  const subtasks = elementProgress.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);

  return `
    <div onclick="showBigTask('${
      elementProgress["id"]
    }')" class="task_card_small" id="${
    elementProgress["id"]
  }" draggable="true" ondragstart="startDrag('${elementProgress["id"]}')">
      <div class="task_card_small_content">
        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementProgress["id"]}">${
    elementProgress["art"]
  }</div>
        </div>
        <div class="title_desc_small_div">
          <div class="title_small">${elementProgress["title"]}</div>
          <div class="description_small">${elementProgress["description"]}</div>
        </div>
        ${subAmountHtml}
        <div class="assigned_prio_small">
          <div class="assigned_small">
            ${renderAssignedContacts(elementProgress["assigned"])}
          </div>
          <div class="prio_small" id="prio_small_${elementProgress["id"]}">${
    elementProgress["prio"]
  }</div>
        </div>
      </div>
    </div>
  `;
}

function renderTaskCardAwait(elementAwait) {
  const subtasks = elementAwait.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);

  return `
    <div onclick="showBigTask('${
      elementAwait["id"]
    }')" class="task_card_small" id="${
    elementAwait["id"]
  }" draggable="true" ondragstart="startDrag('${elementAwait["id"]}')">
      <div class="task_card_small_content">
        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementAwait["id"]}">${
    elementAwait["art"]
  }</div>
        </div>
        <div class="title_desc_small_div">
          <div class="title_small">${elementAwait["title"]}</div>
          <div class="description_small">${elementAwait["description"]}</div>
        </div>
        ${subAmountHtml}
        <div class="assigned_prio_small">
          <div class="assigned_small">
            ${renderAssignedContacts(elementAwait["assigned"])}
          </div>
          <div class="prio_small" id="prio_small_${elementAwait["id"]}">${
    elementAwait["prio"]
  }</div>
        </div>
      </div>
    </div>
  `;
}

function renderTaskCardDone(elementDone) {
  const subtasks = elementDone.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);

  return `
    <div onclick="showBigTask('${
      elementDone["id"]
    }')" class="task_card_small" id="${
    elementDone["id"]
  }" draggable="true" ondragstart="startDrag('${elementDone["id"]}')">
      <div class="task_card_small_content">
        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementDone["id"]}">${
    elementDone["art"]
  }</div>
        </div>
        <div class="title_desc_small_div">
          <div class="title_small">${elementDone["title"]}</div>
          <div class="description_small">${elementDone["description"]}</div>
        </div>
        ${subAmountHtml}
        <div class="assigned_prio_small">
          <div class="assigned_small">
            ${renderAssignedContacts(elementDone["assigned"])}
          </div>
          <div class="prio_small" id="prio_small_${elementDone["id"]}">${
    elementDone["prio"]
  }</div>
        </div>
      </div>
    </div>
  `;
}

function renderAssignedContacts(assigned) {
  return assigned
    .map((contact) => {
      let initials = getInitials(contact.name.replace(" (You)", ""));
      return `
      <div class="assigned-contact" style="position: relative; display: inline-block;">
        <svg width="36" height="36" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
          <text x="20" y="26" text-anchor="middle" font-size="16" font-weight="400" fill="white">${initials}</text>
        </svg>
      </div>
    `;
    })
    .join("");
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
        <div class="subtasks_bar_fill" style="width: ${
          (completedSubtasks / totalSubtasks) * 100
        }%; background-color: #4589FF;"></div>
      </div>
      <div class="amount_subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</div>
    </div>
  `
    : "";
}

function renderBigTaskCard(bigelement) {
  return `
    <div id="big_card" class="big_card">

      <div class="big_card_art_close">
        <div class="big_art" id="big_art_${bigelement["id"]}">${
    bigelement["art"]
  }</div>
        <div class="big_card_close" onclick="hideBigTask()"><img src="assets/img/close.svg"></div>
      </div>

      <div class="title_big">${bigelement["title"]}</div>
      <div class="big_description" id="big_description_${
        bigelement["description"]
      }">${bigelement["description"]}</div>
      
      <div class="big_due" id="big_due">
        <div class="big_due_date_txt" id="big_due_date_txt">Due date:</div>
        <div class="big_due_date" id="big_due_date">${formatDate(
          bigelement["due_date"]
        )}</div>
      </div>

      <div class="big_prio">
        <div class="big_prio_txt" id="big_prio_txt">Priority:</div>
        <div class="big_prio_img" id="big_prio_img_${bigelement["id"]}"> ${
    bigelement["prio"]
  }</div>
      </div>

      <div class="big_assigned">
        <div class="big_assigned_txt">Assigned To:</div>
        <div class="assigned_div">${renderBigAssignedContacts(
          bigelement.assigned
        )}</div>
      </div>


      <div class="big_subs">
        <div class="big_subs_txt">Subtasks</div>
        <div></div>
      </div>

      <div class="big_del_edit">
        <div class="big_del">
          <div class="big_del_icon"><img class="big_del_icon" src="assets/img/delete.svg"></div>
          <div class="big_del_txt">Delete</div>
        </div>
        <img src="assets/img/line.svg">
        <div class="big_edit">
          <div class="big_edit_icon_div"><img class="big_edit_icon" src="assets/img/edit.svg"></div>
          <div class="big_edit_txt">Edit</div>
        </div>
      </div>

    </div>
  `;
}

function renderBigAssignedContacts(assigned) {
  return assigned
    .map((contact) => {
      let displayName = contact.name.replace(" (You)", "");
      let initials = getInitials(displayName);
      return `
        <div class="big_assigned_user">
          <div class="assigned_logo_name">
            <svg width="36" height="36" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
              <text x="20" y="26" text-anchor="middle" font-size="16" font-weight="400" fill="white">${initials}</text>
            </svg>
            <div class="assigned_big_name">${displayName}</div>
          </div>
        </div>
      `;
    })
    .join("");
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
