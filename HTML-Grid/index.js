const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const dayHours = [
    "1:00AM",
    "2:00AM",
    "3:00AM",
    "4:00AM",
    "5:00AM",
    "6:00AM",
    "7:00AM",
    "8:00AM",
    "9:00AM",
    "10:00AM",
    "11:00AM",
    "12:00PM",
    "1:00PM",
    "2:00PM",
    "3:00PM",
    "4:00PM",
    "5:00PM",
    "6:00PM",
    "7:00PM",
    "8:00PM",
    "9:00PM",
    "10:00PM",
    "11:00PM",
    "12:00AM",
];

const cellHeight = 3.65; // heigh of a day cell.

const tasks = [];
let taskFormIsOpen = false;
let selectedDate = new Date();




// ------------ Helper Functions ------------

function formatDate(date) {
    date = new Date(date);
    // return Intl.DateTimeFormat("en-GB").format(date)
    let monthDay = String(date.getDate());
    let month = String(date.getMonth() + 1);
    let year = String(date.getYear() - 100 + 2000);

    monthDay = monthDay.length === 1 ? `0${monthDay}` : monthDay;
    month = month.length === 1 ? `0${month}` : month;
    return `${year}-${month}-${monthDay}`;
}

function offsetDate(date, offset) {
    // Convert to unix time (no. of milliseconds since 01/01/1970)
    const unixDate = date.valueOf();
    let hours = offset * 24;
    let minutes = hours * 60;
    let seconds = minutes * 60;
    let milliSeconds = seconds * 1000;

    // offset the current date using the milliseconds then generate a new date.
    const newUnixDate = unixDate + milliSeconds;

    return new Date(newUnixDate);
}

function getWeekRange(startDate) {
    let date = new Date(startDate);
    let day = date.getDay();
    let weekDates = {};
    for (let dayOffset = 0; dayOffset <= 6; dayOffset++) {
        let wkDay = offsetDate(date, dayOffset - day);
        let index = weekDays[wkDay.getDay()];
        console.log(date)
        weekDates[index] = wkDay;
    }

    return weekDates;
}

function timeDiff(t2, t1) {
    // t2 --> end time (24 hr format),
    // t1 --> Start time (24 hr format),
    // Return --> t2 - t1 (in hours)

    const time1 = new Date();
    const [t1Hours, t1Minutes] = t1.split(":");
    time1.setHours(t1Hours);
    time1.setMinutes(t1Minutes);

    const time2 = new Date();
    const [t2Hours, t2Minutes] = t2.split(":");
    time2.setHours(t2Hours);
    time2.setMinutes(t2Minutes);

    minDiff = (time2 - time1) / 1000 / 60;
    hrsDiff = minDiff / 60;
    return hrsDiff;
}

function to24Hrs(time) {
    let AM_PM = time.slice(-2);
    let [hours, minutes] = time.slice(0, -2).split(":");
    if (hours < 12 && AM_PM === "PM") {
        hours = Number(hours) + 12;
    } else if (hours === "12" && AM_PM === "AM") {
        hours = "00";
    }

    hours = String(hours);
    minutes = String(minutes);

    hours = hours.length === 1 ? `0${hours}` : hours;
    minutes = minutes.length === 1 ? `0${minutes}` : minutes;

    return `${hours}:${minutes}`;
}

function to12Hrs(time) {
    if (!time) return "";

    let [hours, minutes] = time.split(":");
    hours = Number(hours);
    minutes = Number(minutes);

    if (hours < 12) {
        hours = hours === 0 ? "12" : hours;
        return `${hours}:${minutes}AM`;
    } else if (hours === 12) {
        return `${hours}:${minutes}PM`;
    } else {
        return `${hours - 12}:${minutes}PM`;
    }
}

// Task CRUD functions
function getTaskByHour({ day, hour }) {
    const task = tasks.filter((task) => {
        return task.hour === hour && task.day === day;
    })[0];
    return task;
}

function getTaskByID(taskID) {
    console.log(taskID);
    return tasks.filter((task) => task.id === taskID)[0];
}

function updateOrCreateTask(taskID) {
    // Read fomr data.
    const id = taskForm.querySelector("input[name=task_id]").value;
    let day = taskForm.querySelector("input[name=task_day]").value;
    let hour = taskForm.querySelector("input[name=task_hour]").value;
    const date = taskForm.querySelector("input[name=task_date]").value;
    const title = taskForm.querySelector("input[name=task_title]").value;
    const endTime = taskForm.querySelector("input[name=task_end_time]").value;
    const completed = taskForm.querySelector(
        "input[name=task_completed]"
    ).checked;
    const startTime = taskForm.querySelector("input[name=task_start_time]").value;
    const description = taskForm.querySelector(
        "textarea[name=task_description]"
    ).value;

    // Calculated Fields.
    const duration =
        endTime !== "" && startTime !== "" ? timeDiff(endTime, startTime) : "";
    if (startTime) {
        let time = to12Hrs(startTime);
        let startHour = time.split(":")[0];
        let AM_PM = time.slice(-2);
        hour = `${startHour}:00${AM_PM}`;
    }

    if (date) {
        let temp = new Date(date);
        day = weekDays[temp.getDay()];
    }

    const taskItem = {
        id,
        day,
        hour,
        completed,
        date,
        startTime,
        endTime,
        duration,
        title,
        description,
    };

    // Create if id is null or ""
    if (id) {
        // update Task
        const taskIndex = tasks.indexOf(getTaskByID(taskID));
        tasks[taskIndex] = taskItem;
    } else {
        // Create Task
        taskItem.id = crypto.randomUUID();
        tasks.push(taskItem);
    }
    return taskItem;
}

function deleteTask(taskID) {
    const taskIndex = tasks.findIndex((task) => task.id === taskID);
    tasks.splice(taskIndex, 1);
}

// ------------ Elements Selection ------------
const toCalendarButton = document.getElementById("to-calendar")
const taskForm = document.querySelector("#task-form");
const taskElements = document.querySelectorAll(".task");
const deleteBtn = document.querySelector("#delete");
const hourLabelsElement = document.querySelector("#hours-labels")
const baseDate = document.querySelector("#base-date")
const calendarSection = document.querySelector("section[id=calendar]")
const tasksSection = document.querySelector("section[id=tasks]")

let weekRange = getWeekRange(selectedDate);

// ------------ Form Control Methods ------------
function hideTaskForm() {
    taskForm.querySelector("input[name=task_id]").value = "";
    taskForm.querySelector("input[name=task_hour]").value = "";
    taskForm.querySelector("input[name=task_day]").value = "";
    taskForm.querySelector("input[name=task_completed]").checked = false;
    taskForm.querySelector("input[name=task_date]").value = "";
    taskForm.querySelector("input[name=task_start_time]").value = "";
    taskForm.querySelector("input[name=task_end_time]").value = "";
    taskForm.querySelector("input[name=task_title]").value = "";
    taskForm.querySelector("textarea[name=task_description]").value = "";
    taskForm.style["display"] = "none";
    document.querySelector(".selected-hour")?.classList.remove("selected-hour");

    taskFormIsOpen = false;
}

function showTaskForm(clickedTask, pos) {
    const task = getTaskByHour(clickedTask);
    if (!task) {
        taskForm.querySelector("input[name=task_day]").value = clickedTask["day"];
        taskForm.querySelector("input[name=task_hour]").value = clickedTask["hour"];
        taskForm.querySelector("input[name=task_start_time]").value = to24Hrs(
            clickedTask["hour"]
        );
        taskForm.querySelector("input[name=task_date]").value = formatDate(
            clickedTask["date"]
        );
    } else {
        taskForm.querySelector("input[name=task_id]").value = task["id"];
        taskForm.querySelector("input[name=task_date]").value = task["date"];
        taskForm.querySelector("input[name=task_title]").value = task["title"];
        taskForm.querySelector("input[name=task_day]").value = clickedTask["day"];
        taskForm.querySelector("input[name=task_hour]").value = clickedTask["hour"];
        taskForm.querySelector("input[name=task_end_time]").value = task["endTime"];
        taskForm.querySelector("input[name=task_completed]").value =
            task["completed"];
        taskForm.querySelector("input[name=task_start_time]").value =
            task["startTime"];
        taskForm.querySelector("textarea[name=task_description]").value =
            task["description"];
    }

    const y = pos.y + window.scrollY;
    taskForm.style["position"] = "absolute";
    taskForm.style["left"] = pos.x + "px";
    taskForm.style["top"] = y + "px";
    taskForm.style["display"] = "block";

    taskFormIsOpen = true;
}

// ------------ Event Handlers ------------
// -------- Keydown handlers
function handleTaskFormClose(event) {
    if (event.key === "Escape" && taskFormIsOpen) {
        hideTaskForm();
    }
}

// -------- Change handlers.
function changeBaseDate(){
    selectedDate = new Date(baseDate.value)
    const hourElements = document.querySelectorAll('[data-role="hour-cell"]')
    weekRange = getWeekRange(selectedDate)
    hourElements.forEach(element=>{
        const index = element.dataset["day"]
        element.dataset['date'] = formatDate(weekRange[index])
    })
    console.log()
}
function handleBaseDateChange(event){
    selectedDate = new Date(baseDate.value)
    const hourElements = document.querySelectorAll('[data-role="hour-cell"]')
    weekRange = getWeekRange(selectedDate)
    hourElements.forEach(element=>{
        const index = element.dataset["day"]
        element.dataset['date'] = formatDate(weekRange[index])
    })
    console.log()
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
    const boundingRect = element.parentElement.getBoundingClientRect();
    showTaskForm(clickedTask, boundingRect);
}

function handleToCalendar(event){
    event.preventDefault();
    calendarSection.style["display"] = "flex"
    tasksSection.style["display"] = "none"

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

    task["startTime"] = to24Hrs(dropzone.dataset["hour"]);

    tasks[taskIndex] = task;
    drawNextDay(task);
    dropzone.appendChild(draggableElement);
    event.dataTransfer.clearData();
}

// ------------ Renderer and Aux fns ------------
const drawTask = (task) => {
    const taskTemplate = document.querySelector("#task-template");
    const taskElem = taskTemplate.cloneNode(true);

    const parentElem = document.querySelector(
        `[data-day="${task.day}"][data-hour="${task.hour}"]`
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

    taskElem.style["height"] = height + "rem";
    parentElem.appendChild(taskElem);
};

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

function drawNextDay(task, startHour) {
    startHour = startHour ? startHour : "12:00AM";
    const hoursToEOD = timeDiff("23:59", task.startTime); // Hours to end of day
    const excess = hoursToEOD - task.duration;

    if (excess < 0) {
        let nextDay = offsetDate(new Date(task.date), 1);

        const extendedTask = {
            ...task,
            duration: Math.abs(excess),
            day: weekDays[nextDay.getDay()],
            hour: startHour,
            title: task.title + " cnt'd",
            isExtension: true,
        };
        document.getElementById(task.id).height =
            String(hoursToEOD * cellHeight) + "rem!important";
        console.log(document.getElementById(task.id));
        drawTask(extendedTask);
    }
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
dayHours.map(hour=>{
    // Add the hour text on first column
    const hourIndexElement = document.createElement("div")
    hourIndexElement.classList.add("row")
    hourIndexElement.classList.add("index")
    hourIndexElement.innerText = hour
    hourIndexElement.dataset["role"] = "hour-label"

    hourLabelsElement.appendChild(hourIndexElement)

    // Create cells for the tasks.
    weekDays.map(weekDay=>{
        const dayElement = document.getElementById(weekDay)
        const hourElement = document.createElement("div")
        hourElement.dataset["hour"] = hour
        hourElement.dataset["day"] = weekDay
        hourElement.dataset["role"] = "hour-cell"
        hourElement.classList.add("row")

        const date = weekRange[weekDay];
    
        hourElement.dataset["date"] = formatDate(date);
        hourElement.addEventListener("click", handleHourLeftClick);
        hourElement.addEventListener("dragover", handleHourDragOver);
        hourElement.addEventListener("drop", handleHourDrop);
    
        hourElement.id = `${weekDay}-${hour}`
        if(hour === "12:00AM"){
            hourElement.innerText = "."
        }
        dayElement.appendChild(hourElement)
    })
})
