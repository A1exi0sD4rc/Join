let tasks = [
    {
        art: 'User Story',
        title: 'Join aktuell',
        description: 'Zwichenstand von Mentoren',
        assigned: '',
        prio: '',
        category: 'await',
        subtasks: '',
        id: 0
    },

    {
        art: 'User Story',
        title: 'Join Contacts',
        description: 'Contacts Seite erstellen',
        assigned: '',
        prio: '',
        category: 'progress',
        subtasks: '',
        id: 1
    },

    {
        art: 'User Story',
        title: 'Bestellapp',
        description: 'Clone einer bekannten Bestllapp.',
        assigned: '',
        prio: '',
        category: 'done',
        subtasks: '',
        id: 2
    },

    {
        art: 'User Story',
        title: 'Join Board',
        description: 'Task Board erstellen',
        assigned: '',
        prio: '',
        category: 'progress',
        subtasks: '',
        id: 3
    },
];

let draggedTo;


function updateHTML() {
    let progress = tasks.filter(x => x['category'] == 'progress');
    document.getElementById('small_card_progress').innerHTML = '';
    for (let index = 0; index < progress.length; index++) {
        const element = progress[index];
        document.getElementById('small_card_progress').innerHTML += renderTaskCardToDo(element);
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
    updateHTML();
}