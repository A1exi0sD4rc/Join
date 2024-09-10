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
