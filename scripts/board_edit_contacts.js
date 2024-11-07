/**
 * Toggles the visibility of the contacts dropdown based on the input field's active state.
 * @param {*} event
 */
function toggleDropdownEdit(event) {
  event.stopPropagation();

  const inputFieldContacts = document.getElementById("aT_select_contacts_edit");
  if (inputFieldContacts.classList.contains("active-border")) {
    deactivateFieldContactsEdit();
  } else {
    activateFieldContactsEdit();
  }
}

/**
 * Activates the contacts input field, displays the dropdown,
 * and renders the contacts list for editing.
 */
function activateFieldContactsEdit() {
  const inputFieldContacts = document.getElementById("aT_select_contacts_edit");
  const arrowConConImage = document.querySelector(
    "#select_contacts_arrow_container_edit img"
  );
  const dropDowncontacts = document.getElementById("contact_list_edit");
  const selectedContactsCon = document.getElementById("selected_contacts_edit");

  inputFieldContacts.classList.add("active-border");
  arrowConConImage.classList.add("rotate");
  dropDowncontacts.classList.remove("d-none");
  selectedContactsCon.classList.add("d-none");
  renderContactsEdit();
  inputFieldContacts.focus();
}

/**
 * Deactivates the contacts input field, hides the dropdown,
 * and restores the selected contacts display.
 */
function deactivateFieldContactsEdit() {
  const inputFieldContacts = document.getElementById("aT_select_contacts_edit");
  const arrowConConImage = document.querySelector(
    "#select_contacts_arrow_container_edit img"
  );
  const dropDowncontacts = document.getElementById("contact_list_edit");
  const selectedContactsCon = document.getElementById("selected_contacts_edit");

  inputFieldContacts.classList.remove("active-border");
  arrowConConImage.classList.remove("rotate");
  dropDowncontacts.classList.add("d-none");
  selectedContactsCon.classList.remove("d-none");
  inputFieldContacts.value = "";
  inputFieldContacts.blur();
}

/**
 * Displays contacts in the edit interface, updating their selection state
 * and showing initials and names.
 */
function renderContactsEdit() {
  let contactContainer = document.getElementById("contacts_container_edit");
  contactContainer.innerHTML = "";

  contactsAddTask.forEach((contact, i) => {
    let checked = isSelected(contact);
    let contactClass = checked ? "contact-selected" : "contact-unselected";
    let checkboxImage = checked ? "checkbox-checked-white.png" : "checkbox.png";
    let contactTextColorClass = checked ? "text-white" : "text-black";
    let initials = getInitials(contact.name.replace(" (You)", ""));

    contactContainer.innerHTML += getContactEditHTML(
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
 * Generates the HTML for a contact element.
 * @param {Object} contact - The contact object containing name and background color.
 * @param {number} index - The index of the contact in the contacts list.
 * @param {string} contactClass - The CSS class to apply for selected/unselected state.
 * @param {string} checkboxImage - The file name of the checkbox image.
 * @param {string} contactTextColorClass - The CSS class to apply for text color.
 * @param {string} initials - The initials to display in the contact's avatar.
 * @returns {string} The HTML string for the contact element.
 */
function getContactEditHTML(
  contact,
  i,
  contactClass,
  checkboxImage,
  contactTextColorClass,
  initials
) {
  return `
        <div class="contact_container_element ${contactClass}" id="contact_edit_${i}" onclick="toggleContactEdit(${i})">
          <div style="display: flex; align-items: center; gap: 20px;" class="${contactTextColorClass}">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
              <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${initials}</text>
            </svg>
            <div id="contact_list_name">${contact.name}</div>
          </div>
          <img src="./assets/img/${checkboxImage}" class="checkbox-img" id="checkbox_edit_${i}">
        </div>
      `;
}

/**
 * Toggles a contact's selection state and updates the display and selectedContacts array.
 * @param {number} index - The index of the contact to toggle in the contacts array.
 */
function toggleContactEdit(index) {
  let contact = contactsAddTask[index];
  let contactElement = document.getElementById(`contact_edit_${index}`);
  let checkboxImage = document.getElementById(`checkbox_edit_${index}`);
  let textContainer = contactElement.querySelector("div");

  if (isSelected(contact)) {
    deselectContact(contact, contactElement, textContainer, checkboxImage);
  } else {
    selectContact(contact, contactElement, textContainer, checkboxImage);
  }

  updateSelectedContactsDisplayEdit();
}

/**
 * Clears the display of selected contacts and updates it by adding each contact from the selectedContacts array.
 */
function updateSelectedContactsDisplayEdit() {
  let selectedContactsContainer = document.getElementById(
    "selected_contacts_edit"
  );
  selectedContactsContainer.innerHTML = "";
  selectedContacts.forEach((contact) => {
    addSelectedContact(contact);
  });
}

/**
 * Adds a visual representation of a selected contact to the display,
 * showing their initials and background color in a circular SVG format.
 * @param {Object} contact - The contact object to be added to the display.
 */
function addSelectedContact(contact) {
  let selectedContactsContainer = document.getElementById(
    "selected_contacts_edit"
  );
  let initials = getInitials(contact.name.replace(" (You)", ""));

  selectedContactsContainer.innerHTML += `
      <div class="selected-contact" id="selected_contact_${contact.name}">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="21" fill="${contact.bgcolor}" stroke="white" stroke-width="3"/>
          <text x="21" y="27" text-anchor="middle" font-size="15" fill="white">${initials}</text>
        </svg>
      </div>
    `;
}

/**
 * Deletes the displayed element of a selected contact from the DOM based on their name.
 * @param {string} contactName - The name of the contact to be removed from the display.
 */
function removeSelectedContact(contactName) {
  let selectedContactElement = document.getElementById(
    `selected_contact_${contactName}`
  );
  if (selectedContactElement) {
    selectedContactElement.remove();
  }
}

/**
 * Checks if a given contact is in the selectedContacts array by comparing names.
 * @param {Object} contact - The contact object to check.
 * @returns {boolean} True if the contact is selected, otherwise false.
 */
function isSelected(contact) {
  return selectedContacts.some(
    (selectedContact) => selectedContact.name === contact.name
  );
}

/**
 * Creates HTML for displaying assigned contacts with their initials
 * or returns an empty div if none are assigned.
 * @param {Array} assigned - Array of assigned contacts to be displayed.
 * @returns {string} The HTML string for the assigned contacts display.
 */
function renderSelectedContactsFromDatabase(assigned) {
  if (assigned && assigned.length > 0) {
    let contactsHtml = assigned
      .map((contact) => {
        let initials = getInitials(contact.name.replace(" (You)", ""));
        return `
          <div class="selected-contact" id="selected_contact_edit_${contact.name}">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21" cy="21" r="21" fill="${contact.bgcolor}" stroke="white" stroke-width="3"/>
            <text x="21" y="27" text-anchor="middle" font-size="15" fill="white">${initials}</text>
          </svg>
        </div>
        `;
      })
      .join("");
    return contactsHtml;
  } else {
    return `<div class="assigned-contact" style="position: relative; display: inline-block;"></div>`;
  }
}

/**
 * Filters contacts in the edit mode based on the input value and displays the matching contacts.
 */
function filterContactsEdit() {
  let inputFieldContacts = document.getElementById("aT_select_contacts_edit");
  let searchQuery = inputFieldContacts.value.toLowerCase();
  let filteredContacts = contactsAddTask.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery)
  );
  renderFilteredContactsEdit(filteredContacts);
}

/**
 * Displays filtered contacts with their initials and checkboxes, or shows a "No Contact found" message if none match.
 * @param {Array<Object>} filteredContacts - The filtered list of contact objects to display.
 */
function renderFilteredContactsEdit(filteredContacts) {
  let contactContainer = document.getElementById("contacts_container_edit");
  contactContainer.innerHTML = "";

  if (filteredContacts.length > 0) {
    filteredContacts.forEach((contact) => {
      let originalIndex = contactsAddTask.indexOf(contact);
      let checked = isSelected(contact);
      let backgroundColor = checked ? "#2A3647" : "#FFFFFF";
      let checkboxImage = checked
        ? "checkbox-checked-white.png"
        : "checkbox.png";
      let contactTextColorClass = checked ? "text-white" : "text-black";
      let contactClass = checked ? "contact-selected" : "contact-unselected";
      let initials = getInitials(contact.name.replace(" (You)", ""));

      contactContainer.innerHTML += getFilteredContactEditHTML(
        originalIndex,
        contact,
        contactClass,
        backgroundColor,
        contactTextColorClass,
        checkboxImage,
        initials
      );
    });
  } else {
    contactContainer.innerHTML += getNoContactEditHTML();
  }
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
function getFilteredContactEditHTML(
  originalIndex,
  contact,
  contactClass,
  backgroundColor,
  contactTextColorClass,
  checkboxImage,
  initials
) {
  return `
        <div class="contact_container_element ${contactClass}" id="contact_edit_${originalIndex}" style="background-color: ${backgroundColor}" onclick="toggleContactEdit(${originalIndex})">
          <div style="display: flex; align-items: center; gap: 20px;" class="${contactTextColorClass}">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
              <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${initials}</text>
            </svg>
            <div id="contact_list_name">${contact.name}</div>
          </div>
          <img src="./assets/img/${checkboxImage}" class="checkbox-img" id="checkbox_edit_${originalIndex}">
        </div>
      `;
}

/**
 * Generates the HTML for the "No Contact found" message.
 * @returns {string} The HTML string for the no-contact message element.
 */
function getNoContactEditHTML() {
  return `
        <div class="contact_container_element" style="background-color: #FFFFFF"> 
          <div style="display: flex; align-items: center; gap: 20px; color: #000000">
            <div id="contact_list_name">No Contact found.</div> 
          </div> 
        </div>
      `;
}
