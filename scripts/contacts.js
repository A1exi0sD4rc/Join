let contacts = [];


async function init() {
    await getContacts();
    render();
}


async function getContacts() {
    let BASE_URL = `https://join-a2f86-default-rtdb.europe-west1.firebasedatabase.app/contacts`;
    let response = await fetch(BASE_URL + ".json");
    let responseAsJson = await response.json();

    try {
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`)
        }
        contacts = responseAsJson;

        console.log(contacts);
    } catch (error) {
        console.log(error);
    }
}


function render() {
    document.getElementById('contacts-site').innerHTML = '';
    document.getElementById('contacts-site').innerHTML += /*html*/`
        <div id="contacts-div" class="contacts-container"></div>  
    `;
    document.getElementById('contacts-site').innerHTML += /*html*/`
    <div id="contacts-details"></div>
    `;
    document.getElementById('contacts-div').innerHTML = '';
    document.getElementById('contacts-div').innerHTML += /*html*/`
        <button class="contacts-new-contact-btn">
            Add new contact <img src="./assets/img/contacts_new_contact.svg">
        </button>
        <div class="contacts-overview">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur possimus mollitia illo ad ex ipsum, tempora minima accusamus iure placeat dignissimos, aspernatur veniam explicabo enim corrupti, eum quaerat laboriosam obcaecati!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur possimus mollitia illo ad ex ipsum, tempora minima accusamus iure placeat dignissimos, aspernatur veniam explicabo enim corrupti, eum quaerat laboriosam obcaecati!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur possimus mollitia illo ad ex ipsum, tempora minima accusamus iure placeat dignissimos, aspernatur veniam explicabo enim corrupti, eum quaerat laboriosam obcaecati!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur possimus mollitia illo ad ex ipsum, tempora minima accusamus iure placeat dignissimos, aspernatur veniam explicabo enim corrupti, eum quaerat laboriosam obcaecati!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur possimus mollitia illo ad ex ipsum, tempora minima accusamus iure placeat dignissimos, aspernatur veniam explicabo enim corrupti, eum quaerat laboriosam obcaecati!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur possimus mollitia illo ad ex ipsum, tempora minima accusamus iure placeat dignissimos, aspernatur veniam explicabo enim corrupti, eum quaerat laboriosam obcaecati!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur possimus mollitia illo ad ex ipsum, tempora minima accusamus iure placeat dignissimos, aspernatur veniam explicabo enim corrupti, eum quaerat laboriosam obcaecati!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur possimus mollitia illo ad ex ipsum, tempora minima accusamus iure placeat dignissimos, aspernatur veniam explicabo enim corrupti, eum quaerat laboriosam obcaecati!</p>
        </div>
    `;
    document.getElementById('contacts-details').innerHTML = '';
    document.getElementById('contacts-details').innerHTML += /*html*/`
        <div class="contacts-headline">
            <h1>Contacts</h1>
            <div class="contacts-seperator"></div>
            <h2>Better with a team</h2>
        </div>
    `;
}


function renderContacts() {
    
}