/*
Order in html
    * DateMethods.js
    * TaskFormControl.js
    * Tasks.js
    * TaskRender.js
    * index.js
    * calendar/calendar.js
*/ 


function drawTask(task){
    const taskTemplate = document.querySelector("#task-template");
    const taskElem = taskTemplate.cloneNode(true);

    const parentElem = document.querySelector(
        `[data-day="${task.day}"][data-hour="${task.hour}"][data-date="${task.date}"]`
    );

    taskElem.id = task["id"];
    taskElem.textContent = task["title"];
    taskElem.addEventListener("click", handleHourLeftClick);
    taskElem.addEventListener("dragstart", handleTaskDragStart);

    let height = Math.max(task["duration"] * cellHeight, 1);
    if (task.isExtension) {
        taskElem.dataset["extension"] = true;
        height = Math.max(task["duration"] * cellHeight, 1);
    }
    taskElem.dataset["role"] = "task"
    taskElem.style["height"] = height + "rem";
    parentElem.appendChild(taskElem);
};



function drawNextDay(task, startHour) {
    startHour = startHour ? startHour : "12:00AM";
    const hoursToEOD = DateMethods.timeDiff("23:59", task.startTime); // Hours to end of day
    const excess = hoursToEOD - task.duration;

    if (excess < 0) {
        let nextDay = DateMethods.offsetDate(new Date(task.date), 1);

        const extendedTask = {
            ...task,
            duration: Math.abs(excess),
            day: DateMethods.weekDays[nextDay.getDay()],
            hour: startHour,
            title: task.title + " cnt'd",
            isExtension: true,
        };
        document.getElementById(task.id).height =
            String(hoursToEOD * cellHeight) + "rem!important";
        drawTask(extendedTask);
    }
}

function renderTasks(taskID) {
    // Use the task template to generate an new task element.
    if (taskID) {
        let task = getTaskByID(taskID);
        document.getElementById(task.id)?.remove();
        drawTask(task);
    } else {
        tasks.map((task) => {
            // Remove existing element
            document.getElementById(task.id)?.remove();
            drawTask(task);
        });
    }
}

function unrenderTasks(taskID) {
    if (taskID) {
        document.querySelector(taskID).remove()
    } else {
        document.querySelectorAll("[data-role=task]").forEach(element => element.remove())
    }
}

function openTasks() {
    hideTaskForm()
    renderTasks()
}

function closeTasks() {
    hideTaskForm()
    unrenderTasks()
}