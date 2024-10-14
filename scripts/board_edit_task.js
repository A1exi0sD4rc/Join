async function editTask(taskId) {
  try {
    const taskResponse = await fetch(`${TASKS_URL}/${taskId}.json`);
    const taskData = await taskResponse.json();

    document.getElementById("big_card").innerHTML = "";
    document.getElementById("big_card").innerHTML = `
        <form id="editForm" class="form_area_edit">
          <div class="big_card_close_edit" onclick="hideBigTask()">
            <img src="assets/img/close.svg">
          </div>
          <div class="add_task_fillIn_section_edit">
            <div class="add_task_form_left_edit">
              <label class="aT_input_labels" for="aT_title">Title</label>
              <div class="title_input_error_container">
                <input
                  required
                  class="aT_input_title aT_unset"
                  type="text"
                  id="aT_title"
                  name="title"
                  maxlength="50"
                  value="${taskData.title || ""}"
                  placeholder="Enter a title"
                />
                <span id="titleError" class="error">This field is required</span>
              </div>
              <label class="aT_input_labels" for="aT_description">Description</label>
              <div class="resizable-container">
                <textarea
                  id="aT_description"
                  class="resizable-textarea"
                  placeholder="Enter a Description"
                >${taskData.description || ""}</textarea>
              </div>
              
              <label class="aT_input_labels">Assigned to</label>
             <div class="aT_select_container">
  <input
    id="aT_select_contacts"
    class="aT_select_dropdown_fields"
    placeholder="Select contacts to assign"
    onclick="toggleDropdown(event)"
  />
  <div
    id="select_contacts_arrow_container"
    class="drop_down_arrow_container"
    onclick="toggleDropdown(event)"
  >
    <img
      src="./assets/img/arrow_drop_down.svg"
      alt="drop_down_arrow"
      class="arrow"
    />
  </div>
</div>

              <div id="contact_list" class="contact_list d-none">
                <div id="contacts_container" class="scrollable_container"></div>
              </div>

              <div
                id="selected_contacts"
                class="selected-contacts-container"
              ></div>
  
            <div class="add_task_seperator_edit"></div>

            <div class="add_task_form_right">
              <label class="aT_input_labels" for="aT_date">Due date</label>
              <div class="date_error_container">
                <input
                  required
                  id="aT_date"
                  class="aT_input_date"
                  type="date"
                  value="${taskData.due_date || ""}"
                />
                <span id="dateError" class="error">This field is required</span>
              </div>

              <div class="aT_set_prio_container" id="aT_set_prio">
                <div
                  class="aT_set_prio"
                  id="boxUrgent"
                  onclick="activateBox('boxUrgent', 'urgent_box_active')"
                >
                  <span>Urgent</span>
                  <img src="./assets/img/Prio_high.svg" alt="urgent_icon" />
                </div>
                <div
                  class="aT_set_prio"
                  id="boxMedium"
                  onclick="activateBox('boxMedium', 'medium_box_active')"
                >
                  <span>Medium</span>
                  <img src="./assets/img/Prio_med.svg" alt="medium_icon" />
                </div>
                <div
                  class="aT_set_prio"
                  id="boxLow"
                  onclick="activateBox('boxLow', 'low_box_active')"
                >
                  <span>Low</span>
                  <img src="./assets/img/Prio_low.svg" alt="low_icon" />
                </div>
              </div>

              <label class="aT_input_labels">Category</label>
              <div class="category_subtasks_container">
               <div class="category_input_dropdown_error_container">
                  <div class="aT_select_container">
                    <div
                      id="aT_select_category"
                      class="aT_select_dropdown_fields"
                    >
                    ${taskData.art || ""}
                    </div>
                    <div
                      id="select_category_arrow_container"
                      class="drop_down_arrow_container"
                    >
                      <img
                        src="./assets/img/arrow_drop_down.svg"
                        alt="drop_down_arrow"
                        class="arrow"
                      />
                    </div>
                  </div>
                  <div id="category_list" class="category_list d-none">
                    <div>
                      <div class="categories">Technical Task</div>
                      <div class="categories">User Story</div>
                    </div>
                  </div>
                  <span id="categoryError" class="error"
                    >Please select a category for your task.</span
                  >
                </div>
                <div class="subtasks_input_subs_container">
                  <label class="aT_label_subtasks">Subtasks</label>
                  <div class="aT_select_container">
                    <input
                      id="aT_add_subtasks"
                      maxlength="100"
                      class="aT_input_addSubtask aT_unset"
                      placeholder="Add new subtask"
                    />
                    <div
                      id="aktive_input_addSubtask"
                      class="drop_down_arrow_container"
                    >
                      <img
                        class="add_subtasks_plus_icon"
                        src="./assets/img/add_subtasks_plus_icon.svg"
                        alt="plus_icon"
                      />
                    </div>
                    <div
                      id="close_and_check_btns"
                      class="close_check_container d-none"
                    >
                      <div
                        id="cancel_input_subtasks"
                        class="c_icon_container"
                        onclick="cancel_input_subtask()"
                      >
                        <img
                          class="add_subtasks_close_icon"
                          src="./assets/img/add_subtasks_close_icon.svg"
                          alt="close_icon"
                        />
                      </div>
                      <div class="seperator_close_check"></div>
                      <div id="check_input_subtask" class="c_icon_container">
                        <img
                          class="add_subtasks_check_icon"
                          src="./assets/img/add_subtasks_check_icon.svg"
                          alt="check_icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    class="aT_subtasks_container"
                    id="created_subtasks"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="big_save_cancel_buttons edit_button" onclick="saveEditedTaskToDatabase('${taskId}')">
            <div>Ok</div>
            <img src="./assets/img/create_task_white.svg" alt="edit_ok" class="create_img">
          </div>
        </form>
    `;

    populateEditForm(taskData);
  } catch (error) {
    console.error("Error loading task for editing:", error);
  }
}

function populateEditForm(task) {
  document.getElementById("aT_title").value = task.title;
  document.getElementById("aT_description").value = task.description;
  document.getElementById("aT_date").value = task.due_date;
  document.getElementById("aT_select_category").innerHTML = task.category;
  setPriority(task.prio);

  subtasks = [];
  for (const [key, subtask] of Object.entries(task.subtask)) {
    addSubtaskToArray(subtask.title, key);
    const newListHTML = createSubtaskHTML(subtask.title, key);
    appendSubtaskToList(newListHTML);
  }

  selectedContacts = task.assigned;
  displaySelectedContacts();
}

function setPriority(prio) {
  deactivateAll();
  if (prio === "Urgent") {
    activateBox("boxUrgent", "urgent_box_active");
  } else if (prio === "Medium") {
    activateBox("boxMedium", "medium_box_active");
  } else if (prio === "Low") {
    activateBox("boxLow", "low_box_active");
  }
}

async function saveEditedTaskToDatabase(taskId) {
  const updatedTask = collectTaskData();
  try {
    const response = await fetch(`${TASKS_URL}/${taskId}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      throw new Error("Error updating task");
    }

    console.log("Task successfully updated");
    goToBoard();
  } catch (error) {
    console.error("Network error:", error);
  }
}
