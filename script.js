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

/**
 * Saves the current page URL in localStorage and then navigates to the specified target URL.
 *
 * @param {string} targetUrl - The URL of the page to navigate to.
 * @returns {void}
 *
 * @example
 * // Saves the current page and navigates to 'legal-notice.html'
 * saveCurrentPageAndNavigate('legal-notice.html');
 */
function saveCurrentPageAndNavigate(targetUrl) {
  localStorage.setItem("previousPage", window.location.href);
  window.location.href = targetUrl;
}

/**
 * Navigates to the previously stored page URL from localStorage.
 * If no previous page URL is stored, alerts the user that no previous page is available.
 *
 * @returns {void}
 *
 * @example
 * // Navigates back to the previously stored page
 * goBack();
 */
function goBack() {
  const previousPage = localStorage.getItem("previousPage");
  if (previousPage) {
    window.location.href = previousPage;
  } else {
    alert("No previous page stored.");
  }
}
