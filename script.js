const newTaskBtn = document.querySelector(".new-task-btn");
const closeModalBtn = document.querySelector(".close-btn");
const modal = document.querySelector(".modal");
const taskForm = document.querySelector(".new-task");

const todoColumn = document.querySelector("#todo-stage");
const inProgressColumn = document.querySelector("#inprogress-stage");
const completedColumn = document.querySelector("#completed-stage");

let todoTasks = JSON.parse(localStorage.getItem("to do")) || [];
let inProgressTasks = JSON.parse(localStorage.getItem("in progress")) || [];
let completedTasks = JSON.parse(localStorage.getItem("done")) || [];

const columns = [
    { element: todoColumn, tasks: todoTasks },
    { element: inProgressColumn, tasks: inProgressTasks },
    { element: completedColumn, tasks: completedTasks },
];

let draggedTask = null;
let sourceColumn = null;

newTaskBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskName = e.target[0].value;
    const taskDetails = e.target[1].value;

    todoTasks.push({
        index: todoTasks.length - 1,
        name: taskName,
        details: taskDetails,
    });

    renderTasks(todoTasks, todoColumn);

    taskForm.reset();
    modal.style.display = "none";
});

function renderTasks(tasks, columnEl) {
    const taskList = columnEl.children[1];
    const columnData = columns.find((c) => c.element === columnEl);

    taskList.innerHTML = "";
    saveToLocalStorage(tasks, columnEl);

    tasks.forEach((taskData, index) => {
        const taskEl = createTaskElement(taskData, index, tasks, columnEl, columnData);
        taskList.appendChild(taskEl);
    });

    updateTaskCount(tasks, columnEl);
}

function createTaskElement(taskData, index, tasks, columnEl, columnData) {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task");
    taskEl.setAttribute("draggable", "true");
    taskEl.setAttribute("data-index", index);

    if (columnData.element === todoColumn) taskEl.classList.add("todo-tasks");
    else if (columnData.element === inProgressColumn) taskEl.classList.add("inprogress-tasks");
    else taskEl.classList.add("completed-tasks");

    const detailsEl = document.createElement("div");
    detailsEl.classList.add("details");

    const titleEl = document.createElement("h4");
    titleEl.textContent = taskData.name;

    const descriptionEl = document.createElement("p");
    descriptionEl.textContent = taskData.details;

    detailsEl.appendChild(titleEl);
    detailsEl.appendChild(descriptionEl);

    const deleteWrapper = document.createElement("div");
    deleteWrapper.classList.add("delete-task");

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-task-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
        tasks.splice(tasks.indexOf(taskData), 1);
        renderTasks(tasks, columnEl);
    });

    deleteWrapper.appendChild(deleteBtn);

    taskEl.addEventListener("drag", () => {
        draggedTask = taskEl;
        sourceColumn = columnEl;
    });

    taskEl.appendChild(detailsEl);
    taskEl.appendChild(deleteWrapper);

    return taskEl;
}

function addDragAndDropListeners(columnEl) {
    columnEl.addEventListener("dragenter", (e) => {
        e.preventDefault();
        columnEl.classList.add("hover-over");
    });

    columnEl.addEventListener("dragleave", (e) => {
        e.preventDefault();
        columnEl.classList.remove("hover-over");
    });

    columnEl.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    columnEl.addEventListener("drop", (e) => {
        e.preventDefault();
        columnEl.classList.remove("hover-over");

        const targetColumnData = columns.find((c) => c.element === columnEl);
        const sourceColumnData = columns.find((c) => c.element === sourceColumn);

        const taskName = draggedTask.children[0].children[0].textContent;
        const taskDetails = draggedTask.children[0].children[1].textContent;

        targetColumnData.tasks.push({
            index: targetColumnData.tasks.length - 1,
            name: taskName,
            details: taskDetails,
        });

        sourceColumnData.tasks.splice(draggedTask.dataset.index, 1);

        renderTasks(targetColumnData.tasks, targetColumnData.element);
        renderTasks(sourceColumnData.tasks, sourceColumnData.element);
    });
}

function updateTaskCount(tasks, columnEl) {
    const countEl = columnEl.children[0].children[1].children[0];
    countEl.textContent = tasks.length;
}

function saveToLocalStorage(tasks, columnEl) {
    const columnName = columnEl.children[0].children[0].textContent.toLowerCase();
    localStorage.setItem(columnName, JSON.stringify(tasks));
}

function init() {
    columns.forEach(({ element, tasks }) => {
        renderTasks(tasks, element);
        addDragAndDropListeners(element);
    });
}

init();