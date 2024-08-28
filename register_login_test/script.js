let users = [
    {'email': 'max.mueller@web.de', 'password': 'index1234'},
];


function addUser() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    users.push({email: email.value, password: password.value},);
    window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert';
}


function loginUser() {
    let emailLogin = document.getElementById('email-login');
    let passwordLogin = document.getElementById('password-login');
    let user = users.find(u => u.email == emailLogin.value && u.password == passwordLogin.value)

    if(user) {
        console.log('User gefunden');
    }
}