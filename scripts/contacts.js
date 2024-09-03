let contacts = [];


async function init() {
    await getContacts();
    render();
    renderContacts();
}


async function getContacts() {
    let BASE_URL = `https://join-a2f86-default-rtdb.europe-west1.firebasedatabase.app/contacts`;
    let response = await fetch(BASE_URL + ".json");
    let responseAsJson = await response.json();

    try {
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
        }
        contacts = responseAsJson;
        contacts.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.log(error);
    }
}


function render() {
    document.getElementById("contacts-site").innerHTML = "";
    document.getElementById("contacts-site").innerHTML += /*html*/ `
        <div id="contacts-div" class="contacts-container"></div>
    `;
    document.getElementById("contacts-div").innerHTML = "";
    document.getElementById("contacts-div").innerHTML += /*html*/ `
        <div class="contacts-new-contact-div">
            <button class="contacts-new-contact-btn">
                Add new contact <img src="./assets/img/contacts_new_contact.svg">
            </button>
        </div>
        <div id="contacts-overview" class="contacts-overview"></div>
    `;
    document.getElementById("contacts-site").innerHTML += /*html*/ `
        <div class="contacts-headline">
            <h1>Contacts</h1>
            <div class="contacts-seperator-vertikal"></div>
            <h2>Better with a team</h2>
        </div>
    `;
}


function renderContacts() {
    let clusteredContacts = loadNameCluster();

    document.getElementById('contacts-overview').innerHTML = '';
    document.getElementById('contacts-overview').innerHTML += /*html*/`
        <div class="contacts-overview-space"></div>
    `;

    for (let letter in clusteredContacts) {
        document.getElementById('contacts-overview').innerHTML += /*html*/`
            <div class="contacts-overview-category">${letter}</div>
            <div class="contacts-seperatore-horizontal"></div>
        `;
        clusteredContacts[letter].forEach((contact, index) => {
            document.getElementById('contacts-overview').innerHTML += /*html*/`
                <div id="${index}" class="contacts-overview-contact" onclick="openDetails()">
                    <div class="contacts-initials">
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="21" cy="21" r="20" fill="#FF7A00" stroke="white" stroke-width="2"/>
                            <text x="21" y="24" text-anchor="middle" font-family="Arial" font-size="12" fill="white">${getInitials(contact.name)}</text>
                        </svg>
                    </div>
                    <div class="contacts-name-email">
                        <div class="contacts-center">
                            ${contact.name}<br>
                            <a href="mailto:${contact.email}">${contact.email}</a> 
                        </div>
                    </div>
                </div>
            `;
        });
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