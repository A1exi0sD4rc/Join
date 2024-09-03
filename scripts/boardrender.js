function renderTaskCardToDo(elementToDo) {
  return `
        <div class="task_card_small" draggable="true" ondragstart="startDrag(${elementToDo['id']})">
            
        <div class="task_card_small_content">

                <div class="art_task_small"><div class="art_small" id="art_small_${elementToDo['id']}">${elementToDo['art']}</div></div>

                <div class="title_desc_small_div">
                  <div class="title_small">${elementToDo['title']}</div>
                  <div class="description_small">${elementToDo['description']}</div>
                </div>

                <div class="sub_amount_small">
                  <div class="subtasks_bar_small"></div>
                  <div class="amount_subtasks">0/0 Subtasks</div>
                </div>

                <div class="assigned_prio_small">
                  <div class="assigned_small"></div>
                  <div class="prio_small" id="prio_small_${elementToDo['id']}"></div>
                </div> 

            </div>

        </div>
    `;
}


function renderTaskCardProgress(elementProgress) {
  return `
        <div class="task_card_small" draggable="true" ondragstart="startDrag(${elementProgress['id']})">
            <div class="task_card_small_content">
            
                <div class="art_task_small"><div class="art_small" id="art_small_${elementProgress['id']}">${elementProgress['art']}</div></div>

                <div class="title_desc_small_div">
                  <div class="title_small">${elementProgress['title']}</div>
                  <div class="description_small">${elementProgress['description']}</div>
                </div>

                <div class="sub_amount_small">
                  <div class="subtasks_bar_small"></div>
                  <div class="amount_subtasks">0/0 Subtasks</div>
                </div>

                <div class="assigned_prio_small">
                  <div class="assigned_small"></div>
                  <div class="prio_small" id="prio_small_${elementProgress['id']}"></div>
                </div>

            </div>
        </div>
    `;
}


function renderTaskCardAwait(elementAwait) {
  return `
        <div class="task_card_small" draggable="true" ondragstart="startDrag(${elementAwait['id']})">
            <div class="task_card_small_content">
            
                <div class="art_task_small"><div class="art_small" id="art_small_${elementAwait['id']}">${elementAwait['art']}</div></div>

                <div class="title_desc_small_div">
                  <div class="title_small">${elementAwait['title']}</div>
                  <div class="description_small">${elementAwait['description']}</div>
                </div>

                <div class="sub_amount_small">
                  <div class="subtasks_bar_small"></div>
                  <div class="amount_subtasks">0/0 Subtasks</div>
                </div>

                <div class="assigned_prio_small">
                  <div class="assigned_small"></div>
                  <div class="prio_small" id="prio_small_${elementAwait['id']}"></div>
                </div>

            </div>
        </div>
    `;
}


function renderTaskCardDone(elementDone) {
  return `
        <div class="task_card_small" draggable="true" ondragstart="startDrag(${elementDone['id']})">
            <div class="task_card_small_content">
            
                <div class="art_task_small"><div class="art_small" id="art_small_${elementDone['id']}">${elementDone['id']}</div></div>

                <div class="title_desc_small_div">
                  <div class="title_small">${elementDone['id']}</div>
                  <div class="description_small">${elementDone['id']}</div>
                </div>

                <div class="sub_amount_small">
                  <div class="subtasks_bar_small"></div>
                  <div class="amount_subtasks">0/0 Subtasks</div>
                </div>

                <div class="assigned_prio_small">
                  <div class="assigned_small"></div>
                  <div class="prio_small" id="prio_small_${elementDone['id']}"></div>
                </div>

            </div>             
        </div>
    `;
}