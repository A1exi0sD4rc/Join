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
 * Capitalizes the first letter of each word in a given name string.
 * The function converts all other letters to lowercase.
 *
 * @param {string} name - The name string to capitalize.
 * @returns {string} The capitalized name.
 */
function capitalizeName(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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
  if (event) event.preventDefault();
  await addContactToDb();
  await init();
  renderContactDetails(
    contactKeys.findIndex((contact) => contact.name === lastContactCreat)
  );
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
  lastContactCreat = document.getElementById("contacts-user-name").value;
  lastContactCreat = capitalizeName(lastContactCreat);

  let response = await fetch(BASE_URL + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(getNewContactData()),
  });

  lastSelected = undefined;
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
    name: capitalizeName(document.getElementById("contacts-user-name").value),
    email: document.getElementById("contacts-user-email").value,
    number: document.getElementById("contacts-user-number").value,
    bgcolor: generateColor(),
  };
  return data;
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
  renderContactDetails(i);
  contactEditSuccesfull();
  setTimeout(contactEditSuccesfull, 2000);
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
  let changeUserName = capitalizeName(
    document.getElementById("contacts-user-name").value
  );
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