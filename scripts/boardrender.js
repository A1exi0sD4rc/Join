function renderTaskCardToDo(elementToDo) {
  return `
    <div onclick="showBigTask('${elementToDo["id"]}')" class="task_card_small" id="${elementToDo["id"]}" draggable="true" ondragstart="startDrag('${elementToDo["id"]}')">
      <div class="task_card_small_content">
        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementToDo["id"]}">${elementToDo["art"]}</div>
        </div>
        <div class="title_desc_small_div">
          <div class="title_small">${elementToDo["title"]}</div>
          <div class="description_small">${elementToDo["description"]}</div>
        </div>
        <div class="sub_amount_small">
          <div class="subtasks_bar_small"></div>
          <div class="amount_subtasks">0/0 Subtasks</div>
        </div>
        <div class="assigned_prio_small">
          <div class="assigned_small"></div>
          <div class="prio_small" id="prio_small_${elementToDo["id"]}"></div>
        </div>
      </div>
    </div>
  `;
}


function renderTaskCardProgress(elementProgress) {
  return `
        <div onclick="showBigTask('${elementProgress["id"]}')" class="task_card_small" id="${elementProgress["id"]}" draggable="true" ondragstart="startDrag('${elementProgress["id"]}')">
      <div class="task_card_small_content">
        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementProgress["id"]}">${elementProgress["art"]}</div>
        </div>
        <div class="title_desc_small_div">
          <div class="title_small">${elementProgress["title"]}</div>
          <div class="description_small">${elementProgress["description"]}</div>
        </div>
        <div class="sub_amount_small">
          <div class="subtasks_bar_small"></div>
          <div class="amount_subtasks">0/0 Subtasks</div>
        </div>
        <div class="assigned_prio_small">
          <div class="assigned_small"></div>
          <div class="prio_small" id="prio_small_${elementProgress["id"]}"></div>
        </div>
      </div>
    </div>
    `;
}


function renderTaskCardAwait(elementAwait) {
  return `
        <div onclick="showBigTask('${elementAwait["id"]}')" class="task_card_small" id="${elementAwait["id"]}" draggable="true" ondragstart="startDrag('${elementAwait["id"]}')">
      <div class="task_card_small_content">
        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementAwait["id"]}">${elementAwait["art"]}</div>
        </div>
        <div class="title_desc_small_div">
          <div class="title_small">${elementAwait["title"]}</div>
          <div class="description_small">${elementAwait["description"]}</div>
        </div>
        <div class="sub_amount_small">
          <div class="subtasks_bar_small"></div>
          <div class="amount_subtasks">0/0 Subtasks</div>
        </div>
        <div class="assigned_prio_small">
          <div class="assigned_small"></div>
          <div class="prio_small" id="prio_small_${elementAwait["id"]}"></div>
        </div>
      </div>
    </div>
    `;
}


function renderTaskCardDone(elementDone) {
  return `
        <div onclick="showBigTask('${elementDone["id"]}')" class="task_card_small" id="${elementDone["id"]}" draggable="true" ondragstart="startDrag('${elementDone["id"]}')">
      <div class="task_card_small_content">
        <div class="art_task_small">
          <div class="art_small" id="art_small_${elementDone["id"]}">${elementDone["art"]}</div>
        </div>
        <div class="title_desc_small_div">
          <div class="title_small">${elementDone["title"]}</div>
          <div class="description_small">${elementDone["description"]}</div>
        </div>
        <div class="sub_amount_small">
          <div class="subtasks_bar_small"></div>
          <div class="amount_subtasks">0/0 Subtasks</div>
        </div>
        <div class="assigned_prio_small">
          <div class="assigned_small"></div>
          <div class="prio_small" id="prio_small_${elementDone["id"]}"></div>
        </div>
      </div>
    </div>
    `;
}


function renderBigTaskCard(bigelement) {
  return `
    <div id="big_card" class="big_card">

      <div class="big_card_art_close">
        <div class="big_art" id="big_art_${bigelement["id"]}">${bigelement["art"]}</div>
        <div class="big_card_close" onclick="hideBigTask()"><img src="assets/img/close.svg"></div>
      </div>

      <div class="title_big">${bigelement["title"]}</div>
      <div class="big_description" id="big_description_${bigelement["description"]}">${bigelement["description"]}</div>

      <div class="big_due" id="big_due">
        <div class="big_due_date_txt" id="big_due_date_txt">Due date:</div>
        <div class="big_due_date" id="big_due_date"></div>
      </div>

      <div class="big_prio">
        <div class="big_prio_txt" id="big_prio_txt">Priority:</div>
        <div class="big_prio_img" id="big_prio_img_${bigelement["id"]}"> ${bigelement["prio"]}</div>
      </div>

      <div class="big_assigned">

        <div class="big_assigned_txt">Assigned To:</div>

        <div class="assigned_div">
          <div class="big_assigned_user">
            <div class="assigned_logo_name">
              <div class="assigned_big_logo" id="assigned_big_logo"> LOGO HERE </div>
              <div class="assigned_big_name" id="assigned_big_name"> NAME HERE </div>
            </div>
          </div>
        </div>

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
