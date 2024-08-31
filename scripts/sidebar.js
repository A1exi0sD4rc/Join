// document.addEventListener("DOMContentLoaded", function () {
//   const links = document.querySelectorAll("a");
//   const currentUrl = window.location.pathname.split("/").pop(); // Aktueller Dateiname

//   links.forEach((link) => {
//     if (link.getAttribute("href").includes(currentUrl)) {
//       link.classList.add("sidebar_current_link");
//     }
//   });
// });

// Funktion, die den aktuellen Link hervorhebt
function highlightActiveLink() {
  // Holen der aktuellen URL
  const currentUrl = window.location.href;

  // Alle Links im Navigationsbereich
  const links = document.querySelectorAll("nav a");

  links.forEach((link) => {
    // Vergleichen des href des Links mit der aktuellen URL
    if (link.href === currentUrl) {
      // Füge die Klasse hinzu, wenn die URLs übereinstimmen
      link.classList.add("active-link");
    }
  });
}

// Funktion aufrufen, wenn die Seite geladen wird
window.onload = highlightActiveLink;
