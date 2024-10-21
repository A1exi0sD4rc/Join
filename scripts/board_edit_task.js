async function editTask(taskId) {
  try {
    const taskResponse = await fetch(`${TASKS_URL}/${taskId}.json`);
    const taskData = await taskResponse.json();
    await getContacts();
    selectedContacts = taskData.assigned || [];

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
                  id="aT_title"
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
                  id="aT_description"
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
                    id="aT_date"
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
                    placeholder="Add new subtask" onclick="toggleDivVisibilityEdit()" onkeydown="subtaskKeyHandler(event)"/>
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

    if (taskData.subtask) {
      const subtasks = await fetchSubtasksFromDatabase(taskId);
      console.log("Subtasks fetched:", subtasks);
      if (subtasks.length > 0) {
        renderSubtasks(subtasks);
      } else {
        console.log("No subtasks to render.");
      }
    }
  } catch (error) {
    console.error("Error loading task for editing:", error);
  }
}

function toggleDropdownEdit(event) {
  event.stopPropagation();

  const inputFieldContacts = document.getElementById("aT_select_contacts_edit");
  if (inputFieldContacts.classList.contains("active-border")) {
    deactivateFieldContactsEdit();
  } else {
    activateFieldContactsEdit();
  }
}

function activateFieldContactsEdit() {
  const inputFieldContacts = document.getElementById("aT_select_contacts_edit");
  const arrowConConImage = document.querySelector(
    "#select_contacts_arrow_container_edit img"
  );
  const dropDowncontacts = document.getElementById("contact_list_edit");
  const selectedContactsCon = document.getElementById("selected_contacts_edit");

  inputFieldContacts.classList.add("active-border");
  arrowConConImage.classList.add("rotate");
  dropDowncontacts.classList.remove("d-none");
  selectedContactsCon.classList.add("d-none");
  renderContactsEdit();
  inputFieldContacts.focus();
}

function deactivateFieldContactsEdit() {
  const inputFieldContacts = document.getElementById("aT_select_contacts_edit");
  const arrowConConImage = document.querySelector(
    "#select_contacts_arrow_container_edit img"
  );
  const dropDowncontacts = document.getElementById("contact_list_edit");
  const selectedContactsCon = document.getElementById("selected_contacts_edit");

  inputFieldContacts.classList.remove("active-border");
  arrowConConImage.classList.remove("rotate");
  dropDowncontacts.classList.add("d-none");
  selectedContactsCon.classList.remove("d-none");
  inputFieldContacts.value = "";
  inputFieldContacts.blur();
}

function renderContactsEdit() {
  let contactContainer = document.getElementById("contacts_container_edit");
  contactContainer.innerHTML = "";

  contactsAddTask.forEach((contact, i) => {
    let checked = isSelected(contact);
    let contactClass = checked ? "contact-selected" : "contact-unselected";
    let checkboxImage = checked ? "checkbox-checked-white.png" : "checkbox.png";
    let contactTextColorClass = checked ? "text-white" : "text-black";
    let initials = getInitials(contact.name.replace(" (You)", ""));

    contactContainer.innerHTML += `
      <div class="contact_container_element ${contactClass}" id="contact_edit_${i}" onclick="toggleContactEdit(${i})">
        <div style="display: flex; align-items: center; gap: 20px;" class="${contactTextColorClass}">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
            <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${initials}</text>
          </svg>
          <div id="contact_list_name">${contact.name}</div>
        </div>
        <img src="./assets/img/${checkboxImage}" class="checkbox-img" id="checkbox_edit_${i}">
      </div>
    `;
  });
}

function toggleContactEdit(index) {
  let contact = contactsAddTask[index];
  let contactElement = document.getElementById(`contact_edit_${index}`);
  let checkboxImage = document.getElementById(`checkbox_edit_${index}`);
  let textContainer = contactElement.querySelector("div");

  if (isSelected(contact)) {
    contactElement.classList.remove("contact-selected");
    contactElement.classList.add("contact-unselected");
    textContainer.classList.remove("text-white");
    textContainer.classList.add("text-black");
    contactElement.style.backgroundColor = "#FFFFFF";
    checkboxImage.src = "./assets/img/checkbox.png";
    selectedContacts = selectedContacts.filter((c) => c.name !== contact.name);
    removeSelectedContact(contact.name);
  } else {
    contactElement.classList.add("contact-selected");
    contactElement.classList.remove("contact-unselected");
    textContainer.classList.remove("text-black");
    textContainer.classList.add("text-white");
    contactElement.style.backgroundColor = "#2A3647";
    checkboxImage.src = "./assets/img/checkbox-checked-white.png";
    selectedContacts.push(contact);
    addSelectedContact(contact);
  }

  updateSelectedContactsDisplayEdit();
}

function updateSelectedContactsDisplayEdit() {
  let selectedContactsContainer = document.getElementById(
    "selected_contacts_edit"
  );
  selectedContactsContainer.innerHTML = "";
  selectedContacts.forEach((contact) => {
    addSelectedContact(contact);
  });
}

function addSelectedContact(contact) {
  let selectedContactsContainer = document.getElementById(
    "selected_contacts_edit"
  );
  let initials = getInitials(contact.name.replace(" (You)", ""));

  selectedContactsContainer.innerHTML += `
    <div class="selected-contact" id="selected_contact_${contact.name}">
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="21" cy="21" r="21" fill="${contact.bgcolor}" stroke="white" stroke-width="3"/>
        <text x="21" y="27" text-anchor="middle" font-size="15" fill="white">${initials}</text>
      </svg>
    </div>
  `;
}

function removeSelectedContact(contactName) {
  let selectedContactElement = document.getElementById(
    `selected_contact_${contactName}`
  );
  if (selectedContactElement) {
    selectedContactElement.remove();
  }
}

function isSelected(contact) {
  return selectedContacts.some(
    (selectedContact) => selectedContact.name === contact.name
  );
}

function renderSelectedContactsFromDatabase(assigned) {
  if (assigned && assigned.length > 0) {
    let contactsHtml = assigned
      .map((contact) => {
        let initials = getInitials(contact.name.replace(" (You)", ""));
        return `
        <div class="selected-contact" id="selected_contact_edit_${contact.name}">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="21" fill="${contact.bgcolor}" stroke="white" stroke-width="3"/>
          <text x="21" y="27" text-anchor="middle" font-size="15" fill="white">${initials}</text>
        </svg>
      </div>
      `;
      })
      .join("");
    return contactsHtml;
  } else {
    return `<div class="assigned-contact" style="position: relative; display: inline-block;"></div>`;
  }
}

function filterContactsEdit() {
  let inputFieldContacts = document.getElementById("aT_select_contacts_edit");
  let searchQuery = inputFieldContacts.value.toLowerCase();
  let filteredContacts = contactsAddTask.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery)
  );
  renderFilteredContactsEdit(filteredContacts);
}

function renderFilteredContactsEdit(filteredContacts) {
  let contactContainer = document.getElementById("contacts_container_edit");
  contactContainer.innerHTML = "";

  if (filteredContacts.length > 0) {
    filteredContacts.forEach((contact) => {
      let originalIndex = contactsAddTask.indexOf(contact);
      let checked = isSelected(contact);
      let backgroundColor = checked ? "#2A3647" : "#FFFFFF";
      let checkboxImage = checked
        ? "checkbox-checked-white.png"
        : "checkbox.png";
      let contactTextColorClass = checked ? "text-white" : "text-black";
      let contactClass = checked ? "contact-selected" : "contact-unselected";
      let initials = getInitials(contact.name.replace(" (You)", ""));

      contactContainer.innerHTML += `
      <div class="contact_container_element ${contactClass}" id="contact_edit_${originalIndex}" style="background-color: ${backgroundColor}" onclick="toggleContactEdit(${originalIndex})">
        <div style="display: flex; align-items: center; gap: 20px;" class="${contactTextColorClass}">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
            <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${initials}</text>
          </svg>
          <div id="contact_list_name">${contact.name}</div>
        </div>
        <img src="./assets/img/${checkboxImage}" class="checkbox-img" id="checkbox_edit_${originalIndex}">
      </div>
    `;
    });
  } else {
    contactContainer.innerHTML += `
      <div class="contact_container_element" style="background-color: #FFFFFF"> 
        <div style="display: flex; align-items: center; gap: 20px; color: #000000">
          <div id="contact_list_name">No Contact found with this name.</div> 
        </div> 
      </div>
    `;
  }
}

// START PRIORITY CHANGE ON THE EDIT TASK //

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

function activateBoxEdit(boxId, activeClass) {
  deactivateAllEdit();
  const box = document.getElementById(boxId);
  box.classList.remove("aT_set_prio");
  box.classList.add(activeClass);
}

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

function assignCategoryListeners() {
  const categoryOptions = document.querySelectorAll(".categories");
  categoryOptions.forEach(function (option) {
    option.addEventListener("click", selectCategoryEdit);
  });
}

function selectCategoryEdit(event) {
  const inputFieldCategeoryEdit = document.getElementById(
    "aT_select_category_edit"
  );
  const selectedCategory = event.target.textContent;
  inputFieldCategeoryEdit.textContent = selectedCategory;
  deactivateFieldCategoryEdit();
}

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

async function saveEditedTaskToDatabase(taskId) {
  const updatedTask = collectTaskData();
  updatedTask.assigned = selectedContacts;
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

// START FUNCTIONS FOR THE SUBTASKS //

function renderSubtasks(subtasks) {
  console.log("Rendering subtasks:", subtasks); // Log the subtasks received

  const subtaskContainer = document.getElementById("created_subtask_edit");
  subtaskContainer.innerHTML = ""; // Clear existing subtasks

  // Ensure subtasks is an array and iterate over it
  if (Array.isArray(subtasks) && subtasks.length > 0) {
    subtasks.forEach((subtask) => {
      console.log("Subtask to render:", subtask); // Log each subtask being rendered

      const subtaskId = subtask.id; // Get the ID from the fetched subtasks
      const subtaskHTML = createSubtaskHTML(subtask.title, subtaskId);
      subtaskContainer.innerHTML += subtaskHTML; // Add to the container
    });
  } else {
    console.log("No subtasks to render."); // Log if no subtasks
  }

  addSubtaskListeners(); // Add event listeners for the newly created subtasks
}

function divFocus() {
  document.getElementById("aT_add_subtasks_edit").focus();
}

function divBlur() {
  document.getElementById("aT_add_subtasks_edit").blur();
}

/**
 * Enables editing of the subtask by replacing the text with an input field.
 * @param {HTMLImageElement} editButton - The edit button clicked.
 */
function editSubtaskEdit(editButton) {
  const taskItem = editButton.closest(".task-item");
  console.log("Editing subtask:", taskItem); // Debugging log
  const taskTextElement = getTaskTextElement(taskItem);
  const currentText = taskTextElement.textContent;
  updateTaskItemForEditing(taskItem, currentText);
  focusAndSetCursorAtEnd(taskItem);
}

/**
 * Retrieves the task text element from a task item.
 * @param {HTMLElement} taskItem - The subtask item element.
 * @returns {HTMLElement} - The task text element.
 */
function getTaskTextElement(taskItem) {
  const taskText = taskItem.querySelector(".task-text");
  console.log("Found task text element:", taskText);
  return taskText;
}

/**
 * Sets focus on the input field and positions the cursor at the end of the text.
 * @param {HTMLElement} taskItem - The subtask item element being edited.
 */
function focusAndSetCursorAtEnd(taskItem) {
  const inputField = taskItem.querySelector(".edit-input");
  inputField.focus();
  const textLength = inputField.value.length;
  inputField.setSelectionRange(textLength, textLength);
}

/**
 * Saves the edited subtask title and updates the DOM.
 * @param {HTMLImageElement} saveButton - The save button clicked.
 */
async function saveSubtaskEdit(saveButton) {
  const taskItem = saveButton.closest(".task-item");
  const inputElement = getElementFromTaskItem(taskItem, "input");
  if (!inputElement) return;

  const subtaskId = getSubtaskId(taskItem);
  const newTitle = inputElement.value.trim();

  if (newTitle) {
    await updateSubtaskInDatabase(subtaskId, newTitle);
    const updatedSubtasks = await fetchSubtasksFromDatabase(subtaskId);
    renderSubtasks(updatedSubtasks);
  }
}

async function updateSubtaskInDatabase(subtaskId, newTitle) {
  const taskId = getSubtaskId(subtaskId);
  const response = await fetch(
    `${TASKS_URL}/${taskId}/subtasks/${subtaskId}.json`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    }
  );
  console.log("Update response:", response);
}

/**
 * Deletes a subtask from the list when the delete button is clicked.
 * @param {HTMLImageElement} deleteButton - The button that triggers the deletion.
 */
async function deleteSubtaskEdit(deleteButton) {
  const taskItem = deleteButton.closest(".task-item");
  const subtaskId = getSubtaskId(taskItem);

  await deleteSubtaskFromDatabase(subtaskId);
  const updatedSubtasks = await fetchSubtasksFromDatabase(subtaskId);
  renderSubtasks(updatedSubtasks);
}

async function deleteSubtaskFromDatabase(subtaskId) {
  const taskId = getSubtaskId(subtaskId);
  await fetch(`${TASKS_URL}/${taskId}/subtasks/${subtaskId}.json`, {
    method: "DELETE",
  });
}

async function fetchSubtasksFromDatabase(taskId) {
  const response = await fetch(`${TASKS_URL}/${taskId}/subtask.json`);
  const subtasks = await response.json();

  console.log("Fetched data:", subtasks);

  if (!subtasks) return [];

  console.log("Subtasks before mapping:", subtasks);

  const mappedSubtasks = Object.entries(subtasks).map(([id, subtask]) => ({
    id,
    ...subtask,
  }));

  console.log("Mapped subtasks:", mappedSubtasks);

  return mappedSubtasks;
}

/**
 * Retrieves the input element from the task item.
 * @param {HTMLElement} taskItem - The task item element.
 * @returns {HTMLInputElement|null} - The input element or null if not found.
 */
function getTaskInputElement(taskItem) {
  return taskItem.querySelector("input");
}

/**
 * Gets the subtask ID from the task item.
 * @param {HTMLElement} taskItem - The task item element.
 * @returns {string} - The subtask ID.
 */
function getSubtaskId(taskItem) {
  const subtaskId = taskItem.getAttribute("data-id");
  console.log("Subtask ID:", subtaskId);
  return subtaskId;
}
/**
 * Updates the subtask title in the data structure.
 * @param {string} subtaskId - The ID of the subtask.
 * @param {string} newTitle - The new title of the subtask.
 */
function updateSubtaskTitle(subtaskId, newTitle) {
  const subtaskIndex = subtasks.findIndex(
    (subtask) => subtask.id === subtaskId
  );
  if (subtaskIndex !== -1) {
    subtasks[subtaskIndex].title = newTitle;
  }
  console.log(`Subtask ${subtaskId} updated to: ${newTitle}`);
}

/**
 * Updates the DOM for the edited task item.
 * @param {HTMLElement} taskItem - The task item element.
 * @param {string} newTitle - The new title of the subtask.
 */
function updateDOM(taskItem, newTitle) {
  const taskTextElement = createTaskTextElement(newTitle);
  const taskControls = taskItem.querySelector(".task-controls");
  updateTaskItem(taskItem, taskTextElement, taskControls);
  updateTaskControls(taskControls);
}

/**
 * Retrieves the input element from a task item being edited.
 * @param {HTMLElement} taskItem - The subtask item element.
 * @returns {HTMLInputElement} - The input element.
 */
function getInputElement(taskItem) {
  return taskItem.querySelector(".edit-input");
}

/**
 * Updates the task item in the DOM after editing.
 * @param {HTMLElement} taskItem - The subtask item element.
 * @param {HTMLElement} taskTextElement - The new task text element.
 * @param {HTMLElement} taskControls - The task controls element.
 */
function updateTaskItem(taskItem, taskTextElement, taskControls) {
  taskItem.innerHTML = "";
  taskItem.appendChild(taskTextElement);
  taskItem.appendChild(taskControls);
}

/**
 * Updates the task controls in the DOM after editing.
 * @param {HTMLElement} taskControls - The task controls element.
 */
function updateTaskControls(taskControls) {
  taskControls.innerHTML = /*html*/ `
    <img src="./assets/img/subTask_edit.svg" alt="Edit" class="task-btn edit-btn" onclick="editSubtasEditk(this)">
    <div class="separator_subtasks"></div>
    <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn delete-btn" onclick="deleteSubtaskEdit(this)">
  `;
}

/**
 * Clears the value of the subtask input field.
 * @param {HTMLInputElement} inputField - The input field element.
 */
function clearInputField(inputField) {
  inputField.value = "";
}

/**
 * Adds a subtask to the list if the input is valid.
 */
function addSubtaskToListEdit() {
  const subtaskInput = document.getElementById("aT_add_subtasks_edit");
  const subtaskTitle = subtaskInput.value.trim();

  if (subtaskTitle) {
    const newSubtask = { title: subtaskTitle, id: generateSubtaskId() };
    subtasks.push(newSubtask);
    renderSubtasks(subtasks);
    saveSubtasksToDatabase(subtasks);
    subtaskInput.value = "";
  }
}

function saveSubtasksToDatabase(subtasks) {
  const taskItem = saveButton.closest(".task-item");
  const subtaskId = getSubtaskId(taskItem);
  fetch(`${TASKS_URL}/${subtaskId}/subtasks.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subtasks),
  });
}

/**
 * Clears the input field for subtasks.
 */
function cancel_input_subtask() {
  document.getElementById("aT_add_subtasks_edit").value = "";
}

/**
 * Hides the subtask input field and shows the buttons for canceling and saving.
 */
function toggleDivVisibilityEdit() {
  document
    .getElementById("aktive_input_addSubtask_edit")
    .classList.add("d-none");
  document
    .getElementById("close_and_check_btns_edit")
    .classList.remove("d-none");
}

/**
 * Resets the visibility of the subtask input field and hides the buttons for canceling and saving.
 */
function resetDivVisibilityEdit() {
  document
    .getElementById("aktive_input_addSubtask_edit")
    .classList.remove("d-none");
  document.getElementById("close_and_check_btns_edit").classList.add("d-none");
}

/**
 * Scrolls the subtask container to the bottom of the list.
 */
function scrollToListEnd() {
  const subtaskContainer = document.getElementById("created_subtasks_edit");
  subtaskContainer.scrollTop = subtaskContainer.scrollHeight;
}

/**
 * Generates a unique ID for a new subtask based on the current timestamp.
 * @returns {string} - The generated subtask ID.
 */
function generateSubtaskId() {
  return `subtask_${new Date().getTime()}`;
}

/**
 * Adds a subtask to the array of subtasks.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The unique ID of the subtask.
 */
function addSubtaskToArray(subtaskText, subtaskId) {
  const subtask = {
    id: subtaskId,
    title: subtaskText,
    completed: false,
  };
  subtasks.push(subtask);
}

/**
 * Removes a subtask from the subtasks array by its ID.
 * @param {string} subtaskId - The ID of the subtask to be removed.
 */
function removeSubtaskFromArray(subtaskId) {
  subtasks = subtasks.filter((subtask) => subtask.id !== subtaskId);
}

/**
 * Creates HTML for a new subtask item.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The unique ID of the subtask.
 * @returns {string} - The HTML string for the subtask.
 */
function createSubtaskHTML(title, id) {
  return `
    <div class="task-item" data-id="${id}" id="${id}"> <!-- Ensure each subtask has its own ID -->
      <span class="task-text">${title}</span>
      <div class="task-controls">
        <img src="./assets/img/edit.svg" alt="edit_icon" class="edit-subtask-btn" data-id="${id}">
        <img src="./assets/img/delete.svg" alt="delete_icon" class="delete-subtask-btn" data-id="${id}">
      </div>
    </div>
  `;
}

/**
 * Appends a new subtask to the subtask list.
 * @param {string} newListHTML - The HTML string for the new subtask.
 */
function appendSubtaskToList(newListHTML) {
  document.getElementById("created_subtasks_edit").innerHTML += newListHTML;
}

/**
 * Updates the task item to show the editing input field.
 * @param {HTMLElement} taskItem - The subtask item element.
 * @param {string} currentText - The current text of the subtask.
 */
function updateTaskItemForEditing(taskItem, currentText) {
  taskItem.innerHTML = /*html*/ `
    <input type="text" maxlength="100" value="${currentText}" class="edit-input">
    <div class="task-controls">
      <div class="edit-modus-btns" onclick="deleteSubtaskEdit(this)">
        <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn-input delete-btn-input">
      </div>
      <div class="separator_subtasks"></div>
      <div class="edit-modus-btns"  onclick="saveSubtaskEdit(this)">
        <img src="./assets/img/edit_subtask_check.svg" alt="Save" class="task-btn-input save-btn-input">
      </div>
    </div>`;
}

/**
 * Creates an HTML element for the updated subtask text.
 * @param {string} newTitle - The new title of the subtask.
 * @returns {HTMLLIElement} - The task text element.
 */
function createTaskTextElement(newTitle) {
  const taskTextElement = document.createElement("li");
  taskTextElement.className = "task-text";
  taskTextElement.textContent = newTitle;
  return taskTextElement;
}

// Function to add event listeners for edit and delete buttons
function addSubtaskListeners() {
  document.querySelectorAll(".edit-subtask-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const subtaskId = this.getAttribute("data-id");
      const subtaskTitleElement = document
        .getElementById(subtaskId)
        .querySelector(".task-text");
      const newTitle = prompt(
        "Enter new title:",
        subtaskTitleElement.textContent
      );

      if (newTitle) {
        updateSubtaskTitle(subtaskId, newTitle);
        subtaskTitleElement.textContent = newTitle; // Update the displayed title immediately
      }
    });
  });

  document.querySelectorAll(".delete-subtask-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const subtaskId = this.getAttribute("data-id");
      deleteSubtask(subtaskId);
      document.getElementById(subtaskId).remove(); // Remove the subtask from the DOM
    });
  });
}
