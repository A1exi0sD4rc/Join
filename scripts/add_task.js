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

  // Funktion zum Aktivieren des Input-Feldes
  function activateField(event) {
    event.stopPropagation(); // Verhindert, dass der Klick das Dokument beeinflusst

    inputField.classList.add("active-border");
    arrowImage.classList.add("rotate");
    dropDowncontacts.classList.remove("d-none");
  }

  // Funktion zum Deaktivieren des Input-Feldes
  function deactivateField() {
    inputField.classList.remove("active-border");
    arrowImage.classList.remove("rotate");
    dropDowncontacts.classList.add("d-none");
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
