let CONTACTS_URL =
  "https://join-a2f86-default-rtdb.europe-west1.firebasedatabase.app/contacts";
contactsAddTask = [];

async function getContacts() {
  let response = await fetch(CONTACTS_URL + ".json");
  let responseAsJson = await response.json();

  try {
    contactsAddTask = responseAsJson;
    console.log(contactsAddTask);
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
    contactContainer.innerHTML += /*html*/ `
      <div><svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="21" cy="21" r="20" fill="${
                              contactsAddTask[i]["bgcolor"]
                            }" stroke="white" stroke-width="2"/>
                            <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${getInitials(
                              contactsAddTask[i]["name"]
                            )}</text>
                        </svg> <div>${
                          contactsAddTask[i]["name"]
                        }</div><input type="checkbox">
      </div>
    `;
  }
}
