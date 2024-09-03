let tasks = [
    {
        art: 'User Story',
        title: 'font.css',
        description: 'font.css verursacht Fehler.',
        assigned: '',
        prio: 'low',
        category: 'todo',
        subtasks: '',
        id: 0
    },

    {
        art: 'User Story',
        title: 'Join aktuell',
        description: 'Zwichenstand von Mentoren.',
        assigned: '',
        prio: 'low',
        category: 'await',
        subtasks: '',
        id: 1
    },

    {
        art: 'User Story',
        title: 'Join Contacts',
        description: 'Contacts Seite erstellen.',
        assigned: '',
        prio: 'med',
        category: 'progress',
        subtasks: '',
        id: 2
    },

    {
        art: 'Technical Task',
        title: 'Bestellapp',
        description: 'Clone einer bekannten Bestllapp.',
        assigned: '',
        prio: 'high',
        category: 'done',
        subtasks: '',
        id: 3
    },

    {
        art: 'Technical Task',
        title: 'Join Board',
        description: 'Task Board erstellen.',
        assigned: '',
        prio: 'high',
        category: 'progress',
        subtasks: '',
        id: 4
    },
];


const artColors = {
    'Technical Task': '#1FD7C1',
    'User Story': '#0038FF',
};

const prios = {
    'low': 'assets/img/Prio_low.svg',
    'med': 'assets/img/Prio_med.svg',
    'high': 'assets/img/Prio_high.svg',
}


let draggedTo;


function initBoardJs() {
    updateHtmlTodo();
    updateHtmlProgress();
    updateHtmlAwait();
    updateHtmlDone();
    changeArtBackground();
    addPrioImg();
}


function updateHtmlTodo() {
    let todo = tasks.filter(x => x['category'] == 'todo');
    document.getElementById('small_card_todo').innerHTML = '';
    for (let index = 0; index < todo.length; index++) {
        const elementToDo = todo[index];
        document.getElementById('small_card_todo').innerHTML += renderTaskCardToDo(elementToDo);
        changeArtBackground(`art_small_${elementToDo.id}`);
        addPrioImg(elementToDo);
    }
}


function updateHtmlProgress() {
    let progress = tasks.filter(x => x['category'] == 'progress');
    document.getElementById('small_card_progress').innerHTML = '';
    for (let index = 0; index < progress.length; index++) {
        const elementProgress = progress[index];
        document.getElementById('small_card_progress').innerHTML += renderTaskCardToDo(elementProgress);
        changeArtBackground(`art_small_${elementProgress.id}`);
        addPrioImg(elementProgress);
    }
}


function updateHtmlAwait() {
    let await = tasks.filter(x => x['category'] == 'await');
    document.getElementById('small_card_await').innerHTML = '';
    for (let index = 0; index < await.length; index++) {
        const elementAwait = await[index];
        document.getElementById('small_card_await').innerHTML += renderTaskCardAwait(elementAwait);
        changeArtBackground(`art_small_${elementAwait.id}`);
        addPrioImg(elementAwait);
    }
}


function updateHtmlDone() {
    let done = tasks.filter(x => x['category'] == 'done');
    document.getElementById('small_card_done').innerHTML = '';
    for (let index = 0; index < done.length; index++) {
        const elementDone = done[index];
        document.getElementById('small_card_done').innerHTML += renderTaskCardAwait(elementDone);
        changeArtBackground(`art_small_${elementDone.id}`);
        addPrioImg(elementDone);
    }
}


function changeArtBackground(id) {
    const toChangeBg = document.getElementById(id);

    if (toChangeBg) {
        toChangeBg.style.backgroundColor = artColors[toChangeBg.textContent.trim()];
    }
}


function addPrioImg(task) {
    const prioimg = prios[tasks.prio];
    const prioDiv = document.getElementById(`prio_small_${tasks.id}`);
    
    if (prioimg) {
        prioDiv.innerHTML = `<img src="${prioimg}">`;
    }
}


function startDrag(id) {
    draggedTo = id;
}


function allowDrop(ev) {
    ev.preventDefault();
}


function moveTo(category) {
    tasks[draggedTo]['category'] = category;
    updateHtmlTodo();
    updateHtmlProgress();
    updateHtmlAwait();
    updateHtmlDone();
}