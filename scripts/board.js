let tasks = [
    {
        art: "User Story",
        title: "font.css",
        description: "font.css verursacht Fehler.",
        assigned: "",
        prio: "Low",
        category: "todo",
        subtasks: "",
        id: 0,
    },

    {
        art: "User Story",
        title: "Join aktuell",
        description: "Zwichenstand von Mentoren.",
        assigned: "",
        prio: "Low",
        category: "await",
        subtasks: "",
        id: 1,
    },

    {
        art: "User Story",
        title: "Join Contacts",
        description: "Contacts Seite erstellen.",
        assigned: "",
        prio: "Medium",
        category: "progress",
        subtasks: "",
        id: 2,
    },

    {
        art: "Technical Task",
        title: "Bestellapp",
        description: "Clone einer bekannten Bestllapp.",
        assigned: "",
        prio: "Urgent",
        category: "done",
        subtasks: "",
        id: 3,
    },

    {
        art: "Technical Task",
        title: "Join Board",
        description: "Task Board erstellen.",
        assigned: "",
        prio: "Urgent",
        category: "progress",
        subtasks: "",
        id: 4,
    },
];


const artColors = {
    "Technical Task": "#1FD7C1",
    "User Story": "#0038FF",
};


const prios = {
    Low: "assets/img/Prio_low.svg",
    Medium: "assets/img/Prio_med.svg",
    Urgent: "assets/img/Prio_high.svg",
};


let draggedTo;


function initBoardJs() {
    includeHTML();
    awaitGenerateInitials();
    updateHtmlTodo();
    updateHtmlProgress();
    updateHtmlAwait();
    updateHtmlDone();
    changeArtBackground();
}


/**
 * filters tasks marked as "todo" and dynamically updates the section with task cards including their background-color and priority img.
 */
function updateHtmlTodo() {
    let todo = tasks.filter((x) => x["category"] == "todo");
    document.getElementById("small_card_todo").innerHTML = "";
    if (todo.length < 1) {
        document.getElementById('small_card_todo').innerHTML = renderNoTasksToDo();
    } else {
        for (let index = 0; index < todo.length; index++) {
            const elementToDo = todo[index];
            document.getElementById("small_card_todo").innerHTML += renderTaskCardToDo(elementToDo);
            changeArtBackground(`art_small_${elementToDo.id}`);
            addPrioImg(elementToDo);
        }
    }
}


/**
 * filters tasks marked as "progress" and dynamically updates the section with task cards including their background-color and priority img.
 */
function updateHtmlProgress() {
    let progress = tasks.filter((x) => x["category"] == "progress");
    document.getElementById("small_card_progress").innerHTML = "";
    if (progress.length < 1) {
        document.getElementById('small_card_progress').innerHTML = renderNoTasksProgress();
    } else {
        for (let index = 0; index < progress.length; index++) {
            const elementProgress = progress[index];
            document.getElementById("small_card_progress").innerHTML += renderTaskCardToDo(elementProgress);
            changeArtBackground(`art_small_${elementProgress.id}`);
            addPrioImg(elementProgress);
        }
    }
}


/**
 * filters tasks marked as "await" and dynamically updates the section with task cards including their background-color and priority img.
 */
function updateHtmlAwait() {
    let await = tasks.filter((x) => x["category"] == "await");
    document.getElementById("small_card_await").innerHTML = "";
    if (await.length < 1) {
        document.getElementById('small_card_await').innerHTML = renderNoTasksAwait();
    } else {
        for (let index = 0; index < await.length; index++) {
            const elementAwait = await[index];
            document.getElementById("small_card_await").innerHTML += renderTaskCardAwait(elementAwait);
            changeArtBackground(`art_small_${elementAwait.id}`);
            addPrioImg(elementAwait);
        }
    }
}


/**
 * filters tasks marked as "done" and dynamically updates the section with task cards including their background-color and priority img.
 */
function updateHtmlDone() {
    let done = tasks.filter((x) => x["category"] == "done");
    document.getElementById("small_card_done").innerHTML = "";
    if (done.length < 1) {
        document.getElementById('small_card_done').innerHTML = renderNoTaskDone();
    } else {
        for (let index = 0; index < done.length; index++) {
            const elementDone = done[index];
            document.getElementById("small_card_done").innerHTML += renderTaskCardAwait(elementDone);
            changeArtBackground(`art_small_${elementDone.id}`);
            addPrioImg(elementDone);
        }
    }
}


/**
 * changes the background-color of a div depending on his catergory/textContent
 *
 * @param {number} id - The id provides a unique identifier for the object.
 */
function changeArtBackground(id) {
    const toChangeBg = document.getElementById(id);
    if (toChangeBg) {
        toChangeBg.style.backgroundColor = artColors[toChangeBg.textContent.trim()];
    }
}


/**
 * adds a specific priority Icon/img to the task card.
 *
 * @param {object} tasks -
 */
function addPrioImg(tasks) {
    const prioimg = prios[tasks.prio];
    const prio_small = document.getElementById(`prio_small_${tasks.id}`);
    if (prioimg) {
        prio_small.innerHTML = `<img src="${prioimg}">`;
    }
}

/**
 * adds a specific priority Icon/img to the big task card.
 *
 * @param {object} tasks -
 */
function addPrioBigImg(bigelement) {
    const prioBigImg = prios[bigelement.prio];
    const big_prio_img = document.getElementById(`big_prio_img_${bigelement.id}`);
    if (prioBigImg) {
        big_prio_img.innerHTML = `${bigelement['prio']}  <img src="${prioBigImg}">`;
    }
}


/**
 * startDrag(id) assigns the value of id to the variable draggedTo, to follow the element being dragged in a drag and drop operation.
 *
 * @param {number} id - The id provides a unique identifier for the object.
 */
function startDrag(id) {
    draggedTo = id;
    const card = document.getElementById(id);
    card.classList.add('rotate')
}

function endDrag(id) {
    const card = document.getElementById(id);
    card.classList.remove('rotate');
}


/**
 * enables dropping elements onto the target div
 *
 * @param {event} ev - the event object, which contains information about the event and allows manipulation of the default behavior associated with it
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * changes the category of the task being dragged to the new category.
 *
 * @param {string} category - used to update the category of a specific task in the tasks array.
 */
function moveTo(category) {
    tasks[draggedTo]["category"] = category;
    updateHtmlTodo();
    updateHtmlProgress();
    updateHtmlAwait();
    updateHtmlDone();
}


/**
 * filters tasks based on the search input.
 */
function filterTasks() {
    const searchValue = document.querySelector(".search_task_input").value.toLowerCase();
    clearAndFilterTasks(searchValue);
}


/**
 * updates the task sections after filter function.
 * 
 * @param {*} searchValue 
 */
function clearAndFilterTasks(searchValue) {
    document.getElementById("small_card_todo").innerHTML = "";
    document.getElementById("small_card_progress").innerHTML = "";
    document.getElementById("small_card_await").innerHTML = "";
    document.getElementById("small_card_done").innerHTML = "";
    tasks.filter((task) => task.title.toLowerCase().includes(searchValue) || task.description.toLowerCase().includes(searchValue)).forEach((task) => {
        const categoryElement = document.getElementById(`small_card_${task.category}`);
        if (categoryElement) {
            categoryElement.innerHTML += renderTaskCardToDo(task);
            changeArtBackground(`art_small_${task.id}`);
            addPrioImg(task);
        }
    });
}


/**
 * this function looks through each task to see if its id matches the taskId that was passed in and displays the big task card.
 * 
 * @param {*} taskId 
 */
function showBigTask(taskId) {
    const bigelement = tasks.find(task => task.id === taskId);
    if (bigelement) {
        document.getElementById('big_card_bg').classList.remove('d_none');
        document.getElementById("big_card_bg").innerHTML = "";
        document.getElementById('big_card_bg').innerHTML = renderBigTaskCard(bigelement);
        changeArtBackground(`big_art_${bigelement.id}`);
        addPrioBigImg(bigelement);
    }
}


/**
 * function to close the big card.
 */
function hideBigTask() {
    document.getElementById('big_card_bg').classList.add('d_none');
    document.getElementById('big_card_bg').innerHTML = '';
}