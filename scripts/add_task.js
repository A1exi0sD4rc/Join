async function initAddTask() {
  await getContacts();
}

document.addEventListener("DOMContentLoaded", function () {
  const handle = document.querySelector(".resize-handle");
  const textarea = document.querySelector(".resizable-textarea");
  const container = document.querySelector(".resizable-container");

  if (handle && textarea && container) {
    handle.addEventListener("mousedown", function (e) {
      e.preventDefault();

      function onMouseMove(e) {
        const containerRect = container.getBoundingClientRect();
        const newHeight = e.clientY - containerRect.top;
        if (newHeight > 136 && newHeight < 200) {
          // Maximalhöhe
          textarea.style.height = newHeight + "px";
          container.style.height = newHeight + "px"; // Container-Höhe anpassen
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

// Funktion, die beim Klicken auf eine div aufgerufen wird
function activateBox(boxId, activeClass) {
  // Zuerst alle deaktivieren
  deactivateAll();

  // Dann die angeklickte div aktivieren
  const box = document.getElementById(boxId);
  box.classList.remove("aT_set_prio");
  box.classList.add(activeClass);
}

// Funktion, um alle divs inaktiv zu machen
function deactivateAll() {
  document.getElementById("boxUrgent").classList.remove("urgent_box_active");
  document.getElementById("boxUrgent").classList.add("aT_set_prio");

  document.getElementById("boxMedium").classList.remove("medium_box_active");
  document.getElementById("boxMedium").classList.add("aT_set_prio");

  document.getElementById("boxLow").classList.remove("low_box_active");
  document.getElementById("boxLow").classList.add("aT_set_prio");
}

//_____________________________________________________________________________
//Contacts
document.addEventListener("DOMContentLoaded", function () {
  // Referenzen für Input-Feld und das div mit dem Pfeil
  const inputField = document.getElementById("aT_select_contacts");
  const arrowConContainer = document.getElementById(
    "select_contacts_arrow_container"
  );
  const arrowImage = arrowConContainer.querySelector("img");
  const dropDowncontacts = document.getElementById("contact_list");
  const selectedContacts = document.getElementById("selected_contacts");

  // Funktion zum Aktivieren des Input-Feldes
  function activateField(event) {
    event.stopPropagation(); // Verhindert, dass der Klick das Dokument beeinflusst

    inputField.classList.add("active-border");
    arrowImage.classList.add("rotate");
    dropDowncontacts.classList.remove("d-none");
    selectedContacts.classList.add("d-none");
    renderContacts();
    inputField.focus(); // Fokussiert das Eingabefeld
  }

  // Funktion zum Deaktivieren des Input-Feldes
  function deactivateField() {
    inputField.classList.remove("active-border");
    arrowImage.classList.remove("rotate");
    dropDowncontacts.classList.add("d-none");
    selectedContacts.classList.remove("d-none");
    inputField.value = ""; // Löscht den Text im Input-Feld
  }

  // Event Listener für das select contacts Input-Feld (aktivieren des Input-Feldes)
  inputField.addEventListener("click", activateField);

  // Event Listener für das div mit dem Pfeil (aktivieren oder deaktivieren des Input-Feldes)
  arrowConContainer.addEventListener("click", function (event) {
    event.stopPropagation(); // Verhindert, dass der Klick das Dokument beeinflusst
    if (inputField.classList.contains("active-border")) {
      deactivateField(); // Deaktivieren, wenn das Input-Feld bereits aktiv ist
    } else {
      activateField(event); // Aktivieren, wenn das Input-Feld nicht aktiv ist
    }
  });

  // Event Listener für Klicks auf das gesamte Dokument (deaktivieren des Input-Feldes)
  document.addEventListener("click", function (event) {
    if (
      !inputField.contains(event.target) &&
      !arrowConContainer.contains(event.target)
    ) {
      deactivateField(); // Deaktivieren, wenn außerhalb des Input-Feldes und des Arrow-Containers geklickt wird
    }
  });
});

//'##################################################################################################################
//CATEGORY
document.addEventListener("DOMContentLoaded", function () {
  // Referenzen für category-Input-Feld und das div mit dem Pfeil
  const inputField = document.getElementById("aT_select_category");
  const arrowConContainer = document.getElementById(
    "select_category_arrow_container"
  );
  const arrowImage = arrowConContainer.querySelector("img");
  const dropDownCategories = document.getElementById("category_list");
  const categoryOptions = document.querySelectorAll(".categories");

  // Ursprünglicher Text
  const originalText = "Select task category";

  // Funktion zum Aktivieren des Input-Feldes
  function activateField() {
    arrowImage.classList.add("rotate");
    dropDownCategories.classList.remove("d-none");
  }

  // Funktion zum Deaktivieren des Input-Feldes
  function deactivateField() {
    arrowImage.classList.remove("rotate");
    dropDownCategories.classList.add("d-none");
  }

  // Funktion zum Umschalten des Zustands des Input-Feldes (Aktivieren oder Deaktivieren)
  function toggleField(event) {
    event.stopPropagation(); // Verhindert, dass der Klick das Dokument beeinflusst

    // Prüfen, ob der Text bereits geändert wurde und zurücksetzen, wenn ja
    if (inputField.textContent !== originalText) {
      inputField.textContent = originalText; // Setze auf den ursprünglichen Text zurück
    }

    if (arrowImage.classList.contains("rotate")) {
      deactivateField(); // Deaktivieren, wenn das Feld aktiv ist
    } else {
      activateField(); // Aktivieren, wenn das Feld nicht aktiv ist
    }
  }

  // Funktion zum Auswählen einer Kategorie und Schließen des Dropdowns
  function selectCategory(event) {
    const selectedCategory = event.target.textContent;
    inputField.textContent = selectedCategory; // Update der ausgewählten Kategorie
    deactivateField(); // Schließe das Dropdown nach Auswahl
  }

  // Event Listener für das select Input-Feld (umschalten des Zustands)
  inputField.addEventListener("click", toggleField);

  // Event Listener für das div mit dem Pfeil (umschalten des Zustands)
  arrowConContainer.addEventListener("click", toggleField);

  // Event Listener für Klicks auf das gesamte Dokument (deaktivieren des Input-Feldes)
  document.addEventListener("click", function (event) {
    if (
      !inputField.contains(event.target) &&
      !arrowConContainer.contains(event.target) &&
      !dropDownCategories.contains(event.target)
    ) {
      deactivateField(); // Deaktivieren, wenn außerhalb des Input-Feldes und des Arrow-Containers geklickt wird
    }
  });

  // Event Listener für jede Kategorie-Option
  categoryOptions.forEach(function (option) {
    option.addEventListener("click", selectCategory);
  });
});

function cancel_input_subtask() {
  document.getElementById("aT_add_subtasks").value = "";
}

//ADD SUBTASKS
// Funktion zum Umschalten der Sichtbarkeit beim Aktivieren des Input-Felds
function toggleDivVisibility() {
  document.getElementById("aktive_input_addSubtask").classList.add("d-none");
  document.getElementById("close_and_check_btns").classList.remove("d-none");
}

// Funktion zum Zurücksetzen der Sichtbarkeit beim Deaktivieren des Input-Felds
function resetDivVisibility() {
  document.getElementById("aktive_input_addSubtask").classList.remove("d-none");
  document.getElementById("close_and_check_btns").classList.add("d-none");
}

// Funktion zum Hinzufügen eines neuen Subtask zur Liste
function addSubtaskToList() {
  const inputField = document.getElementById("aT_add_subtasks");
  const subtaskText = inputField.value.trim(); // Eingabetext holen und trimmen (um Leerzeichen zu entfernen)

  if (subtaskText !== "") {
    // HTML-String für ul, li, Buttons und Separator
    const newListHTML = /*html*/ `
      <ul class="task-item">
        <li class="task-text">${subtaskText}</li>
        <div class="task-controls">
        <img src="./assets/img/subTask_edit.svg" alt="Edit" class="task-btn edit-btn" onclick="editTask(this)">
          <div class="separator_subtasks"></div>
          <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn delete-btn" onclick="deleteTask(this)">
        </div>
      </ul>`;

    // Neue Liste (ul mit li, Buttons und Separator) in die Div (created_subtasks) einfügen
    document.getElementById("created_subtasks").innerHTML += newListHTML;

    // Input-Feld leeren
    inputField.value = "";

    // Optional: Divs wieder zurücksetzen
    resetDivVisibility();
  }
}

//ab hier edit der subtasks
function editTask(editButton) {
  const taskItem = editButton.closest(".task-item");
  const taskTextElement = taskItem.querySelector(".task-text");

  // Erstelle Editier-Layout
  const currentText = taskTextElement.textContent;

  // Änderung in Bearbeitungsansicht / Editiermodus
  taskItem.innerHTML = /*html*/ `
    <input type="text" value="${currentText}" class="edit-input">
    <div class="task-controls">
      <div class="edit-modus-btns">
     <img src="./assets/img/subTask_delete.svg" alt="Delete" class="task-btn-input delete-btn-input" onclick="deleteTask(this)"></div>
       <div class="separator_subtasks"></div>
       <div class="edit-modus-btns">
     <img src="./assets/img/edit_subtask_check.svg" alt="Save" class="task-btn-input save-btn-input" onclick="saveTask(this)"></div>
    </div>
  `;
  // Fokussiere das Input-Feld
  const inputField = taskItem.querySelector(".edit-input");
  inputField.focus();

  // Setze den Cursor ans Ende des Textes
  const textLength = inputField.value.length;
  inputField.setSelectionRange(textLength, textLength);
}

function saveTask(saveButton) {
  const taskItem = saveButton.closest(".task-item");
  const inputElement = taskItem.querySelector(".edit-input");

  if (!inputElement) {
    console.error("Input element not found");
    return;
  }

  const taskTextElement = document.createElement("li");
  taskTextElement.className = "task-text";
  taskTextElement.textContent = inputElement.value.trim();

  const taskControls = taskItem.querySelector(".task-controls");

  // Setze den Inhalt der Aufgabe zurück
  taskItem.innerHTML = "";
  taskItem.appendChild(taskTextElement);
  taskItem.appendChild(taskControls);

  // Optional: zurücksetzen der ursprünglichen Kontrollen
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

// Event Listener für das input-Feld, um es zu aktivieren und Divs umzuschalten
document
  .getElementById("aT_add_subtasks")
  .addEventListener("click", toggleDivVisibility);

// Event Listener für die div (aktive_input_addSubtask), um das Input-Feld zu fokussieren und die Divs umzuschalten
document
  .getElementById("aktive_input_addSubtask")
  .addEventListener("click", function () {
    document.getElementById("aT_add_subtasks").focus(); // Input-Feld fokussieren
    toggleDivVisibility(); // Sichtbarkeit umschalten
  });

// Event Listener für die div (cancel_input_subtasks), um das Input-Feld zu deaktivieren und Divs zurückzusetzen
document
  .getElementById("cancel_input_subtasks")
  .addEventListener("click", function () {
    document.getElementById("aT_add_subtasks").blur(); // Input-Feld verliert den Fokus (deaktivieren)
    resetDivVisibility(); // Sichtbarkeit zurücksetzen
  });

// Event Listener für die div (check_input_subtask), um den Text zu speichern und zur Liste hinzuzufügen
document
  .getElementById("check_input_subtask")
  .addEventListener("click", addSubtaskToList);

document
  .getElementById("aT_add_subtasks")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Verhindert, dass ein Zeilenumbruch eingefügt wird
      addSubtaskToList();
    }
  });

const input = document.querySelector(".aT_input_date");

input.addEventListener("input", function () {
  if (this.value) {
    // Wenn ein Datum ausgewählt wurde
    this.style.color = "#000000"; // Farbe nach Auswahl (z.B. Schwarz)
  } else {
    // Wenn kein Datum ausgewählt ist oder das Feld wieder leer wird
    this.style.color = "#d1d1d1"; // Farbe für den Placeholder
  }
});
