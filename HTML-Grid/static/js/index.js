/*
Order in html
    * DateMethods.js
    * TaskFormControl.js
    * Tasks.js
    * TaskRender.js
    * index.js
    * calendar/calendar.js
*/ 


// ------------ Elements Selection ------------
const toCalendarButton = document.getElementById("to-calendar")
const taskElements = document.querySelectorAll("[data-role=task]");
const deleteBtn = document.querySelector("#delete");
const hourLabelsElement = document.querySelector("#hours-labels")
const baseDate = document.querySelector("#base-date")
const calendarSection = document.querySelector("section[id=calendar]")
const tasksSection = document.querySelector("section[id=tasks]")

// ------------ APP Globals ------------
const cellHeight = 3.65; // heigh of a day cell.
let selectedDate = new Date();
let weekRange = DateMethods.getWeekRange(selectedDate);


// -------- Keydown handlers
function handleTaskFormClose(event) {
    if (event.key === "Escape" && taskFormIsOpen) {
        hideTaskForm();
    }
}

// -------- Change handlers.
function changeBaseDate() {
    selectedDate = new Date(baseDate.value)
    const hourElements = document.querySelectorAll('[data-role="hour-cell"]')
    weekRange = DateMethods.getWeekRange(selectedDate)
    hourElements.forEach(element => {
        const index = element.dataset["day"]
        element.dataset['date'] = DateMethods.formatDate(weekRange[index])
    })
}
function handleBaseDateChange(event) {
    selectedDate = new Date(baseDate.value)
    const hourElements = document.querySelectorAll('[data-role="hour-cell"]')
    weekRange = DateMethods.getWeekRange(selectedDate)
    hourElements.forEach(element => {
        const index = element.dataset["day"]
        element.dataset['date'] = DateMethods.formatDate(weekRange[index])
    })
}
// -------- Submit Handlers
function handleTaskSubmit(event) {
    event.preventDefault();
    const id = taskForm.querySelector("input[name=task_id]").value;
    const task = getTaskByID(id);
    //create if task is empty
    task ? updateOrCreateTask(task.id) : updateOrCreateTask();
    renderTasks(task?.id);
    hideTaskForm();
    document.querySelector(".selected-hour")?.classList.remove("selected-hour");
}
// ----------- Click Handlers

function handleTaskLeftClick(element) {
    hideTaskForm();
    element.parentElement.classList.add("selected-hour");

    const clickedTask = element.parentElement.dataset;
    const task = getClickedTask(clickedTask)
    
    const boundingRect = element.parentElement.getBoundingClientRect();
    showTaskForm(task, boundingRect);
}

function handleToCalendar(event) {
    event.preventDefault();
    calendarSection.style["display"] = "flex"
    tasksSection.style["display"] = "none"
    closeTasks()
}

function handleDeleteTask(event) {
    event.preventDefault();
    const id = taskForm.querySelector("input[name=task_id]").value;
    hideTaskForm();
    const taskElement = document.getElementById(id);
    taskElement.remove();
    deleteTask(id);
}

function handleHourLeftClick(event) {
    hideTaskForm();
    event.preventDefault();
    document.querySelector(".selected-hour")?.classList.remove("selected-hour");
    event.target.classList.add("selected-hour");

    let clickedTask = event.target.dataset;
    if (!clickedTask.day) {
        handleTaskLeftClick(event.target);
        return;
    }
    const boundingRect = event.target.getBoundingClientRect();
    showTaskForm(clickedTask, boundingRect);
}

// ----------- Drag Handlers
function handleTaskDragStart(event) {
    hideTaskForm();
    event.dataTransfer.setData("text/plain", event.target.id);

    const task = getTaskByID(event.target.id);
    document.querySelector(`[id="${task.id}"][data-extension=true]`)?.remove();
}

function handleHourDragOver(event) {
    event.preventDefault();
}

function handleHourDrop(event) {
    const id = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;

    const taskIndex = tasks.findIndex((task) => task.id === draggableElement.id);
    const task = tasks[taskIndex];

    task["day"] = dropzone.dataset["day"];
    task["hour"] = dropzone.dataset["hour"];
    task["date"] = dropzone.dataset["date"];

    task["startTime"] = DateMethods.to24Hrs(dropzone.dataset["hour"]);

    tasks[taskIndex] = task;
    drawNextDay(task);
    dropzone.appendChild(draggableElement);
    event.dataTransfer.clearData();
}

// ------------ Event Binders ------------
toCalendarButton.addEventListener("click", handleToCalendar);
taskForm.addEventListener("submit", handleTaskSubmit);
deleteBtn.addEventListener("click", handleDeleteTask);
document.addEventListener("keydown", handleTaskFormClose);
taskElements.forEach((task) => {
    task.addEventListener("dragstart", handleTaskDragStart);
    task.addEventListener("click", handleTaskLeftClick);
});


baseDate.addEventListener("change", handleBaseDateChange)
DateMethods.dayHours.map(hour => {
    // Add the hour text on first column
    const hourIndexElement = document.createElement("div")
    hourIndexElement.classList.add("row")
    hourIndexElement.classList.add("index")
    hourIndexElement.innerText = hour
    hourIndexElement.dataset["role"] = "hour-label"

    hourLabelsElement.appendChild(hourIndexElement)

    // Create cells for the tasks.
    DateMethods.weekDays.map(weekDay => {
        const dayElement = document.getElementById(weekDay)
        const hourElement = document.createElement("div")
        hourElement.dataset["hour"] = hour
        hourElement.dataset["day"] = weekDay
        hourElement.dataset["role"] = "hour-cell"
        hourElement.classList.add("row")

        const date = weekRange[weekDay];

        hourElement.dataset["date"] = DateMethods.formatDate(date);
        hourElement.addEventListener("click", handleHourLeftClick);
        hourElement.addEventListener("dragover", handleHourDragOver);
        hourElement.addEventListener("drop", handleHourDrop);

        hourElement.id = `${weekDay}-${hour}`
        if (hour === "12:00AM") {
            hourElement.innerText = "."
        }
        dayElement.appendChild(hourElement)
    })
})
