function render() {
    document.getElementById("contacts-site").innerHTML = "";
    document.getElementById("contacts-site").innerHTML = /*html*/`
        <div id="contacts-add-edit-bg" class="contacts-add-edit-bg d-none" onclick="toggleVisiblility()"></div>
        <div id="contacts-add-edit" class="contacts-add-edit-div"></div> 
    `;
    document.getElementById("contacts-site").innerHTML += /*html*/ `
        <div id="contacts-div" class="contacts-container"></div>
    `;
    document.getElementById("contacts-site").innerHTML += /*html*/ `
        <div class="contacts-headline">
            <h1>Contacts</h1>
            <div class="contacts-seperator-vertikal"></div>
            <h2>Better with a team</h2>
        </div>
        <div id="contact-details" class="contacts-contact-details"></div>  
    `;
    document.getElementById("contacts-div").innerHTML = "";
    document.getElementById("contacts-div").innerHTML += /*html*/ `
        <div class="contacts-new-contact-div">
            <button class="contacts-new-contact-btn" onclick="contactAddEditInit('add')">
                Add new contact <img src="./assets/img/contacts_new_contact.svg">
            </button>
        </div>
        <div id="contacts-overview" class="contacts-overview">
            
        </div>
    `;
}


function renderContacts() {
    let clusteredContacts = loadNameCluster();

    document.getElementById('contacts-overview').innerHTML = '';
    document.getElementById('contacts-overview').innerHTML += /*html*/ `
        <div class="contacts-overview-space"></div>
    `;

    for (let letter in clusteredContacts) {
        document.getElementById('contacts-overview').innerHTML += /*html*/ `
            <div class="contacts-overview-category">${letter}</div>
            <div class="contacts-seperatore-horizontal"></div>
        `;

        clusteredContacts[letter].forEach(contact => {    
            let originalIndex = contactKeys.indexOf(contact);

            document.getElementById('contacts-overview').innerHTML += /*html*/ `
                <div id="${originalIndex}" class="contacts-overview-contact contacts-overview-contact-unselected" onclick="renderContactDetails(${originalIndex})">
                    <div class="contacts-initials">
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="21" cy="21" r="20" fill="${contact.bgcolor}" stroke="white" stroke-width="2"/>
                            <text x="21" y="24" text-anchor="middle" font-size="12" fill="white">${getInitials(contact.name)}</text>
                        </svg>
                    </div>
                    <div class="contacts-name-email">
                        <div class="contacts-center">
                            ${contact.name}<br>
                            <a href="#">${contact.email}</a> 
                        </div>
                    </div>
                </div>
            `;
        });
    }
}


function renderContactDetails(i) {
    toggleDetailClasses(i);

    document.getElementById('contact-details').innerHTML = '';
    document.getElementById('contact-details').innerHTML += /*html*/ `
        <div class="contacts-contact-logo-name">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="60" fill="#FF7A00"/>
                <text x="60" y="73" text-anchor="middle" font-size="47" fill="white">${getInitials(contactKeys[i]['name'])}</text>
            </svg>
            <div class="contacts-contact-details-h-edit-delete">
                <h2>${contactKeys[i]['name']}</h2>
                <div class="contacts-contact-details-btn-div">
                    <button class="contacts-contact-details-edit-btn" onclick="contactAddEditInit(${i}, 'edit')">Edit</button>
                    <button class="contacts-contact-details-delete-btn" onclick="contactDeleteInit(${i})">Delete</button>
                </div>
            </div>
        </div>  
        <div class="contacts-details-info-hl">
            Contact Information
        </div>
        <div class="contacts-details-info">
            <b>Email</b>
            <a href="mailto:${contactKeys[i]['email']}">${contactKeys[i]['email']}</a>
            <b>Phone</b>
            ${contactKeys[i]['number']}
        </div>
    `;
}


function renderContactCreated() {
    document.getElementById('contacts-site').innerHTML += /*html*/`
        <div id="contact-created" class="contact-created">
            Contact succesfully created
        </div>  
    `;
}


function renderEditContact(i) {
    document.getElementById('contacts-add-edit').innerHTML = '';
    document.getElementById('contacts-add-edit').innerHTML += /*html*/`
        <div class="contacts-edit-title">
            <img src="./assets/img/logo_white.svg">
            <div class="contacts-edit-title-h1">
                <h1>Edit contact</h1>
                <svg width="94" height="3" viewBox="0 0 94 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/>
                </svg>
            </div>
        </div>   
    `;
    document.getElementById('contacts-add-edit').innerHTML += /*html*/`
        <div class="contacts-edit-section">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="60" fill="#FF7A00"/>
                <text x="60" y="73" text-anchor="middle" font-size="47" fill="white">${getInitials(contactKeys[i]['name'])}</text>
            </svg>
            <div class="contacts-edit-input-btn">
                <button class="contacts-add-edit-close-btn" onclick="toggleVisiblility()"></button>
                <div class="contacts-edit-input">
                    <input id="contacts-user-name" class="contacts-edit-name" type="text" value="${contactKeys[i]['name']}">
                    <input id="contacts-user-email" class="contacts-edit-email" type="text" value="${contactKeys[i]['email']}">
                    <input id="contacts-user-number" class="contacts-edit-number" type="text" value="${contactKeys[i]['number']}">
                </div>
                <div>
                    <button class="contacts-edit-delete-btn"  onclick="contactDeleteInit(${i})">Delete</button>
                    <button class="contacts-edit-save-btn contacts-img-margin" onclick="editSaveInit(${i})">Save <img src="./assets/img/check.svg"></button>
                </div>
            </div>
        </div>
    `;
}


function renderAddNewContact() {
    document.getElementById('contacts-add-edit').innerHTML = '';
    document.getElementById('contacts-add-edit').innerHTML += /*html*/`
        <div class="contacts-add-title">
            <img src="./assets/img/logo_white.svg">
            <div class="contacts-edit-title-h1">
                <div>
                    <h1>Add contact</h1>
                    <h3></h3>
                </div>
                <svg width="94" height="3" viewBox="0 0 94 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/>
                </svg>
            </div>
        </div>   
    `;
    document.getElementById('contacts-add-edit').innerHTML += /*html*/`
        <div class="contacts-add-section">
            <img class="contacts-add-section-img" src="./assets/img/no_user.svg">
            <form class="contacts-edit-input-btn">
                <button class="contacts-add-edit-close-btn" onclick="toggleVisiblility()"></button>
                <div class="contacts-edit-input">
                    <input required id="contacts-user-name" class="contacts-edit-name" type="text" placeholder="Name">
                    <input required id="contacts-user-email" class="contacts-edit-email" type="email" placeholder="Email">
                    <input required id="contacts-user-number" class="contacts-edit-number" type="tel" placeholder="Phone">
                </div>
                <div>
                    <button class="contacts-add-cancel-btn contacts-img-margin" onclick="toggleVisiblility()">Cancel <img src="./assets/img/close.svg"></button>
                    <button class="contacts-add-create-btn contacts-img-margin" onclick="addContact(event)">Create contact <img src="./assets/img/check.svg"  href="${focusAddedContact()}}"></button>
                </div>
            </form>
        </div>
    `;
}