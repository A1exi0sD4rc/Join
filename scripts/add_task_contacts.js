let CONTACTS_URL = "https://join337-40cd8-default-rtdb.europe-west1.firebasedatabase.app/contacts";

contactsAddTask = [];
let selectedContacts = [];

/**
 * fetches contacts, adds the current user if not included, and renders the contact list.
 *
 */
async function getContacts() {
  let response = await fetch(CONTACTS_URL + ".json");
  let responseAsJson = await response.json();

  try {
    contactsAddTask = Object.values(responseAsJson);
    contactsAddTask.sort((a, b) => a.name.localeCompare(b.name));

    let userName = sessionStorage.getItem("userName");
    if (
      userName &&
      !contactsAddTask.some((contact) => contact.name === `${userName} (You)`)
    ) {
      let userContact = {
        name: `${userName} (You)`,
        bgcolor: "#29abe2",
        initials: getInitials(userName),
      };

      contactsAddTask.unshift(userContact);
    }

    renderContacts();
    loadSelectedContactsFromSession();
  } catch (error) {
    console.log(error);
  }
}

/**
 * generates initials from a given name.
 * @param {*} name
 * @returns
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/**
 * Renders the list of contacts inside the "contacts_container" element.
 * Clears any existing content in the container, iterates over each contact,
 * and appends the contact's HTML representation with the appropriate styles
 * based on the contact's selected status.
 *
 * @function
 * @global
 */
function renderContacts() {
  let contactContainer = document.getElementById("contacts_container");
  contactContainer.innerHTML = "";
  contactsAddTask.forEach((contact, i) => {
    let { contactClass, checkboxImage, contactTextColorClass, initials } =
      getContactStyles(contact);
    contactContainer.innerHTML += getContactHTML(
      contact,
      i,
      contactClass,
      checkboxImage,
      contactTextColorClass,
      initials
    );
  });
}

/**
 * Generates style attributes for a contact based on selection status.
 *
 * @param {Object} contact - The contact object containing details for styling.
 * @returns {Object} - An object with style attributes: `contactClass`, `checkboxImage`, `contactTextColorClass`, and `initials`.
 */
function getContactStyles(contact) {
  let checked = isSelected(contact);
  let contactClass = checked ? "contact-selected" : "contact-unselected";
  let checkboxImage = checked ? "checkbox-checked-white.png" : "checkbox.png";
  let contactTextColorClass = checked ? "text-white" : "text-black";
  let initials = getInitials(contact.name.replace(" (You)", ""));
  return { contactClass, checkboxImage, contactTextColorClass, initials };
}

/**
 * Generates the HTML for a contact element.
 * @param {Object} contact - The contact object containing name and background color.
 * @param {number} index - The index of the contact in the contacts list.
 * @param {string} contactClass - The CSS class to apply for selected/unselected state.
 * @param {string} checkboxImage - The file name of the checkbox image.
 * @param {string} contactTextColorClass - The CSS class to apply for text color.
 * @param {string} initials - The initials to display in the contact's avatar.
 * @returns {string} The HTML string for the contact element.
 */
function getContactHTML(
  contact,
  index,
  contactClass,
  checkboxImage,
  contactTextColorClass,
  initials
) {
  return `
    <div class="contact_container_element ${contactClass}" id="contact_${index}" onclick="toggleContact(${index})">
      <div style="display: flex; align-items: center; gap: 20px;" class="${contactTextColorClass}">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
          <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${initials}</text>
        </svg>
        <div id="contact_list_name">${contact.name}</div>
      </div>
      <img src="./assets/img/${checkboxImage}" class="checkbox-img" id="checkbox_${index}">
    </div>
  `;
}

/**
 * Toggles the selection state of a contact and updates the UI accordingly.
 * @param {number} index - The index of the contact in the contacts list.
 */
function toggleContact(index) {
  const contact = contactsAddTask[index];
  const contactElement = document.getElementById(`contact_${index}`);
  const checkboxImage = document.getElementById(`checkbox_${index}`);
  const textContainer = contactElement.querySelector("div");
  if (isSelected(contact)) {
    deselectContact(contact, contactElement, textContainer, checkboxImage);
  } else {
    selectContact(contact, contactElement, textContainer, checkboxImage);
  }
  saveSelectedContactsToSession();
  displaySelectedContacts();
}

/**
 * Deselects a contact, updates the UI, and removes it from the selected contacts list.
 * @param {Object} contact - The contact object being deselected.
 * @param {HTMLElement} contactElement - The HTML element representing the contact.
 * @param {HTMLElement} textContainer - The container element for the contact's text.
 * @param {HTMLElement} checkboxImage - The checkbox image element for the contact.
 */
function deselectContact(
  contact,
  contactElement,
  textContainer,
  checkboxImage
) {
  contactElement.classList.remove("contact-selected");
  contactElement.classList.add("contact-unselected");
  textContainer.classList.remove("text-white");
  textContainer.classList.add("text-black");
  contactElement.style.backgroundColor = "#FFFFFF";
  checkboxImage.src = "./assets/img/checkbox.png";
  selectedContacts = selectedContacts.filter((c) => c.name !== contact.name);
}

/**
 * Selects a contact, updates the UI, and adds it to the selected contacts list.
 * @param {Object} contact - The contact object being selected.
 * @param {HTMLElement} contactElement - The HTML element representing the contact.
 * @param {HTMLElement} textContainer - The container element for the contact's text.
 * @param {HTMLElement} checkboxImage - The checkbox image element for the contact.
 */
function selectContact(contact, contactElement, textContainer, checkboxImage) {
  contactElement.classList.add("contact-selected");
  contactElement.classList.remove("contact-unselected");
  textContainer.classList.remove("text-black");
  textContainer.classList.add("text-white");
  contactElement.style.backgroundColor = "#2A3647";
  checkboxImage.src = "./assets/img/checkbox-checked-white.png";
  selectedContacts.push(contact);
}

/**
 * displays the selected contacts by rendering their initials in a designated container.
 *
 */
function displaySelectedContacts() {
  let selectedContainer = document.getElementById("selected_contacts");
  selectedContainer.innerHTML = "";
  for (let contact of selectedContacts) {
    let initials = getInitials(contact.name.replace(" (You)", ""));
    selectedContainer.innerHTML += `
      <div class="selected-contact">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
          <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${initials}</text>
        </svg>
      </div>
    `;
  }
}

/**
 * checks if a contact is selected by verifying its presence in the selectedContacts array.
 * @param {*} contact
 * @returns
 */
function isSelected(contact) {
  return selectedContacts.some((c) => c.name === contact.name);
}

/**
 * saves the selected contacts to session storage.
 *
 */
function saveSelectedContactsToSession() {
  sessionStorage.setItem("selectedContacts", JSON.stringify(selectedContacts));
}

/**
 * loads selected contacts from session storage and updates the selection state accordingly.
 *
 */
function loadSelectedContactsFromSession() {
  let savedContacts = sessionStorage.getItem("selectedContacts");
  if (savedContacts) {
    let tempSelectedContacts = JSON.parse(savedContacts);
    selectedContacts = tempSelectedContacts.filter((contact) =>
      contactsAddTask.some((c) => c.name === contact.name)
    );
    saveSelectedContactsToSession();
    restoreContactsState();
    displaySelectedContacts();
  } else {
    selectedContacts = [];
  }
}

/**
 * restores the visual state of contacts based on their selection status.
 *
 */
function restoreContactsState() {
  contactsAddTask.forEach((contact, index) => {
    let contactElement = document.getElementById(`contact_${index}`);
    let checkboxImage = document.getElementById(`checkbox_${index}`);
    if (isSelected(contact)) {
      contactElement.classList.add("contact-selected");
      contactElement.classList.remove("contact-unselected");
      contactElement.style.backgroundColor = "#2A3647";
      contactElement.style.color = "#FFFFFF";
      checkboxImage.src = "./assets/img/checkbox-checked-white.png";
    } else {
      contactElement.classList.add("contact-unselected");
      contactElement.classList.remove("contact-selected");
      contactElement.style.backgroundColor = "#FFFFFF";
      contactElement.style.color = "#000000";
      checkboxImage.src = "./assets/img/checkbox.png";
    }
  });
}

/**
 * clears the selected contacts and updates the display accordingly.
 *
 */
function clearSelectedContacts() {
  selectedContacts = [];
  sessionStorage.removeItem("selectedContacts");
  renderContacts();
  displaySelectedContacts();
}

/**
 * Renders the filtered list of contacts in the contacts container.
 * @param {Array} filteredContacts - An array of contact objects to be displayed.
 */
function renderFilteredContacts(filteredContacts) {
  let contactContainer = document.getElementById("contacts_container");
  contactContainer.innerHTML = "";
  if (filteredContacts.length > 0) {
    filteredContacts.forEach((contact) => {
      renderContact(contact, contactContainer);
    });
  } else {
    renderNoContactsMessage(contactContainer);
  }
}

/**
 * Renders a single contact within a specified container.
 *
 * @param {Object} contact - The contact object to render.
 * @param {HTMLElement} container - The DOM element where the contact will be rendered.
 */
function renderContact(contact, container) {
  const originalIndex = contactsAddTask.indexOf(contact);
  const { backgroundColor, checkboxImage, contactTextColor, contactClass } =
    getContactStyle(contact);
  const initials = getInitials(contact.name.replace(" (You)", ""));
  container.innerHTML += getFilteredContactHTML(
    originalIndex,
    contact,
    contactClass,
    backgroundColor,
    contactTextColor,
    checkboxImage,
    initials
  );
}

/**
 * Returns style properties for a contact based on selection status.
 *
 * @param {Object} contact - The contact object to style.
 * @returns {Object} Style properties including background color, checkbox image, text color, and CSS class.
 */
function getContactStyle(contact) {
  const checked = isSelected(contact);
  return {
    backgroundColor: checked ? "#2A3647" : "#FFFFFF",
    checkboxImage: checked ? "checkbox-checked-white.png" : "checkbox.png",
    contactTextColor: checked ? "#FFFFFF" : "#000000",
    contactClass: checked ? "contact-selected" : "contact-unselected",
  };
}

/**
 * Renders a message indicating no contacts are available.
 * @param {HTMLElement} container - The HTML container element where the message will be displayed.
 */
function renderNoContactsMessage(container) {
  container.innerHTML += getNoContactHTML();
}

/**
 * Generates the HTML for a contact element.
 * @param {number} index - The index of the contact in the contacts list.
 * @param {Object} contact - The contact object containing name and background color.
 * @param {string} contactClass - The CSS class for selected/unselected state.
 * @param {string} backgroundColor - The background color for the contact element.
 * @param {string} textColor - The color for the contact text.
 * @param {string} checkboxImage - The file name of the checkbox image.
 * @param {string} initials - The initials to display in the contact's avatar.
 * @returns {string} The HTML string for the contact element.
 */
function getFilteredContactHTML(
  index,
  contact,
  contactClass,
  backgroundColor,
  textColor,
  checkboxImage,
  initials
) {
  return `
    <div class="contact_container_element ${contactClass}" id="contact_${index}" style="background-color: ${backgroundColor}" onclick="toggleContact(${index})">
      <div style="display: flex; align-items: center; gap: 20px; color: ${textColor}">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
          <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${initials}</text>
        </svg>
        <div id="contact_list_name">${contact.name}</div>
      </div>
      <img src="./assets/img/${checkboxImage}" class="checkbox-img" id="checkbox_${index}">
    </div>
  `;
}

/**
 * Generates the HTML for the "No Contact found" message.
 * @returns {string} The HTML string for the no-contact message element.
 */
function getNoContactHTML() {
  return `
    <div class="contact_container_element" style="background-color: #FFFFFF"> 
      <div style="display: flex; align-items: center; gap: 20px; color: #000000">
        <div id="contact_list_name">No Contact found.</div> 
      </div> 
    </div>
  `;
}
