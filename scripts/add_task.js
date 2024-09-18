async function initAddTask() {
  await getContacts();
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
//#################################################################################################

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

function deactivateFieldContacts() {
  inputFieldContacts.classList.remove("active-border");
  arrowConConImage.classList.remove("rotate");
  dropDowncontacts.classList.add("d-none");
  selectedContactsCon.classList.remove("d-none");
  inputFieldContacts.value = "";
}

arrowConContainer.addEventListener("click", function (event) {
  event.stopPropagation(); // Verhindert, dass der Klick auch den document-Event-Listener auslöst
  if (inputFieldContacts.classList.contains("active-border")) {
    deactivateFieldContacts();
  } else {
    activateField(event);
  }
});

function activateField(event) {
  event.stopPropagation();
  inputFieldContacts.classList.add("active-border");
  arrowConConImage.classList.add("rotate");
  dropDowncontacts.classList.remove("d-none");
  selectedContactsCon.classList.add("d-none");
  renderContacts();
  inputFieldContacts.focus();
}

inputFieldContacts.addEventListener("click", function (event) {
  event.stopPropagation(); // Verhindert, dass der Klick auch den document-Event-Listener auslöst
  activateField(event);
});

//#######################################################################################################
//CATEGORY
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

//###################################Subtask###################################
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

function addSubtaskToList() {
  const inputField = document.getElementById("aT_add_subtasks");
  const subtaskText = getTrimmedSubtaskText(inputField);
  if (subtaskText !== "") {
    const newListHTML = createSubtaskHTML(subtaskText);
    appendSubtaskToList(newListHTML);
    clearInputField(inputField);
    resetDivVisibility();
  }
}

function getTrimmedSubtaskText(inputField) {
  return inputField.value.trim();
}

function createSubtaskHTML(subtaskText) {
  return /*html*/ `
    <ul class="task-item">
      <li class="task-text">${subtaskText}</li>
      <div class="task-controls">
        <img src="./assets/img/subTask_edit.svg" alt="Edit" class="task-btn edit-btn" onclick="editTask(this)">
        <div class="separator_subtasks"></div>
        <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn delete-btn" onclick="deleteTask(this)">
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
    <input type="text" value="${currentText}" class="edit-input">
    <div class="task-controls">
      <div class="edit-modus-btns">
        <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn-input delete-btn-input" onclick="deleteTask(this)">
      </div>
      <div class="separator_subtasks"></div>
      <div class="edit-modus-btns">
        <img src="./assets/img/edit_subtask_check.svg" alt="Save" class="task-btn-input save-btn-input" onclick="saveTask(this)">
      </div>
    </div>
  `;
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
  const taskTextElement = createTaskTextElement(inputElement);
  const taskControls = taskItem.querySelector(".task-controls");
  updateTaskItem(taskItem, taskTextElement, taskControls);
  updateTaskControls(taskControls);
}

function getInputElement(taskItem) {
  return taskItem.querySelector(".edit-input");
}

function createTaskTextElement(inputElement) {
  const taskTextElement = document.createElement("li");
  taskTextElement.className = "task-text";
  taskTextElement.textContent = inputElement.value.trim();
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
    <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn delete-btn" onclick="deleteTask(this)">
  `;
}

function deleteTask(deleteButton) {
  const taskItem = deleteButton.closest(".task-item");
  if (taskItem) {
    taskItem.remove();
  }
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
    this.style.color = "#d1d1d1";
  }
});

function clearAll() {
  clearTitle();
  clearDescription();
  clearDate();
  clearPrio();
  clearSubtasks();
  clearCategory();
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

function clearDate() {
  const dateField = document.getElementById("aT_date");
  if (dateField) {
    dateField.value = "";
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
