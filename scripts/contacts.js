let contactKeys = [];
let lastSelected;
let BASE_URL = `https://join-a2f86-default-rtdb.europe-west1.firebasedatabase.app/contacts`;


async function init() {
    await getContactData();
    render();
    renderContacts();
}


async function getContactData() {
    let allContacts = await getContacts();
    let allKeys = Object.keys(allContacts);

    for (let index = 0; index < allKeys.length; index++) {
        contactKeys.push({
            id: allKeys[index],
            name: allContacts[allKeys[index]]['name'],
            email: allContacts[allKeys[index]]['email'],
            number: allContacts[allKeys[index]]['number'],
            bgcolor: allContacts[allKeys[index]]['bgcolor']
        })
    }
    contactKeys.sort((a, b) => a.name.localeCompare(b.name));  
    console.log(contactKeys);
}


async function getContacts() {
    let response = await fetch(BASE_URL + ".json");
    return responseAsJson = await response.json();
}


function loadNameCluster() {
    let nameClusters = {};

    contactKeys.forEach(contact => {
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


function contactAddEditInit(i, action) {
    toggleVisiblility();
    if (action == 'edit') {
        renderEditContact(i);
    } else {
        renderAddNewContact();
    }
}


function toggleVisiblility() {
    document.getElementById('contacts-add-edit-bg').classList.toggle('d-none');
    document.getElementById('contacts-add-edit').classList.toggle('contacts-translateX');
}


function addContact(event) {
    event.preventDefault();
    addContactToDb();
    init();
}


async function addContactToDb() {
    let response = await fetch(BASE_URL + ".json", {
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
    const min = 50;
    const max = 200;

    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    const g = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * (max - min + 1)) + min;

    return `rgb(${r}, ${g}, ${b})`;
}


function editSaveInit(i) {
    saveEdit(i);
    init();
}


async function saveEdit(i) {
    let changeUserName = document.getElementById('contacts-user-name').value;
    let changeUserEmail = document.getElementById('contacts-user-email').value;
    let changeUserNumber = document.getElementById('contacts-user-number').value;
    const response = await fetch(BASE_URL + `/${contactKeys[i]['id']}` + ".json", {
        method: "PUT",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify(data = {
            "name": `${changeUserName}`,
            "email": `${changeUserEmail}`,
            "number": `${changeUserNumber}`,
            "bgcolor": contactKeys[i]['bgcolor']
        })
    });
    return responseToJson = await response.json();
}


async function contactDeleteInit(i) {
    await deleteContact(i);
    await getContactData();
    renderContacts();
}


async function deleteContact(i) {
    let response = await fetch(BASE_URL + `/${contactKeys[i]['id']}` + ".json", {
        method: "DELETE",
    });
    return responseToJson = await response.json();
}