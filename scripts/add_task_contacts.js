let CONTACTS_URL =
  "https://join-a2f86-default-rtdb.europe-west1.firebasedatabase.app/contacts";

contactsAddTask = [];
let selectedContacts = [];

async function getContacts() {
  let response = await fetch(CONTACTS_URL + ".json");
  let responseAsJson = await response.json();

  try {
    contactsAddTask = Object.values(responseAsJson);
    console.log("Contacts fetched:", contactsAddTask);
    contactsAddTask.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.log(error);
  }
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}

function renderContacts() {
  let contactContainer = document.getElementById("contacts_container");
  contactContainer.innerHTML = "";

  for (let i = 0; i < contactsAddTask.length; i++) {
    let contact = contactsAddTask[i];
    contactContainer.innerHTML += `
      <div>
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="20" fill="${
            contact.bgcolor
          }" stroke="white" stroke-width="2"/>
          <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${getInitials(
            contact.name
          )}</text>
        </svg>
        <div>${contact.name}</div>
        <input type="checkbox" class="contact-checkbox" onchange="selectContact(${i}, this)">
      </div>
    `;
  }
}

function selectContact(index, checkbox) {
  let contact = contactsAddTask[index];

  if (checkbox.checked) {
    if (!selectedContacts.includes(contact)) {
      selectedContacts.push(contact);
    }
  } else {
    selectedContacts = selectedContacts.filter((c) => c !== contact);
  }

  displaySelectedContacts();
}

function displaySelectedContacts() {
  let selectedContainer = document.getElementById("selected_contacts");
  selectedContainer.innerHTML = "";

  for (let i = 0; i < selectedContacts.length; i++) {
    let contact = selectedContacts[i];
    selectedContainer.innerHTML += `
      <div class="selected-contact">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="20" fill="${
            contact.bgcolor
          }" stroke="white" stroke-width="2"/>
          <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${getInitials(
            contact.name
          )}</text>
        </svg>
      </div>
    `;
  }
}
