const newTaskBtn = document.querySelector(".new-task-btn");
const modal = document.querySelector(".modal");
const form = document.querySelector(".new-task");
const todoStage = document.querySelector("#todo-stage")
const inprogessStage = document.querySelector("#inprogress-stage")
const completedStage = document.querySelector("#completed-stage")

let todoTasks = [{name: "task1"},{name: "task4"},{name: "task6"}];
let inProgessTasks = [{name: "task3"},{name: "task5"}];
let completedTasks = [{name: "task2"}];

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
    tasks.forEach((target) => {
        const task = document.createElement("div");
        task.classList.add("task");

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

        console.dir(stage)
        stageTasks.appendChild(task);
        updateTotalTasks(tasks,stage,1);
    });
}

function init(){
    renderTasks(todoTasks,todoStage);
    renderTasks(inProgessTasks,inprogessStage);
    renderTasks(completedTasks,completedStage);
}

function updateTotalTasks(tasks,stage) {
    const stagetotaltasks = stage.children[0].children[1].children[0];
    stagetotaltasks.textContent = tasks.length;
}

init();