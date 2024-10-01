function init_ll_pp_hp() {
  includeHTML();
  awaitGenerateInitials();
}

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
  highlightActiveLink();
}

/**
 * Highlights the active link or container based on the current URL.
 *
 */
function highlightActiveLink() {
  const currentUrl = window.location.href;

  highlightSidebarLinks(currentUrl);
  highlightBottomContainers(currentUrl);
}

/**
 * Highlights links within the .sidebar_links_center container if their href matches the current URL.
 *
 * @param {string} currentUrl - The current URL to compare against the href attributes of links.
 */
function highlightSidebarLinks(currentUrl) {
  const sidebarLinksContainer = document.querySelector(".sidebar_links_center");
  if (sidebarLinksContainer) {
    const sidebarLinks = sidebarLinksContainer.querySelectorAll("a");
    sidebarLinks.forEach((link) => {
      if (link.href === currentUrl) {
        link.classList.add("sidebar_current_link");
      }
    });
  }
}

/**
 * Highlights the container within .links_bottom_container if its contained link's href matches the current URL.
 *
 * @param {string} currentUrl - The current URL to compare against the href attributes of links.
 */
function highlightBottomContainers(currentUrl) {
  const bottomContainers = document.querySelectorAll(".links_bottom_container");
  bottomContainers.forEach((container) => {
    const link = container.querySelector("a");
    if (link && link.href === currentUrl) {
      container.classList.add("sidebar_current_link");
    }
  });
}

function goBack() {
  window.history.back();
}

/**
 * Generate initials for the top right corner in the header section.
 */
function generateInitials() {
  let content = document.getElementById("user-logo");

  let userName = sessionStorage.getItem("userName");
  content.innerHTML = "";

  if (userName) {
    let nameParts = userName.split(" ");
    if (nameParts.length >= 2) {
      let initials = nameParts[0][0] + nameParts[1][0];
      content.innerHTML = initials;
    } else if (nameParts.length === 1) {
      let initials = nameParts[0][0];
      content.innerHTML = initials;
    } else {
      content.innerHTML = "G";
    }
  } else {
    content.innerHTML = "G";
  }
}

/**
 * Ensures that the includeHTML is fully loaded before attempting to access user-logo.
 */
function awaitGenerateInitials() {
  const interval = setInterval(() => {
    const userLogo = document.getElementById("user-logo");
    const helpUser = document.querySelector(".header_help_icon_container");
    const sidebarUser = document.querySelector(".sidebar_links_center");

    if (userLogo) {
      clearInterval(interval);
      const userName = sessionStorage.getItem("userName");

      if (!userName) {
        userLogo.style.display = "none";
        if (helpUser) helpUser.style.display = "none";
        // if (sidebarUser) sidebarUser.style.display = "none"; //vorübergehend ausgeblendet, weil sonst die sidebar immer weg war auf der addTask Seite (Judith), soll eigtl. nur bei PP und Ln passieren.
      } else {
        generateInitials();
        userLogo.style.display = "flex";
      }
    }
  }, 10);
}

/**
 * Brings the user back to the login.html page. Goes in the dropdown menu when you click on the user icon.
 */
function logOut() {
  if (sessionStorage.getItem("userName")) {
    sessionStorage.removeItem("userName");
    localStorage.removeItem("greetingShown");
  }
}

function toggleMenu() {
  const userContent = document.getElementById("user-content");
  if (userContent.style.display === "block") {
    userContent.style.display = "none";
  } else {
    userContent.style.display = "block";
  }
}

/**
 * Brings the user back to the index.html page if not logged in.
 * Ensure that the user can't access pages like summary.html or board.html without login.
 */
function checkLogin() {
  const userName = sessionStorage.getItem("userName");

  if (!userName) {
    window.location.href = "index.html";
  }
}
