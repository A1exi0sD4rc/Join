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
                  value="${renderAssignedContacts(taskData.assigned)}"
                />
                <div id="contact_list" class="contact_list">
                  <div id="contacts_container" class="scrollable_container"></div>
                </div>
                <div id="selected_contacts" class="selected-contacts-container"></div>
              </div>
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
  
              <label class="aT_input_labels">Priority</label>
              <select id="aT_priority">
                <option value="Low" ${
                  taskData.prio === "Low" ? "selected" : ""
                }>Low</option>
                <option value="Medium" ${
                  taskData.prio === "Medium" ? "selected" : ""
                }>Medium</option>
                <option value="High" ${
                  taskData.prio === "High" ? "selected" : ""
                }>High</option>
              </select>
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
