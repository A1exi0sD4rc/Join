let CONTACTS_URL =
  "https://join-337-userlist-default-rtdb.firebaseio.com/contacts";

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
 * renders a list of contacts in the contact container, updating their display based on selection status.
 * 
 */
function renderContacts() {
  let contactContainer = document.getElementById("contacts_container");
  contactContainer.innerHTML = "";

  contactsAddTask.forEach((contact, i) => {
    let checked = isSelected(contact);
    let contactClass = checked ? "contact-selected" : "contact-unselected";
    let checkboxImage = checked ? "checkbox-checked-white.png" : "checkbox.png";
    let contactTextColorClass = checked ? "text-white" : "text-black";
    let initials = getInitials(contact.name.replace(" (You)", ""));

    contactContainer.innerHTML += `
      <div class="contact_container_element ${contactClass}" id="contact_${i}" onclick="toggleContact(${i})">
        <div style="display: flex; align-items: center; gap: 20px;" class="${contactTextColorClass}">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
            <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${initials}</text>
          </svg>
          <div id="contact_list_name">${contact.name}</div>
        </div>
        <img src="./assets/img/${checkboxImage}" class="checkbox-img" id="checkbox_${i}">
      </div>
    `;
  });
}

/**
 * toggles the selection state of a contact and updates the UI accordingly.
 * @param {*} index 
 */
function toggleContact(index) {
  let contact = contactsAddTask[index];
  let contactElement = document.getElementById(`contact_${index}`);
  let checkboxImage = document.getElementById(`checkbox_${index}`);
  let textContainer = contactElement.querySelector("div");

  if (isSelected(contact)) {
    contactElement.classList.remove("contact-selected");
    contactElement.classList.add("contact-unselected");
    textContainer.classList.remove("text-white");
    textContainer.classList.add("text-black");
    contactElement.style.backgroundColor = "#FFFFFF";
    checkboxImage.src = "./assets/img/checkbox.png";
    selectedContacts = selectedContacts.filter((c) => c.name !== contact.name);
  } else {
    contactElement.classList.add("contact-selected");
    contactElement.classList.remove("contact-unselected");
    textContainer.classList.remove("text-black");
    textContainer.classList.add("text-white");
    contactElement.style.backgroundColor = "#2A3647";
    checkboxImage.src = "./assets/img/checkbox-checked-white.png";
    selectedContacts.push(contact);
  }

  saveSelectedContactsToSession();
  displaySelectedContacts();
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
      let originalIndex = contactsAddTask.indexOf(contact);
      let checked = isSelected(contact);
      let backgroundColor = checked ? "#2A3647" : "#FFFFFF";
      let checkboxImage = checked
        ? "checkbox-checked-white.png"
        : "checkbox.png";
      let contactTextColor = checked ? "#FFFFFF" : "#000000";
      let contactClass = checked ? "contact-selected" : "contact-unselected";
      let initials = getInitials(contact.name.replace(" (You)", ""));

      contactContainer.innerHTML += `
      <div class="contact_container_element ${contactClass}" id="contact_${originalIndex}" style="background-color: ${backgroundColor}" onclick="toggleContact(${originalIndex})">
        <div style="display: flex; align-items: center; gap: 20px; color: ${contactTextColor}">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
            <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${initials}</text>
          </svg>
          <div id="contact_list_name">${contact.name}</div>
        </div>
        <img src="./assets/img/${checkboxImage}" class="checkbox-img" id="checkbox_${originalIndex}">
      </div>
    `;
    });
  } else {
    contactContainer.innerHTML += `
      <div class="contact_container_element" style="background-color: #FFFFFF"> 
        <div style="display: flex; align-items: center; gap: 20px; color: #000000">
          <div id="contact_list_name">No Contact found with this name.</div> 
        </div> 
      </div>
    `;
  }
}
