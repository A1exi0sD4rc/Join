let contacts = [];
let lastSelected;
let BASE_URL = `https://join-a2f86-default-rtdb.europe-west1.firebasedatabase.app/contacts`;


async function init() {
    await getContacts();
    render();
    renderContacts();
}


async function getContacts() {
    let response = await fetch(BASE_URL + ".json");
    let responseAsJson = await response.json();

    try {
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
        }
        contacts = responseAsJson;
        console.log(contacts);
        contacts.sort((a, b) => a.name.localeCompare(b.name));  
    } catch (error) {
        console.log(error);
    }
}


function loadNameCluster() {
    let nameClusters = {};

    contacts.forEach(contact => {
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
    return name.split(' ')
        .map(word => word.charAt(0))
        .join('');
}


function toggleDetailClasses(i) {
    if (lastSelected === undefined) {
        document.getElementById(`${i}`).classList.toggle('contacts-overview-contact-selected');
        document.getElementById(`${i}`).classList.toggle('contacts-overview-contact-unselected');
        lastSelected = i;
    } else {
        document.getElementById(`${lastSelected}`).classList.toggle('contacts-overview-contact-selected');
        document.getElementById(`${lastSelected}`).classList.toggle('contacts-overview-contact-unselected');
        document.getElementById(`${i}`).classList.toggle('contacts-overview-contact-selected');
        document.getElementById(`${i}`).classList.toggle('contacts-overview-contact-unselected');
        lastSelected = i;
    }
}


function editContact(i, action) {
    toggleVisiblility();
    if (action == 'edit') {
        renderEditContact(i);
    } else {
        addNewContact()
    }
}


function toggleVisiblility() {
    document.getElementById('contacts-add-edit-bg').classList.toggle('d-none');
    document.getElementById('contacts-add-edit').classList.toggle('contacts-translateX');
}


function addContact(event, path) {
    event.preventDefault();
    addContactToDb(path);
}


async function addContactToDb(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST", 
        header: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(getNewContactData())
    });
    return responseToJson = await response.json();
}


function getNewContactData() {
    let data = {
        'name': document.getElementById('contacts-user-name').value,
        'email': document.getElementById('contacts-user-email').value,
        'number': document.getElementById('contacts-user-number').value,
        'bgcolor': generateColor()
    };

    return data;
}


function generateColor() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    
    return randomColor;
}


async function saveEdit(i, path) {
    let changeUserName = document.getElementById('contacts-user-name').value;
    let changeUserEmail = document.getElementById('contacts-user-email').value;
    let changeUserNumber = document.getElementById('contacts-user-number').value;
    const response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify(data = {
            "name": `${changeUserName}`,
            "email": `${changeUserEmail}`,
            "number": `${changeUserNumber}`,
            "bgcolor": contacts[i]['bgcolor']
        })
    });
    return responseToJson = await response.json();
}


function initDelete(path) {
    deleteContact(path)
    renderContacts();
}


async function deleteContact(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return responseToJson = await response.json();
}