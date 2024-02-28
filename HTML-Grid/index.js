
const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
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
    "12:00AM",
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
    "12:00PM",
];

const timeTable = weekDays.map((day) => {
    return dayHours.map((hour) => {
        return {
            day,
            hour,
            completed: false,
            date: "",
            startTime: "", // 24 hrs
            endTime: "",// 24 hrs
            duration: "", // in hrs
            title: "",
            description: "",
        };
    });
});


// ------------ Helper Functions ------------
function timeDiff(t2, t1){
    // t2 --> end 
    // t1 --> Start

    const time1 = new Date()
    const [t1Hours, t1Minutes] = t1.split(":")
    time1.setHours(t1Hours)
    time1.setMinutes(t1Minutes)
    
    const time2 = new Date()
    const [t2Hours, t2Minutes] = t2.split(":")
    time2.setHours(t2Hours)
    time2.setMinutes(t2Minutes)

    minDiff = ((time2 - time1)/1000)/60
    hrsDiff = minDiff/60
    console.log(hrsDiff)
    return hrsDiff

}
const getTask = (day, hour) => {
    const dayIndex = weekDays.indexOf(day);
    const hourIndex = dayHours.indexOf(hour)
    console.log(dayIndex, hourIndex)
    return timeTable[dayIndex][hourIndex]
}

const setTask = (day, hour, task) => {
    const dayIndex = weekDays.indexOf(day);
    const hourIndex = dayHours.indexOf(hour)
    timeTable[dayIndex][hourIndex] = task
    return true
}

// ------------ Elements Selection ------------
const taskForm = document.querySelector("#task-form");
const hours = document.querySelectorAll("#Hour");
const tasks = document.querySelectorAll(".task");


// ------------ Form Control Methods ------------
function hideTaskForm() {
    taskForm.querySelector("input[name=task_hour]").value = "";
    taskForm.querySelector("input[name=task_day]").value = "";
    taskForm.querySelector("input[name=task_completed]").value = false;
    taskForm.querySelector("input[name=task_date]").value = "";
    taskForm.querySelector("input[name=task_start_time]").value = "";
    taskForm.querySelector("input[name=task_end_time]").value = "";
    taskForm.querySelector("input[name=task_title]").value = "";
    taskForm.querySelector("textarea[name=task_description]").value = "";

    taskForm.style["display"] = "none";
}

function showTaskForm(task, pos) {
    
    task = getTask(task.day, task.hour)

    taskForm.querySelector("input[name=task_hour]").value = task["hour"];
    taskForm.querySelector("input[name=task_day]").value = task["day"];
    taskForm.querySelector("input[name=task_completed]").value =task["completed"];
    taskForm.querySelector("input[name=task_date]").value = task["date"];
    taskForm.querySelector("input[name=task_start_time]").value =task["startTime"];
    taskForm.querySelector("input[name=task_end_time]").value = task["endTime"];
    taskForm.querySelector("input[name=task_title]").value = task["title"];
    taskForm.querySelector("textarea[name=task_description]").value =task["description"];

    taskForm.style["position"] = "absolute";
    taskForm.style["display"] = "block";

    const y = pos.y + window.scrollY;
    taskForm.style["left"] = pos.x + "px";
    taskForm.style["top"] = y + "px";
}


function redrawTask(task){
    const height = Math.max(task["duration"] * 3, 1)
    task = document.querySelector(".task") 
    task.style["height"] = height + "rem"


}

// ------------ Event Handlers ------------
function handleTaskSubmit(event) {
    event.preventDefault();
    const submittedDay = event.target.querySelector("input[name=task_day]").value;
    const submittedHour = event.target.querySelector(
        "input[name=task_hour]"
    ).value;

    
    const oldTask = getTask(submittedDay, submittedHour)

    const newTask = {
        ...oldTask,
        completed: event.target.querySelector("input[name=task_completed]").value,
        date: event.target.querySelector("input[name=task_date]").value,
        startTime: event.target.querySelector("input[name=task_start_time]").value,
        endTime: event.target.querySelector("input[name=task_end_time]").value,
        title: event.target.querySelector("input[name=task_title]").value,
        description: event.target.querySelector("textarea[name=task_description]")
            .value,
    };

    newTask["duration"] = timeDiff(newTask["endTime"], newTask["startTime"])
    console.log(newTask)
    setTask(submittedDay, submittedHour, newTask)

    hideTaskForm();
    redrawTask(newTask)
    document.querySelector(".selected-hour").classList.remove("selected-hour");
}

function handleHourLeftClick(event) {
    event.preventDefault();

    document.querySelector(".selected-hour")?.classList.remove("selected-hour");
    event.target.classList.add("selected-hour");

    let task = event.target.dataset;
    const boundingRect = event.target.getBoundingClientRect();
    showTaskForm(task, boundingRect);
}

function handleHourDragOver(event) {
    event.preventDefault();
  }

function handleHourDrop(event) {
    const id = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    dropzone.appendChild(draggableElement);
    event.dataTransfer.clearData();
}

function handleTaskDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log(event.dataTransfer.getData("text"));
}

function handleTaskLeftClick(event) {
    const task = event.target.parentElement.dataset;
    console.log(task)
    const boundingRect = event.target.parentElement.getBoundingClientRect();
    showTaskForm(task, boundingRect);
}

// ------------ Event Binders ------------
taskForm.addEventListener("submit", handleTaskSubmit);
hours.forEach((hour) => {
    hour.addEventListener("click", handleHourLeftClick);
    hour.addEventListener("dragover", handleHourDragOver);
    hour.addEventListener("drop", handleHourDrop);
});
tasks.forEach((task) => {
    task.addEventListener("dragstart", handleTaskDragStart);
    task.addEventListener("click", handleTaskLeftClick);
});
