let contactKeys = [];
let lastSelected;
let lastContactCreat;
let BASE_URL = `https://join-337-userlist-default-rtdb.firebaseio.com/contacts`;
let selectedContacts = [];

async function init() {
  await getContactData();
  render();
  renderContacts();
  renderContactCreated();
}

async function getContactData() {
  let allContacts = await getContacts();
  if (allContacts !== null) {
    let allKeys = Object.keys(allContacts);

    contactKeys = [];
    for (let index = 0; index < allKeys.length; index++) {
      contactKeys.push({
        id: allKeys[index],
        name: allContacts[allKeys[index]]["name"],
        email: allContacts[allKeys[index]]["email"],
        number: allContacts[allKeys[index]]["number"],
        bgcolor: allContacts[allKeys[index]]["bgcolor"],
      });
    }
    contactKeys.sort((a, b) => a.name.localeCompare(b.name));
    console.log(contactKeys);
  }
}

async function getContacts() {
  try {
    let response = await fetch(BASE_URL + ".json");
    return (responseAsJson = await response.json());
  } catch (error) {
    console.log(error);
  }
}

function loadNameCluster() {
  let nameClusters = {};

  contactKeys.forEach((contact) => {
    let firstLetter = contact.name.charAt(0).toUpperCase();
    if (!nameClusters[firstLetter]) {
      nameClusters[firstLetter] = [];
    }
    nameClusters[firstLetter].push(contact);
  });
  for (let key in nameClusters) {
    nameClusters[key].sort((a, b) => a.name.localeCompare(b.name));
  }
  return nameClusters;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}

function toggleDetailClasses(i) {
  if (window.innerWidth < 1000) {
    document.getElementById("contacts-div").classList.toggle("d-none");
    document
      .getElementById("contacts-h-d-div")
      .classList.toggle("contacts-h-d-mobil");
  } else {
    if (lastSelected === undefined) {
      document
        .getElementById(`${i}`)
        .classList.toggle("contacts-overview-contact-selected");
      document
        .getElementById(`${i}`)
        .classList.toggle("contacts-overview-contact-unselected");
      lastSelected = i;
    } else {
      document
        .getElementById(`${lastSelected}`)
        .classList.toggle("contacts-overview-contact-selected");
      document
        .getElementById(`${lastSelected}`)
        .classList.toggle("contacts-overview-contact-unselected");
      document
        .getElementById(`${i}`)
        .classList.toggle("contacts-overview-contact-selected");
      document
        .getElementById(`${i}`)
        .classList.toggle("contacts-overview-contact-unselected");
      lastSelected = i;
    }
  }
}

function contactAddEditInit(i, action) {
  toggleVisiblility();
  if (action == "edit") {
    renderEditContact(i);
  } else {
    renderAddNewContact();
  }
}

function toggleVisiblility(event) {
  if (event) {
    event.stopPropagation();
  } else {
    document
      .getElementById("contacts-add-edit-bg")
      .classList.toggle("contacts-add-edit-bg-show");
    document
      .getElementById("contacts-add-edit")
      .classList.toggle("contacts-translateX");
  }
}

async function addContact(event) {
  event.preventDefault();
  await addContactToDb();
  await init();
  renderContactDetails(
    contactKeys.findIndex((contact) => contact.name === lastContactCreat)
  );
  focusAddedContact();
  contactCreatSuccesfull();
  setTimeout(contactCreatSuccesfull, 2000);
}

async function addContactToDb() {
  let response = await fetch(BASE_URL + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(getNewContactData()),
  });
  lastSelected = undefined;
  lastContactCreat = document.getElementById("contacts-user-name").value;
  return (responseToJson = await response.json());
}

function getNewContactData() {
  let data = {
    name: document.getElementById("contacts-user-name").value,
    email: document.getElementById("contacts-user-email").value,
    number: document.getElementById("contacts-user-number").value,
    bgcolor: generateColor(),
  };

  return data;
}

function generateColor() {
  const colors = [
    "lightcoral",
    "green",
    "blueviolet",
    "lightblue",
    "darkmagenta",
    "orangered",
    "purple",
    "lightgreen",
    "indigo",
    "teal",
    "peru",
    "midnightblue",
    "aquamarine",
    "chartreuse"
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);

  return colors[randomIndex];
}

function contactCreatSuccesfull() {
  document
    .getElementById("contact-created")
    .classList.toggle("creation-succesfull");
}

function focusAddedContact() {  
  let newContact = document.getElementById(`${contactKeys.findIndex((contact) => contact.name === lastContactCreat)}`);
  newContact.scrollTop = newContact.scrollHeight;
}

async function editSaveInit(i) {
  await saveEdit(i);
  await init();
}

async function saveEdit(i) {
  let changeUserName = document.getElementById("contacts-user-name").value;
  let changeUserEmail = document.getElementById("contacts-user-email").value;
  let changeUserNumber = document.getElementById("contacts-user-number").value;
  const response = await fetch(
    BASE_URL + `/${contactKeys[i]["id"]}` + ".json",
    {
      method: "PUT",
      header: { "Content-Type": "application/json" },
      body: JSON.stringify(
        (data = {
          name: `${changeUserName}`,
          email: `${changeUserEmail}`,
          number: `${changeUserNumber}`,
          bgcolor: contactKeys[i]["bgcolor"],
        })
      ),
    }
  );
  lastSelected = undefined;
  return (responseToJson = await response.json());
}

async function contactDeleteInit(i) {
  let contactId = contactKeys[i].id;
  let selectedContactElement = document.getElementById(
    `selected-contact-${contactId}`
  );
  if (selectedContactElement) {
    selectedContactElement.remove();
    selectedContacts = selectedContacts.filter(
      (contact) => contact.id !== contactId
    );
    saveSelectedContactsToSession();
  }
  await deleteContact(i);
  await getContactData();
  await init();
}

async function deleteContact(i) {
  let response = await fetch(BASE_URL + `/${contactKeys[i]["id"]}` + ".json", {
    method: "DELETE",
  });

  lastSelected = undefined;
  return (responseToJson = await response.json());
}

function contactShowEditOption(event) {
  if (event) {
    event.stopPropagation();
    document.getElementById('contact-details-option').classList.add('contacts-d-more-options-show');
  } else {
    document.getElementById('contact-details-option').classList.remove('contacts-d-more-options-show');
  }
}
