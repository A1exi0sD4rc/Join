document.addEventListener('DOMContentLoaded', (event) => {
    const inputDiv = document.querySelector('.input_div');
    const inputField = document.querySelector('.search_task_input');


    inputField.addEventListener('focus', () => {
        inputDiv.classList.remove('default-border');
        inputDiv.classList.add('focused-border');
    });

    inputField.addEventListener('blur', () => {
        inputDiv.classList.remove('focused-border');
        inputDiv.classList.add('default-border');
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const inputDiv = document.querySelector('.input_div_responsive');
    const inputField = document.querySelector('.search_task_input_responsive');


    inputField.addEventListener('focus', () => {
        inputDiv.classList.remove('default-border');
        inputDiv.classList.add('focused-border');
    });

    inputField.addEventListener('blur', () => {
        inputDiv.classList.remove('focused-border');
        inputDiv.classList.add('default-border');
    });
});