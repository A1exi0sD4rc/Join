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
          <div class="add_task_fillIn_section">
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
    value="${
      selectedContacts.length > 0
        ? selectedContacts.length + " contacts selected"
        : ""
    }"
    readonly
  />
  <div id="contact_list" class="contact_list">
    <div id="contacts_container" class="scrollable_container"></div>
  </div>
  <div id="selected_contacts" class="selected-contacts-container"></div>
</div>
  
            <div class="add_task_seperator_edit"></div>
            <div class="add_task_form_right">
              <label class="aT_input_labels" for="aT_due_date">Due Date</label>
              <input
                type="date"
                id="aT_due_date"
                name="due_date"
                value="${taskData.due_date || ""}"
              />
  
               <div class="aT_set_prio_container" id="aT_set_prio">
                <div
                  class="aT_set_prio"
                  id="boxUrgent"
                  onclick="activateBox('boxUrgent', 'urgent_box_active')"
                >
                  <span>Urgent</span
                  ><img src="./assets/img/Prio_high.svg" alt="urgent_icon" />
                </div>
                <div
                  class="medium_box_active"
                  id="boxMedium"
                  onclick="activateBox('boxMedium', 'medium_box_active')"
                >
                  <span>Medium</span
                  ><img src="./assets/img/Prio_med.svg" alt="medium_icon" />
                </div>
                <div
                  class="aT_set_prio"
                  id="boxLow"
                  onclick="activateBox('boxLow', 'low_box_active')"
                >
                  <span>Low</span
                  ><img src="./assets/img/Prio_low.svg" alt="low_icon" />
                </div>
              </div>

              <label class="aT_input_labels">Category<sup>*</sup></label>
              <div class="category_subtasks_container">
                <div class="category_input_dropdown_error_container">
                  <div class="aT_select_container">
                    <div
                      id="aT_select_category"
                      class="aT_select_dropdown_fields"
                    >
                      Select task category
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
            
  
          <div class="big_save_cancel_buttons">
            <button type="button" onclick="saveTaskChanges('${taskId}')">Ok</button>
          </div>
        </form>
      `;

    populateContactList(taskData.assigned);
  } catch (error) {
    console.error("Error loading task for editing:", error);
  }
}

async function saveTaskChanges(taskId) {
  try {
    const updatedTitle = document.getElementById("aT_title").value;
    const updatedDescription = document.getElementById("aT_description").value;
    const updatedDueDate = document.getElementById("aT_due_date").value;
    const updatedPriority = document.getElementById("aT_priority").value;
    const assignedContacts = getSelectedContacts();

    const updatedTaskData = {
      title: updatedTitle,
      description: updatedDescription,
      due_date: updatedDueDate,
      prio: updatedPriority,
      assigned: assignedContacts,
    };

    await updateTaskInDatabase({ ...updatedTaskData, id: taskId });

    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (taskToUpdate) {
      Object.assign(taskToUpdate, updatedTaskData);
      renderTaskCard(taskToUpdate);
    }

    hideBigTask();
  } catch (error) {
    console.error("Error saving task changes:", error);
  }
}
