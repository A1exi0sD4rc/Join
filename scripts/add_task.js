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

document.addEventListener("DOMContentLoaded", function () {
  // Referenzen für Input-Feld und das div mit dem Pfeil
  const inputField = document.getElementById("aT_select_contacts");
  const arrowContainer = document.querySelector(".drop_down_arrow_container");
  const arrowImage = arrowContainer.querySelector("img");

  // Funktion zum Aktivieren des Input-Feldes
  function activateField(event) {
    event.stopPropagation(); // Verhindert, dass der Klick das Dokument beeinflusst

    inputField.classList.add("active-border");
    arrowImage.classList.add("rotate");
  }

  // Funktion zum Deaktivieren des Input-Feldes
  function deactivateField() {
    inputField.classList.remove("active-border");
    arrowImage.classList.remove("rotate");
    inputField.value = ""; // Löscht den Text im Input-Feld
  }

  // Event Listener für das Input-Feld (aktivieren des Input-Feldes)
  inputField.addEventListener("click", activateField);

  // Event Listener für das div mit dem Pfeil (aktivieren oder deaktivieren des Input-Feldes)
  arrowContainer.addEventListener("click", function (event) {
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
      !arrowContainer.contains(event.target)
    ) {
      deactivateField(); // Deaktivieren, wenn außerhalb des Input-Feldes und des Arrow-Containers geklickt wird
    }
  });
});
