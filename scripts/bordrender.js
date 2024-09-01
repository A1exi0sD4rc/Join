function renderTaskCardtoDo(element) {
    return `
        <div class="task_card_small" draggable="true" ondragstart="startDrag(${element['id']})"></div>
    `;
}

/*
function renderTaskCardProgress(elementProgress) {
    return `
        <div class="task_card" draggable="true" ondragstart="startDrag(${elementProgress['id']})">
        <div class="tasks_topic">${elementProgress['topic']}</div>
        <div class="tasks_content_small">${elementProgress['content']}</div>
        </div>
    `;
}


function renderTaskCardAwait(elementAwait) {
    return `
        <div class="task_card" draggable="true" ondragstart="startDrag(${elementAwait['id']})">
        <div class="tasks_topic">${elementAwait['topic']}</div>
        <div class="tasks_content_small">${elementAwait['content']}</div>
        </div>
    `;
}


function renderTaskCardDone(elementDone) {
    return `
        <div class="task_card" draggable="true" ondragstart="startDrag(${elementDone['id']})">
        <div class="tasks_topic">${elementDone['topic']}</div>
        <div class="tasks_content_small">${elementDone['content']}</div>
        </div>
    `;
}
*/