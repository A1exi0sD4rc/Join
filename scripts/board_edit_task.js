/**
 * Retrieves a task by its ID, fills the form with its details and prepares it for processing.
 * @param {*} taskId
 */
async function editTask(taskId) {
  try {
    const taskResponse = await fetch(`${TASKS_URL}/${taskId}.json`);
    const taskData = await taskResponse.json();
    await getContacts();
    currentTaskId = taskId;
    selectedContacts = taskData.assigned || [];
    taskCategory = taskData.category || "todo";

    document.getElementById("big_card").innerHTML = `
        <form id="editForm" class="form_area_edit">
          <div class="big_card_close_edit" onclick="hideBigTask()">
            <img src="assets/img/close.svg">
          </div>

          <!-- Title Input -->
          <div class="add_task_fillIn_section_edit">
            <div class="add_task_form_left_edit">
              <label class="aT_input_labels" for="aT_title">Title</label>
              <div class="title_input_error_container">
                <input
                  required
                  class="aT_input_title aT_unset"
                  type="text"
                  id="aT_title_edit"
                  name="title"
                  maxlength="50"
                  value="${taskData.title || ""}"
                  placeholder="Enter a title"
                />
                <span id="titleError" class="error">This field is required</span>
              </div>

              <!-- Description Input -->
              <label class="aT_input_labels" for="aT_description">Description</label>
              <div class="resizable-container">
                <textarea
                  id="aT_description_edit"
                  class="resizable-textarea"
                  placeholder="Enter a description"
                >${taskData.description || ""}</textarea>
              </div>

              <!-- Assigned Contacts Dropdown -->
              <label class="aT_input_labels">Assigned to</label>
              <div class="aT_select_container">
              <input id="aT_select_contacts_edit" class="aT_select_dropdown_fields"
                placeholder="Select contacts to assign" autocomplete="off" onclick="toggleDropdownEdit(event)" oninput="filterContactsEdit()"/>
              <div id="select_contacts_arrow_container_edit" class="drop_down_arrow_container" tabindex="0" onclick="toggleDropdownEdit(event)">
                <img src="./assets/img/arrow_drop_down.svg" alt="drop_down_arrow" class="arrow" />
              </div>
            </div>


              <!-- Contact List and Selected Contacts -->
              <div id="contact_list_edit" class="contact_list d-none">
              <div id="contacts_container_edit" class="scrollable_container scrollable_container_overlay"></div>
            </div>

            <div id="selected_contacts_edit" class="selected-contacts-container">${renderSelectedContactsFromDatabase(
              taskData.assigned
            )}</div>

              <!-- Right Side: Date, Priority, Category, Subtasks -->
              <div class="add_task_form_right">
                <!-- Due Date Input -->
                <label class="aT_input_labels" for="aT_date">Due date</label>
                <div class="date_error_container">
                  <input
                    required
                    id="aT_date_edit"
                    class="aT_input_date"
                    type="date"
                    value="${taskData.due_date || ""}"
                  />
                  <span id="dateError" class="error">This field is required</span>
                </div>

                <!-- Priority Options -->
                <div class="aT_set_prio_container" id="aT_set_prio">
                  <div class="aT_set_prio" id="boxUrgentEdit" onclick="activateBoxEdit('boxUrgentEdit', 'urgent_box_active')">
                    <span>Urgent</span>
                    <img src="./assets/img/Prio_high.svg" alt="urgent_icon" />
                  </div>
                  <div class="aT_set_prio" id="boxMediumEdit" onclick="activateBoxEdit('boxMediumEdit', 'medium_box_active')">
                    <span>Medium</span>
                    <img src="./assets/img/Prio_med.svg" alt="medium_icon" />
                  </div>
                  <div class="aT_set_prio" id="boxLowEdit" onclick="activateBoxEdit('boxLowEdit', 'low_box_active')">
                    <span>Low</span>
                    <img src="./assets/img/Prio_low.svg" alt="low_icon" />
                  </div>
                </div>

                <!-- Category Dropdown -->
                <label class="aT_input_labels">Category</label>
                <div class="category_subtasks_container">
                  <div class="category_input_dropdown_error_container">
                    <div class="aT_select_container">
                      <div id="aT_select_category_edit" class="aT_select_dropdown_fields" onclick="toggleCategoryEdit(event)">
                        ${taskData.art || ""}
                      </div>
                      <div id="select_category_arrow_container_edit" class="drop_down_arrow_container" onclick="toggleCategoryEdit(event)">
                        <img src="./assets/img/arrow_drop_down.svg" alt="drop_down_arrow" class="arrow edit_arrow" />
                      </div>
                    </div>
                    <div id="category_list_edit" class="category_list d-none">
                  <div>
                    <div class="categories">Technical Task</div>
                    <div class="categories">User Story</div>
                  </div>
                </div>
                  </div>
                </div>

                <!-- Subtasks Section -->
                 <div class="subtasks_input_subs_container">
                <label class="aT_label_subtasks">Subtasks</label>
                <div class="aT_select_container">
                  <input id="aT_add_subtasks_edit" maxlength="100" class="aT_input_addSubtask aT_unset"
                    placeholder="Add new subtask" onclick="toggleDivVisibilityEdit()"/>
                  <div id="aktive_input_addSubtask_edit" class="drop_down_arrow_container" onclick="toggleDivVisibilityEdit(); divFocus();">
                    <img class="add_subtasks_plus_icon" src="./assets/img/add_subtasks_plus_icon.svg" alt="plus_icon" />
                  </div>
                  <div id="close_and_check_btns_edit" class="close_check_container d-none">
                    <div id="cancel_input_subtasks_edit" class="c_icon_container" onclick="resetDivVisibilityEdit(); divBlur()">
                      <img class="add_subtasks_close_icon" src="./assets/img/add_subtasks_close_icon.svg"
                        alt="close_icon" />
                    </div>
                    <div class="seperator_close_check"></div>
                    <div id="check_input_subtask_edit" class="c_icon_container" onclick="addSubtaskToListEdit()">
                      <img class="add_subtasks_check_icon" src="./assets/img/add_subtasks_check_icon.svg"
                        alt="check_icon" />
                    </div>
                  </div>
                </div>
                <div class="aT_subtasks_container" id="created_subtasks_edit"></div>
              </div>

            <!-- Save Button -->
            <div class="big_save_cancel_buttons edit_button" onclick="saveEditedTaskToDatabase('${taskId}')">
              <div>Ok</div>
              <img src="./assets/img/create_task_white.svg" alt="edit_ok" class="create_img" />
            </div>
        </form>
    `;

    setPriority(taskData.prio);

    if (taskData.subtask && Object.keys(taskData.subtask).length > 0) {
      const fetchedSubtasks = await fetchSubtasksFromDatabase(taskId);
      originalSubtasks = fetchedSubtasks;
      renderSubtasksEdit(fetchedSubtasks);
    }

    newSubtasks = {};
  } catch (error) {
    console.error("Error loading task for editing:", error);
  }
}

/**
 * Sets the priority of the task being edited by activating the corresponding priority box.
 * @param {string} prio - The priority level ("Urgent", "Medium", or "Low").
 */
function setPriority(prio) {
  deactivateAllEdit();
  if (prio === "Urgent") {
    activateBoxEdit("boxUrgentEdit", "urgent_box_active");
  } else if (prio === "Medium") {
    activateBoxEdit("boxMediumEdit", "medium_box_active");
  } else if (prio === "Low") {
    activateBoxEdit("boxLowEdit", "low_box_active");
  }
}

/**
 * Activates a specific priority box for editing by adding the active class.
 * @param {string} boxId - The ID of the priority box element.
 * @param {string} activeClass - The CSS class name to add to the priority box for active styling.
 */
function activateBoxEdit(boxId, activeClass) {
  deactivateAllEdit();
  const box = document.getElementById(boxId);
  box.classList.remove("aT_set_prio");
  box.classList.add(activeClass);
}

/**
 * Deactivates all priority boxes in the edit form by resetting their CSS classes.
 */
function deactivateAllEdit() {
  document
    .getElementById("boxUrgentEdit")
    .classList.remove("urgent_box_active");
  document.getElementById("boxUrgentEdit").classList.add("aT_set_prio");
  document
    .getElementById("boxMediumEdit")
    .classList.remove("medium_box_active");
  document.getElementById("boxMediumEdit").classList.add("aT_set_prio");
  document.getElementById("boxLowEdit").classList.remove("low_box_active");
  document.getElementById("boxLowEdit").classList.add("aT_set_prio");
}

/**
 * Toggles the category dropdown visibility in the edit form, based on user interaction.
 * @param {Event} event - The click event to stop propagation and manage dropdown behavior.
 */
function toggleCategoryEdit(event) {
  event.stopPropagation();

  const inputFieldCategeoryEdit = document.getElementById(
    "aT_select_category_edit"
  );
  const arrowCatContainerEdit = document.getElementById(
    "select_category_arrow_container_edit"
  );
  const arrowImageEdit = arrowCatContainerEdit.querySelector("img");
  if (inputFieldCategeoryEdit.textContent !== originalText) {
    inputFieldCategeoryEdit.textContent = originalText;
  }
  if (arrowImageEdit.classList.contains("rotate")) {
    deactivateFieldCategoryEdit();
  } else {
    activateFieldCategoryEdit();
  }
}

/**
 * Assigns click event listeners to each category option in the dropdown.
 */
function assignCategoryListeners() {
  const categoryOptions = document.querySelectorAll(".categories");
  categoryOptions.forEach(function (option) {
    option.addEventListener("click", selectCategoryEdit);
  });
}

/**
 * Updates the selected category in the edit form based on user selection.
 * @param {Event} event - The click event from selecting a category option.
 */
function selectCategoryEdit(event) {
  const inputFieldCategeoryEdit = document.getElementById(
    "aT_select_category_edit"
  );
  const selectedCategory = event.target.textContent;
  inputFieldCategeoryEdit.textContent = selectedCategory;
  deactivateFieldCategoryEdit();
}

/**
 * Deactivates the category dropdown by hiding it and resetting the arrow icon rotation.
 */
function deactivateFieldCategoryEdit() {
  const arrowCatContainerEdit = document.getElementById(
    "select_category_arrow_container_edit"
  );
  const arrowImageEdit = arrowCatContainerEdit.querySelector("img");
  const dropDownCategoriesEdit = document.getElementById("category_list_edit");
  if (arrowImageEdit) {
    arrowImageEdit.classList.remove("rotate");
  } else {
    console.error("Arrow container image not found");
  }
  dropDownCategoriesEdit.classList.add("d-none");
}

/**
 * Activates the category dropdown by displaying it and rotating the arrow icon.
 */
function activateFieldCategoryEdit() {
  const arrowCatContainerEdit = document.getElementById(
    "select_category_arrow_container_edit"
  );
  const arrowImageEdit = arrowCatContainerEdit.querySelector("img");
  const dropDownCategoriesEdit = document.getElementById("category_list_edit");
  arrowImageEdit.classList.add("rotate");
  dropDownCategoriesEdit.classList.remove("d-none");
  assignCategoryListeners();
}

/**
 * Retrieves the currently selected category text from the edit form.
 * @returns {string} The selected category as a trimmed string.
 */
function getCategoryEdit() {
  return document.getElementById("aT_select_category_edit").innerHTML.trim();
}
