let contactKeys = [];
let lastSelected;
let lastContactCreat;
let BASE_URL = `https://join-337-userlist-default-rtdb.firebaseio.com/contacts`;
let selectedContacts = [];

/**
 * Initializes the application by performing the necessary setup operations.
 *
 * @async
 * @function init
 * @returns {Promise<void>} A promise that resolves once all initialization tasks are complete.
 */
async function init() {
  await getContactData();
  render();
  renderContacts();
  renderContactCreated();
}

/**
 * Asynchronously fetches and processes contact data into a sorted list.
 *
 * @async
 * @function getContactData
 * @returns {Promise<void>} A promise that resolves once contact data is processed.
 */
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

/**
 * Asynchronously fetches contacts data from a remote server.
 *
 * @async
 * @function getContacts
 * @returns {Promise<Object|null>} A promise that resolves to the contact data as an object, or `null` if an error occurs.
 */
async function getContacts() {
  try {
    let response = await fetch(BASE_URL + ".json");
    return (responseAsJson = await response.json());
  } catch (error) {
    console.log(error);
  }
}

/**
 * Organizes contacts into clusters based on the first letter of their names.
 *
 * @function loadNameCluster
 * @returns {Object} An object where the keys are uppercase letters and the values are arrays of contacts sorted by name.
 */
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

/**
 * Returns the initials of a given name.
 *
 * @function getInitials
 * @param {string} name - The full name to extract initials from.
 * @returns {string} The initials of the given name.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}

/**
 * Toggles CSS classes for contact detail view based on the screen width.
 *
 * @function toggleDetailClasses
 * @param {number|string} i - The ID of the selected contact element.
 */
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

/**
 * Initializes the process of adding or editing a contact.
 *
 * @function contactAddEditInit
 * @param {number|string} i - The ID of the contact to edit (if applicable).
 * @param {string} action - The action to perform, either "edit" for editing a contact or any other value for adding a new contact.
 */
function contactAddEditInit(i, action) {
  toggleVisiblility();
  if (action == "edit") {
    renderEditContact(i);
  } else {
    renderAddNewContact();
  }
}

/**
 * Toggles the visibility of the contact add/edit interface.
 *
 * @function toggleVisiblility
 * @param {Event} [event] - An optional event object to prevent event propagation.
 */
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

/**
 * Handles the addition of a new contact.
 *
 * @async
 * @function addContact
 * @param {Event} event - The event object representing the form submission event.
 * @returns {Promise<void>} A promise that resolves once the contact is added and the UI is updated.
 */
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

/**
 * Adds a new contact to the database via a POST request.
 *
 * @async
 * @function addContactToDb
 * @returns {Promise<Object>} A promise that resolves to the response data as a JSON object.
 */
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

/**
 * Retrieves the data for a new contact from the input fields.
 *
 * @function getNewContactData
 * @returns {Object} An object containing the new contact's data, including
 *                   `name`, `email`, `number`, and `bgcolor`.
 */
function getNewContactData() {
  let data = {
    name: document.getElementById("contacts-user-name").value,
    email: document.getElementById("contacts-user-email").value,
    number: document.getElementById("contacts-user-number").value,
    bgcolor: generateColor(),
  };

  return data;
}

/**
 * Generates a random color from a predefined list of colors.
 *
 * @function generateColor
 * @returns {string} A randomly selected color from the predefined list.
 */
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
    "chartreuse",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);

  return colors[randomIndex];
}

/**
 * Toggles the success indicator for contact creation.
 *
 * @function contactCreatSuccesfull
 * @returns {void} This function does not return a value.
 */
function contactCreatSuccesfull() {
  document
    .getElementById("contact-created")
    .classList.toggle("creation-succesfull");
}

/**
 * Focuses on the newly added contact in the contact list.
 *
 * @function focusAddedContact
 * @returns {void} This function does not return a value.
 */
function focusAddedContact() {
  let newContact = document.getElementById(
    `${contactKeys.findIndex((contact) => contact.name === lastContactCreat)}`
  );
  newContact.scrollTop = newContact.scrollHeight;
}

/**
 * Initializes the process of saving edited contact data.
 *
 * @async
 * @function editSaveInit
 * @param {number|string} i - The index or ID of the contact to be edited.
 * @returns {Promise<void>} A promise that resolves once the edit is saved and the data is reinitialized.
 */
async function editSaveInit(i) {
  await saveEdit(i);
  await init();
}

/**
 * Saves the edited contact information to the database.
 *
 * @async
 * @function saveEdit
 * @param {number|string} i - The index or ID of the contact being edited.
 * @returns {Promise<Object>} A promise that resolves to the response data as a JSON object.
 */
async function saveEdit(i) {
  let changeUserName = document.getElementById("contacts-user-name").value;
  let changeUserEmail = document.getElementById("contacts-user-email").value;
  let changeUserNumber = document.getElementById("contacts-user-number").value;
  const response = await fetch(
    BASE_URL + `/${contactKeys[i]["id"]}` + ".json",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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

/**
 * Initializes the process of deleting a contact.
 *
 * @async
 * @function contactDeleteInit
 * @param {number|string} i - The index or ID of the contact to be deleted.
 * @returns {Promise<void>} A promise that resolves once the contact is deleted
 *                          and the data is reinitialized.
 */
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
  await init();
}

/**
 * Deletes a contact from the database.
 *
 * @async
 * @function deleteContact
 * @param {number|string} i - The index or ID of the contact to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the response data
 *                            as a JSON object.
 */
async function deleteContact(i) {
  let response = await fetch(BASE_URL + `/${contactKeys[i]["id"]}` + ".json", {
    method: "DELETE",
  });

  lastSelected = undefined;
  return (responseToJson = await response.json());
}

/**
 * Toggles the visibility of the edit options for a contact.
 *
 * @function contactShowEditOption
 * @param {Event} [event] - An optional event object that, if provided,
 *                          will stop the event from propagating.
 * @returns {void} This function does not return a value.
 */
function contactShowEditOption(event) {
  if (event) {
    event.stopPropagation();
    document
      .getElementById("contact-details-option")
      .classList.add("contacts-d-more-options-show");
  } else {
    document
      .getElementById("contact-details-option")
      .classList.remove("contacts-d-more-options-show");
  }
}
