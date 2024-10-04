let CONTACTS_URL =
  "https://join-337-userlist-default-rtdb.firebaseio.com/contacts";

contactsAddTask = [];
let selectedContacts = [];

async function getContacts() {
  let response = await fetch(CONTACTS_URL + ".json");
  let responseAsJson = await response.json();

  try {
    contactsAddTask = Object.values(responseAsJson);
    console.log("All contacts:", contactsAddTask);
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

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function renderContacts() {
  let contactContainer = document.getElementById("contacts_container");
  contactContainer.innerHTML = "";

  for (let i = 0; i < contactsAddTask.length; i++) {
    let contact = contactsAddTask[i];
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
  }
}

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

function isSelected(contact) {
  return selectedContacts.some((c) => c.name === contact.name);
}

function saveSelectedContactsToSession() {
  sessionStorage.setItem("selectedContacts", JSON.stringify(selectedContacts));
}

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

function clearSelectedContacts() {
  selectedContacts = [];
  sessionStorage.removeItem("selectedContacts");
  renderContacts();
  displaySelectedContacts();
}
