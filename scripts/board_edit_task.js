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

    document.getElementById("big_card").innerHTML = generateEditTaskForm(
      taskData,
      taskId
    );
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
