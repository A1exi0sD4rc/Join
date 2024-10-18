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
                placeholder="Select contacts to assign" />
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
                      <div id="aT_select_category" class="aT_select_dropdown_fields">
                        ${taskData.art || ""}
                      </div>
                      <div id="select_category_arrow_container" class="drop_down_arrow_container">
                        <img src="./assets/img/arrow_drop_down.svg" alt="drop_down_arrow" class="arrow" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Subtasks Section -->
                <div class="subtasks_input_subs_container">
                  <label class="aT_label_subtasks">Subtasks</label>
                  <div class="aT_select_container">
                    <input id="aT_add_subtasks" maxlength="100" class="aT_input_addSubtask aT_unset" placeholder="Add new subtask" />
                    <div id="aktive_input_addSubtask" class="drop_down_arrow_container">
                      <img class="add_subtasks_plus_icon" src="./assets/img/add_subtasks_plus_icon.svg" alt="plus_icon" />
                    </div>
                    <div id="close_and_check_btns" class="close_check_container d-none">
                      <div id="cancel_input_subtasks" class="c_icon_container" onclick="cancel_input_subtask()">
                        <img class="add_subtasks_close_icon" src="./assets/img/add_subtasks_close_icon.svg" alt="close_icon" />
                      </div>
                      <div class="seperator_close_check"></div>
                      <div id="check_input_subtask" class="c_icon_container">
                        <img class="add_subtasks_check_icon" src="./assets/img/add_subtasks_check_icon.svg" alt="check_icon" />
                      </div>
                    </div>
                  </div>
                  <div class="aT_subtasks_container" id="created_subtasks"></div>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="big_save_cancel_buttons edit_button" onclick="saveEditedTaskToDatabase('${taskId}')">
              <div>Ok</div>
              <img src="./assets/img/create_task_white.svg" alt="edit_ok" class="create_img" />
            </div>
        </form>
    `;

    populateEditForm(taskData);
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

function updateSelectedContactsDisplayEdit() {
  let selectedContactsContainer = document.getElementById(
    "selected_contacts_edit"
  );
  selectedContactsContainer.innerHTML = "";
  selectedContacts.forEach((contact) => {
    addSelectedContact(contact);
  });
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

function populateEditForm(task) {
  document.getElementById("aT_title").value = task.title;
  document.getElementById("aT_description").value = task.description;
  document.getElementById("aT_date").value = task.due_date;
  setPriority(task.prio);
}

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
