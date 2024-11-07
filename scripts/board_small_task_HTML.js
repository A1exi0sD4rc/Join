/**
 * creates and returns HTML for a task card, displaying the task's title,
 * truncated description, subtasks, assigned contacts, and priority.
 * @param {*} elementToDo
 * @returns
 */
function renderTaskCardToDo(elementToDo) {
  const subtasks = elementToDo.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);
  const truncatedDescription = truncateText(elementToDo["description"], 35);

  return `
      <div onclick="showBigTask('${elementToDo["id"]}')" 
           class="task_card_small" id="${elementToDo["id"]}" 
           draggable="true" ondragstart="startDrag('${elementToDo["id"]}')">
  
        <div class="task_card_small_content">
  
        <div class="arrow_container">
            ${renderArrows(elementToDo["category"], elementToDo["id"])}
          </div>
  
          <div class="art_task_small">
            <div class="art_small" id="art_small_${elementToDo["id"]}">${
    elementToDo["art"]
  }</div>
          </div>
  
        <div class="title_desc_small_div">
          <div class="title_small">${elementToDo["title"]}</div>
          <div class="description_small">${truncatedDescription}</div>
        </div>
  
          ${subAmountHtml}
  
      <div class="assigned_prio_small">
        <div class="assigned_small">${renderAssignedContacts(
          elementToDo["assigned"]
        )}</div>
        <div class="prio_small" id="prio_small_${elementToDo["id"]}">${
    elementToDo["prio"]
  }</div>
      </div>
  
        </div>
      </div>
    `;
}

/**
 * creates HTML for a task card, displaying the title, description, subtasks, assigned contacts, and priority.
 * @param {*} elementProgress
 * @returns
 */
function renderTaskCardProgress(elementProgress) {
  const subtasks = elementProgress.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);
  const truncatedDescription = truncateText(elementProgress["description"], 35);

  return `
      <div onclick="showBigTask('${elementProgress["id"]}')" 
           class="task_card_small" id="${elementProgress["id"]}" 
           draggable="true" ondragstart="startDrag('${elementProgress["id"]}')">
  
        <div class="task_card_small_content">
  
        <div class="arrow_container">
            ${renderArrows(elementProgress["category"], elementProgress["id"])}
          </div>
  
          <div class="art_task_small">
            <div class="art_small" id="art_small_${elementProgress["id"]}">${
    elementProgress["art"]
  }</div>
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
            <div class="prio_small" id="prio_small_${elementProgress["id"]}">${
    elementProgress["prio"]
  }</div>
          </div>
  
        </div>
      </div>
    `;
}

/**
 * generates HTML for a task card, showing the title,
 * a truncated description, subtasks, assigned contacts, and priority.
 * @param {*} elementAwait
 * @returns
 */
function renderTaskCardAwait(elementAwait) {
  const subtasks = elementAwait.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);
  const truncatedDescription = truncateText(elementAwait["description"], 35);

  return `
      <div onclick="showBigTask('${elementAwait["id"]}')" 
           class="task_card_small" id="${elementAwait["id"]}" 
           draggable="true" ondragstart="startDrag('${elementAwait["id"]}')">
  
        <div class="task_card_small_content">
  
        <div class="arrow_container">
            ${renderArrows(elementAwait["category"], elementAwait["id"])}
          </div>
  
          <div class="art_task_small">
            <div class="art_small" id="art_small_${elementAwait["id"]}">${
    elementAwait["art"]
  }</div>
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
            <div class="prio_small" id="prio_small_${elementAwait["id"]}">${
    elementAwait["prio"]
  }</div>
          </div>
  
        </div>
      </div>
    `;
}

/**
 * creates HTML for a completed task card, displaying the title,
 * a truncated description, subtasks, assigned contacts, and priority.
 * @param {*} elementDone
 * @returns
 */
function renderTaskCardDone(elementDone) {
  const subtasks = elementDone.subtask || {};
  const subAmountHtml = generateSubAmountHtml(subtasks);
  const truncatedDescription = truncateText(elementDone["description"], 35);

  return `
      <div onclick="showBigTask('${elementDone["id"]}')" 
           class="task_card_small" id="${elementDone["id"]}" 
           draggable="true" ondragstart="startDrag('${elementDone["id"]}')">
  
        <div class="task_card_small_content">
  
        <div class="arrow_container">
            ${renderArrows(elementDone["category"], elementDone["id"])}
          </div>
  
          <div class="art_task_small">
            <div class="art_small" id="art_small_${elementDone["id"]}">${
    elementDone["art"]
  }</div>
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
            <div class="prio_small" id="prio_small_${elementDone["id"]}">${
    elementDone["prio"]
  }</div>
          </div>
  
        </div>
      </div>
    `;
}
