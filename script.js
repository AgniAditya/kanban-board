const newTaskBtn = document.querySelector(".new-task-btn");
const modal = document.querySelector(".modal");
const form = document.querySelector(".new-task");
const todoStage = document.querySelector("#todo-stage")
const inprogessStage = document.querySelector("#inprogress-stage")
const completedStage = document.querySelector("#completed-stage")

let todoTasks = JSON.parse(localStorage.getItem("to do")) || [];
let inProgessTasks = JSON.parse(localStorage.getItem("in progress")) || [];
let completedTasks = JSON.parse(localStorage.getItem("done")) || [];

let stages = [
    {
        stage: todoStage,
        tasks: todoTasks
    },
    {
        stage: inprogessStage,
        tasks: inProgessTasks
    },
    {
        stage: completedStage,
        tasks: completedTasks
    }
];

let draggedElement = null;
let parentColumn = null;

newTaskBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskName = e.target[0].value;
    const taskDetails = e.target[1].value;

    todoTasks.push({
        name: taskName,
        details: taskDetails
    })

    renderTasks(todoTasks,todoStage)

    form.reset();
    modal.style.display = "none";
});

function renderTasks(tasks,stage) {
    const stageTasks = stage.children[1];
    stageTasks.innerHTML = "";
    saveToLocalStorage(tasks,stage);
    tasks.forEach((target,index) => {
        const task = document.createElement("div");
        task.classList.add("task");
        task.setAttribute("draggable","true");
        task.addEventListener("drag", (e) => {
            draggedElement = task;
            parentColumn = stage;
        })

        const details = document.createElement("div");
        details.classList.add("details");

        const title = document.createElement("h4");
        title.textContent = target.name;

        const description = document.createElement("p");
        description.textContent = target.details;

        details.appendChild(title);
        details.appendChild(description);

        const deleteWrapper = document.createElement("div");
        deleteWrapper.classList.add("delete-task");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-task-btn");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener('click', () => {
            const index = tasks.indexOf(target);
            tasks.splice(index,1);
            updateTotalTasks(tasks,stage,-1);
            renderTasks(tasks,stage);
        })

        deleteWrapper.appendChild(deleteBtn);

        task.appendChild(details);
        task.appendChild(deleteWrapper);

        stageTasks.appendChild(task);
        updateTotalTasks(tasks,stage,1);
    });
}

function init(){
    stages.forEach((stage) => {
        renderTasks(stage.tasks,stage.stage);
        addDragAndDropEventsOnColumns(stage.stage)
    })
}

function updateTotalTasks(tasks,stage) {
    const stagetotaltasks = stage.children[0].children[1].children[0];
    stagetotaltasks.textContent = tasks.length;
}

function saveToLocalStorage(tasks,stage){
    const stageName = stage.children[0].children[0].textContent.toLowerCase();
    localStorage.setItem(stageName,JSON.stringify(tasks))
}

function addDragAndDropEventsOnColumns(column){
    column.addEventListener("dragenter",(e) => {
        e.preventDefault()
        column.classList.add('hover-over')
    })
    column.addEventListener("dragleave",(e) => {
        e.preventDefault()
        column.classList.remove('hover-over')
    })
    column.addEventListener("dragover",(e) => {
        e.preventDefault();
    })
    column.addEventListener("drop",(e) => {
        e.preventDefault();
        column.classList.remove('hover-over')
        const currentObj = stages.find((stageItem) => stageItem.stage === column);
        const parentObj = stages.find((stageItem) => stageItem.stage === parentColumn);

        const taskDescription = draggedElement.children[0].children[1].textContent;
        const taskName = draggedElement.children[0].children[0].textContent;

        currentObj.tasks.push({
            name: taskName,
            details: taskDescription
        })
        const index = parentObj.tasks.indexOf(draggedElement);
        parentObj.tasks.splice(index,1);
        updateTotalTasks(parentObj.tasks,parentObj.stage,-1);

        renderTasks(currentObj.tasks,currentObj.stage)
        renderTasks(parentObj.tasks,parentObj.stage)
    })
}

init();