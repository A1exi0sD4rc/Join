async function initAddTask() {
  includeHTML();
  await getContacts();
  awaitGenerateInitials();
}

document.addEventListener("DOMContentLoaded", function () {
  const handle = document.querySelector(".resize-handle");
  const textarea = document.getElementById("aT_description");
  const container = document.querySelector(".resizable-container");

  if (handle && textarea && container) {
    handle.addEventListener("mousedown", function (e) {
      e.preventDefault();

      function onMouseMove(e) {
        const containerRect = container.getBoundingClientRect();
        const newHeight = e.clientY - containerRect.top;
        if (newHeight > 136 && newHeight < 200) {
          textarea.style.height = newHeight + "px";
          container.style.height = newHeight + "px";
        }
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  } else {
    console.error("Elemente nicht gefunden!");
  }
});

function activateBox(boxId, activeClass) {
  deactivateAll();
  const box = document.getElementById(boxId);
  box.classList.remove("aT_set_prio");
  box.classList.add(activeClass);
}

function deactivateAll() {
  document.getElementById("boxUrgent").classList.remove("urgent_box_active");
  document.getElementById("boxUrgent").classList.add("aT_set_prio");
  document.getElementById("boxMedium").classList.remove("medium_box_active");
  document.getElementById("boxMedium").classList.add("aT_set_prio");
  document.getElementById("boxLow").classList.remove("low_box_active");
  document.getElementById("boxLow").classList.add("aT_set_prio");
}

document.addEventListener("click", handleDocumentClick);
const inputFieldContacts = document.getElementById("aT_select_contacts");
const categoryList = document.getElementById("category_list");
const arrowConContainer = document.getElementById(
  "select_contacts_arrow_container"
);
const arrowConConImage = arrowConContainer.querySelector("img");
const dropDowncontacts = document.getElementById("contact_list");
const selectedContactsCon = document.getElementById("selected_contacts");

function handleDocumentClick(event) {
  const isInsideInputFieldContacts = inputFieldContacts.contains(event.target);
  const isInsideArrowConContainer = arrowConContainer.contains(event.target);
  const isInsideCategoryList = categoryList.contains(event.target);
  if (inputFieldContacts.classList.contains("active-border")) {
    if (!isInsideInputFieldContacts && !isInsideArrowConContainer) {
      handleContactsClick(event);
    }
  } else if (!categoryList.classList.contains("d-none")) {
    if (!isInsideCategoryList) {
      handleCategoryClick(event);
    }
  }
}

function handleContactsClick(event) {
  if (
    !inputFieldContacts.contains(event.target) &&
    !arrowConContainer.contains(event.target) &&
    !dropDowncontacts.contains(event.target)
  ) {
    deactivateFieldContacts();
  }
}

function handleCategoryClick(event) {
  if (
    !inputFieldCategeory.contains(event.target) &&
    !arrowCatContainer.contains(event.target) &&
    !dropDownCategories.contains(event.target)
  ) {
    deactivateFieldCategory();
  }
}

function activateFieldContacts() {
  inputFieldContacts.classList.add("active-border");
  arrowConConImage.classList.add("rotate");
  dropDowncontacts.classList.remove("d-none");
  selectedContactsCon.classList.add("d-none");
  renderContacts();
  inputFieldContacts.focus();
}

function deactivateFieldContacts() {
  inputFieldContacts.classList.remove("active-border");
  arrowConConImage.classList.remove("rotate");
  dropDowncontacts.classList.add("d-none");
  selectedContactsCon.classList.remove("d-none");
  inputFieldContacts.value = "";
  renderContacts();
  inputFieldContacts.blur();
}

function toggleDropdown(event) {
  event.stopPropagation();

  if (inputFieldContacts.classList.contains("active-border")) {
    deactivateFieldContacts();
  } else {
    activateFieldContacts();
  }
}

arrowConContainer.addEventListener("click", toggleDropdown);

inputFieldContacts.addEventListener("click", function (event) {
  event.stopPropagation();
  toggleDropdown(event);
});

inputFieldContacts.addEventListener("input", function () {
  let searchQuery = inputFieldContacts.value.toLowerCase();
  let filteredContacts = contactsAddTask.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery)
  );
  renderFilteredContacts(filteredContacts);
});

function filterContacts(searchTerm) {
  let filteredContacts = contactsAddTask.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  renderFilteredContacts(filteredContacts);
}

function renderFilteredContacts(filteredContacts) {
  let contactContainer = document.getElementById("contacts_container");
  contactContainer.innerHTML = "";

  if (filteredContacts.length > 0) {
    filteredContacts.forEach((contact) => {
      let originalIndex = contactsAddTask.indexOf(contact);
      let checked = isSelected(contact);
      let backgroundColor = checked ? "#2A3647" : "#FFFFFF";
      let checkboxImage = checked
        ? "checkbox-checked-white.png"
        : "checkbox.png";
      let contactTextColor = checked ? "#FFFFFF" : "#000000";
      let contactClass = checked ? "contact-selected" : "contact-unselected";
      let initials = getInitials(contact.name.replace(" (You)", ""));

      contactContainer.innerHTML += `
      <div class="contact_container_element ${contactClass}" id="contact_${originalIndex}" style="background-color: ${backgroundColor}" onclick="toggleContact(${originalIndex})">
        <div style="display: flex; align-items: center; gap: 20px; color: ${contactTextColor}">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
            <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${initials}</text>
          </svg>
          <div id="contact_list_name">${contact.name}</div>
        </div>
        <img src="./assets/img/${checkboxImage}" class="checkbox-img" id="checkbox_${originalIndex}">
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

const inputFieldCategeory = document.getElementById("aT_select_category");
const arrowCatContainer = document.getElementById(
  "select_category_arrow_container"
);
const arrowImage = arrowCatContainer.querySelector("img");
const dropDownCategories = document.getElementById("category_list");
const categoryOptions = document.querySelectorAll(".categories");
const originalText = "Select task category";

function activateCatField() {
  arrowImage.classList.add("rotate");
  dropDownCategories.classList.remove("d-none");
}

function deactivateFieldCategory() {
  arrowImage.classList.remove("rotate");
  dropDownCategories.classList.add("d-none");
}

function toggleField(event) {
  event.stopPropagation();
  if (inputFieldCategeory.textContent !== originalText) {
    inputFieldCategeory.textContent = originalText;
  }
  if (arrowImage.classList.contains("rotate")) {
    deactivateFieldCategory();
  } else {
    activateCatField();
  }
}

function selectCategory(event) {
  const selectedCategory = event.target.textContent;
  inputFieldCategeory.textContent = selectedCategory;
  deactivateFieldCategory();
  validateCategory();
}

function handleClickOutside(event) {
  if (
    !inputFieldCategeory.contains(event.target) &&
    !arrowCatContainer.contains(event.target) &&
    !dropDownCategories.contains(event.target)
  ) {
    deactivateFieldCategory();
  }
}

inputFieldCategeory.addEventListener("click", toggleField);
arrowCatContainer.addEventListener("click", toggleField);
document.addEventListener("click", handleClickOutside);
categoryOptions.forEach(function (option) {
  option.addEventListener("click", selectCategory);
});

function cancel_input_subtask() {
  document.getElementById("aT_add_subtasks").value = "";
}

function toggleDivVisibility() {
  document.getElementById("aktive_input_addSubtask").classList.add("d-none");
  document.getElementById("close_and_check_btns").classList.remove("d-none");
}

function resetDivVisibility() {
  document.getElementById("aktive_input_addSubtask").classList.remove("d-none");
  document.getElementById("close_and_check_btns").classList.add("d-none");
}

let subtasks = [];

function addSubtaskToList() {
  const inputField = document.getElementById("aT_add_subtasks");
  const subtaskText = getTrimmedSubtaskText(inputField);
  if (subtaskText !== "") {
    const subtaskId = generateSubtaskId();
    const newListHTML = createSubtaskHTML(subtaskText, subtaskId);
    appendSubtaskToList(newListHTML);
    addSubtaskToArray(subtaskText, subtaskId);
    clearInputField(inputField);
    resetDivVisibility();
  }
}

function addSubtaskToArray(subtaskText, subtaskId) {
  const subtask = {
    id: subtaskId,
    title: subtaskText,
    completed: false,
  };
  subtasks.push(subtask);
}

function getTrimmedSubtaskText(inputField) {
  return inputField.value.trim();
}

function createSubtaskHTML(subtaskText, subtaskId) {
  return /*html*/ `
    <ul class="task-item" data-id="${subtaskId}">
      <li class="task-text">${subtaskText}</li>
      <div class="task-controls">
        <img src="./assets/img/subTask_edit.svg" alt="Edit" class="task-btn edit-btn" onclick="editTask(this)">
        <div class="separator_subtasks"></div>
        <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn delete-btn" onclick="deleteSubtask(this)">
      </div>
    </ul>`;
}

function appendSubtaskToList(newListHTML) {
  document.getElementById("created_subtasks").innerHTML += newListHTML;
}

function clearInputField(inputField) {
  inputField.value = "";
}

function editTask(editButton) {
  const taskItem = editButton.closest(".task-item");
  const taskTextElement = getTaskTextElement(taskItem);
  const currentText = taskTextElement.textContent;
  updateTaskItemForEditing(taskItem, currentText);
  focusAndSetCursorAtEnd(taskItem);
}

function getTaskTextElement(taskItem) {
  return taskItem.querySelector(".task-text");
}

function updateTaskItemForEditing(taskItem, currentText) {
  taskItem.innerHTML = /*html*/ `
    <input type="text" maxlength="50" value="${currentText}" class="edit-input">
    <div class="task-controls">
      <div class="edit-modus-btns">
        <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn-input delete-btn-input" onclick="deleteSubtask(this)">
      </div>
      <div class="separator_subtasks"></div>
      <div class="edit-modus-btns">
        <img src="./assets/img/edit_subtask_check.svg" alt="Save" class="task-btn-input save-btn-input" onclick="saveTask(this)">
      </div>
    </div>`;
}

function focusAndSetCursorAtEnd(taskItem) {
  const inputField = taskItem.querySelector(".edit-input");
  inputField.focus();
  const textLength = inputField.value.length;
  inputField.setSelectionRange(textLength, textLength);
}

function saveTask(saveButton) {
  const taskItem = saveButton.closest(".task-item");
  const inputElement = getInputElement(taskItem);
  if (!inputElement) {
    console.error("Input element not found");
    return;
  }

  const subtaskId = taskItem.getAttribute("data-id");
  const newTitle = inputElement.value.trim();

  const subtaskIndex = subtasks.findIndex(
    (subtask) => subtask.id === subtaskId
  );
  if (subtaskIndex !== -1) {
    subtasks[subtaskIndex].title = newTitle;
  }

  const taskTextElement = createTaskTextElement(newTitle);
  const taskControls = taskItem.querySelector(".task-controls");
  updateTaskItem(taskItem, taskTextElement, taskControls);
  updateTaskControls(taskControls);
}

function getInputElement(taskItem) {
  return taskItem.querySelector(".edit-input");
}

function createTaskTextElement(newTitle) {
  const taskTextElement = document.createElement("li");
  taskTextElement.className = "task-text";
  taskTextElement.textContent = newTitle;
  return taskTextElement;
}

function updateTaskItem(taskItem, taskTextElement, taskControls) {
  taskItem.innerHTML = "";
  taskItem.appendChild(taskTextElement);
  taskItem.appendChild(taskControls);
}

function updateTaskControls(taskControls) {
  taskControls.innerHTML = /*html*/ `
    <img src="./assets/img/subTask_edit.svg" alt="Edit" class="task-btn edit-btn" onclick="editTask(this)">
    <div class="separator_subtasks"></div>
    <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn delete-btn" onclick="deleteSubtask(this)">
  `;
}

function deleteSubtask(deleteButton) {
  const taskItem = deleteButton.closest(".task-item");
  if (taskItem) {
    const subtaskId = taskItem.getAttribute("data-id");
    removeSubtaskFromArray(subtaskId);
    taskItem.remove();
  }
}

function removeSubtaskFromArray(subtaskId) {
  subtasks = subtasks.filter((subtask) => subtask.id !== subtaskId);
}

function generateSubtaskId() {
  return `subtask_${new Date().getTime()}`;
}

document
  .getElementById("aT_add_subtasks")
  .addEventListener("click", toggleDivVisibility);
document
  .getElementById("aktive_input_addSubtask")
  .addEventListener("click", function () {
    document.getElementById("aT_add_subtasks").focus();
    toggleDivVisibility();
  });
document
  .getElementById("cancel_input_subtasks")
  .addEventListener("click", function () {
    document.getElementById("aT_add_subtasks").blur();
    resetDivVisibility();
  });
document
  .getElementById("check_input_subtask")
  .addEventListener("click", addSubtaskToList);
document
  .getElementById("aT_add_subtasks")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtaskToList();
    }
  });

const input = document.querySelector(".aT_input_date");
input.addEventListener("input", function () {
  if (this.value) {
    this.style.color = "#000000";
  }
});

function clearAll() {
  clearTitle();
  clearDescription();
  clearSelectedContacts();
  clearDate();
  clearPrio();
  clearSubtasks();
  clearCategory();
  resetValidationErrors();
}

function clearTitle() {
  const inputField = document.getElementById("aT_title");
  if (inputField) {
    inputField.value = "";
  }
}

function clearDescription() {
  const textarea = document.getElementById("aT_description");
  if (textarea) {
    textarea.value = "";
  }
}

function clearSelectedContacts() {
  selectedContacts = [];
  sessionStorage.removeItem("selectedContacts");
  renderContacts();
  displaySelectedContacts();
}

function clearDate() {
  const dateField = document.getElementById("aT_date");
  if (dateField) {
    dateField.value = "";
    dateField.style.color = "#d1d1d1";
  }
}

function clearPrio() {
  deactivateAll();
  const boxMedium = document.getElementById("boxMedium");
  boxMedium.classList.remove("aT_set_prio");
  boxMedium.classList.add("medium_box_active");
}

function clearSubtasks() {
  const subtaskList = document.getElementById("created_subtasks");
  subtaskList.innerHTML = "";
  const inputField = document.getElementById("aT_add_subtasks");
  inputField.value = "";
  resetDivVisibility();
}

function clearCategory() {
  const arrowCatConImage = document
    .getElementById("select_category_arrow_container")
    .querySelector("img");
  inputFieldCategeory.textContent = originalText;
  arrowCatConImage.classList.remove("rotate");
  dropDownCategories.classList.add("d-none");
}
