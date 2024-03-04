const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const monthDays = [
    31, 28, 31, 30,
    31, 30, 31, 31,
    30, 31, 30, 31
]


const tasks = []
let taskFormIsOpen = false;
let selectedDate = new Date()
let isLeap = (offsetDate(selectedDate, -5).getYear() - 100 )% 4 === 0
if(isLeap){
    monthDays[1] = 29
}

// ------------ Helper Functions ------------

function formatDate(date){

    date = new Date(date)
    // return Intl.DateTimeFormat("en-GB").format(date)
    let monthDay = String(date.getDate())
    let month = String(date.getMonth() + 1)
    let year = String((date.getYear() - 100) + 2000)

    monthDay = monthDay.length === 1? `0${monthDay}`: monthDay
    month = month.length === 1? `0${month}`: month
    return `${year}-${month}-${monthDay}`



}

function offsetDate(date, offset){
    // Convert to unix time (no. of milliseconds since 01/01/1970)
    const unixDate = date.valueOf() 
    let hours = offset * 24 
    let minutes = hours * 60
    let seconds = minutes * 60 
    let milliSeconds = seconds  * 1000

    // offset the current date using the milliseconds then generate a new date. 
    const newUnixDate = unixDate + milliSeconds
    
    return new Date(newUnixDate)
}

function getWeekRange(startDate){
    let date = new Date(startDate)
    let day = date.getDay()
    let offsets = {}
    for(let dayOffset=0; dayOffset<=6; dayOffset++){
        let wkDay = offsetDate(date, dayOffset - day)
        let index = weekDays[wkDay.getDay()]
        offsets[index] = wkDay
    }

    return offsets
}


function timeDiff(t2, t1) {
    // t2 --> end time (24 hr format),  
    // t1 --> Start time (24 hr format),  
    // Return --> t2 - t1 (in hours)

    const time1 = new Date()
    const [t1Hours, t1Minutes] = t1.split(":")
    time1.setHours(t1Hours)
    time1.setMinutes(t1Minutes)

    const time2 = new Date()
    const [t2Hours, t2Minutes] = t2.split(":")
    time2.setHours(t2Hours)
    time2.setMinutes(t2Minutes)

    minDiff = ((time2 - time1) / 1000) / 60
    hrsDiff = minDiff / 60
    console.log(hrsDiff)
    return hrsDiff

}

function to24Hrs(time){
    let AM_PM = time.slice(-2) 
    let [hours, minutes] = time.slice(0, -2).split(":")
    if(hours < 12 && AM_PM === "PM"){
        hours = Number(hours) + 12
    }else if(hours === "12" && AM_PM === "AM"){
        hours = "00"
    }

    hours = String(hours)
    minutes = String(minutes)

    hours = hours.length === 1? `0${hours}`: hours
    minutes = minutes.length === 1? `0${minutes}`: minutes

    return `${hours}:${minutes}`
}

function to12Hrs(time){
    if(!time) return ""

    let [hours, minutes] = time.split(":")
    hours = Number(hours)
    minutes = Number(minutes)

    if(hours < 12){
        hours = hours === 0? "12" : hours
        return `${hours}:${minutes}AM`
    }
    else if (hours === 12) {
        return `${hours}:${minutes}PM`
    } 
    else {
        return `${hours - 12}:${minutes}PM`
    }
}

// Task CRUD functions

function getTaskByHour({day, hour}){
    
    const task = tasks.filter(task=>{
        return task.hour === hour && task.day === day 
    })[0]
    return task
}

function getTaskByID(taskID) {
    console.log(taskID)
    return tasks.filter (task => task.id === taskID)[0]
}

function updateOrCreateTask(taskID) {
    // Read fomr data.
    const id = taskForm.querySelector("input[name=task_id]").value
    const day = taskForm.querySelector("input[name=task_day]").value
    let hour = taskForm.querySelector("input[name=task_hour]").value
    const date = taskForm.querySelector("input[name=task_date]").value
    const title = taskForm.querySelector("input[name=task_title]").value
    const endTime = taskForm.querySelector("input[name=task_end_time]").value
    const completed = taskForm.querySelector("input[name=task_completed]").checked
    const startTime = taskForm.querySelector("input[name=task_start_time]").value
    const description = taskForm.querySelector("textarea[name=task_description]").value
    
    // Calculated Fields.
    const duration = (endTime!=="" && startTime!=="")? timeDiff(endTime, startTime) : ""
    if (startTime) {
        let time = to12Hrs(startTime)
        let startHour = time.split(":")[0]
        let AM_PM = time.slice(-2)
        hour = `${startHour}:00${AM_PM}`
    }
    
    const taskItem = {id, day, hour, completed, date, startTime, endTime, duration, title, description }

    // Create if id is null or ""
    if(id){
        // update Task
        const taskIndex = tasks.indexOf(getTaskByID(taskID))
        tasks[taskIndex] = taskItem
    }else{
        // Create Task
        taskItem.id = crypto.randomUUID()
        tasks.push(taskItem)
    }
    return taskItem
}

function deleteTask(taskID){
    const taskIndex = tasks.findIndex(task=> task.id === taskID)
    tasks.splice(taskIndex, 1)
}


// ------------ Elements Selection ------------
const taskForm = document.querySelector("#task-form");
const hours = document.querySelectorAll("#Hour");
const taskElements = document.querySelectorAll(".task");
const deleteBtn = document.querySelector("#delete")
const weekRange = getWeekRange(selectedDate)

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

    const task = getTaskByHour(clickedTask)
    if(!task){
        taskForm.querySelector("input[name=task_day]").value = clickedTask["day"] ;
        taskForm.querySelector("input[name=task_hour]").value = clickedTask["hour"] ;
        taskForm.querySelector("input[name=task_start_time]").value = to24Hrs(clickedTask["hour"]);
        taskForm.querySelector("input[name=task_date]").value = formatDate(clickedTask["date"]);
    }else{
        taskForm.querySelector("input[name=task_id]").value = task["id"] ;
        taskForm.querySelector("input[name=task_date]").value = task["date"] ;
        taskForm.querySelector("input[name=task_title]").value = task["title"];
        taskForm.querySelector("input[name=task_day]").value = clickedTask["day"] ;
        taskForm.querySelector("input[name=task_hour]").value = clickedTask["hour"];
        taskForm.querySelector("input[name=task_end_time]").value = task["endTime"];
        taskForm.querySelector("input[name=task_completed]").value = task["completed"];
        taskForm.querySelector("input[name=task_start_time]").value = task["startTime"];
        taskForm.querySelector("textarea[name=task_description]").value = task["description"];
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
        hideTaskForm()
}
}

// ----------- Click Handlers
function handleTaskLeftClick(element) {
    hideTaskForm()
    element.parentElement.classList.add("selected-hour");
    
    const clickedTask = element.parentElement.dataset;
    const boundingRect = element.parentElement.getBoundingClientRect();
    showTaskForm(clickedTask, boundingRect);
}

function handleTaskSubmit(event){

    event.preventDefault()
    const id = taskForm.querySelector("input[name=task_id]").value
    console.log(id)
    const task = getTaskByID(id)
    //create if task is empty 
    task? updateOrCreateTask(task.id):updateOrCreateTask()
    renderTasks(task?.id)
    hideTaskForm()
    document.querySelector(".selected-hour")?.classList.remove("selected-hour");
}

function handleHourLeftClick(event) {
    hideTaskForm()
    event.preventDefault();
    document.querySelector(".selected-hour")?.classList.remove("selected-hour");
    event.target.classList.add("selected-hour");

    let clickedTask = event.target.dataset;
    if(!clickedTask.day){
        handleTaskLeftClick(event.target)
        return 
    }
    const boundingRect = event.target.getBoundingClientRect();
    showTaskForm(clickedTask, boundingRect);
}

// ----------- Drag Handlers 

function handleTaskDragStart(event) {
    hideTaskForm()
    event.dataTransfer.setData("text/plain", event.target.id);
}

function handleHourDragOver(event) {
    event.preventDefault();
}

function handleHourDrop(event) {
    const id = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    

    const taskIndex = tasks.findIndex(task=>task.id===draggableElement.id)
    const task = tasks[taskIndex]

    task["day"] = dropzone.dataset["day"] 
    task["hour"] = dropzone.dataset["hour"]
    
    task["startTime"] = to24Hrs(dropzone.dataset["hour"])

    task[taskIndex] = task
    dropzone.appendChild(draggableElement);
    event.dataTransfer.clearData();

}



// ------------ Renderer and Aux fns ------------
const drawTask = (task)=>{
    const taskTemplate = document.querySelector("#task-template")
    const taskElem = taskTemplate.cloneNode(true)
    const parentElem = document.querySelector(`[data-day="${task.day}"][data-hour="${task.hour}"]`)
    const height = Math.max(task["duration"] * 3.65, 1)
    
    taskElem.id = task["id"]
    taskElem.textContent = task["title"]
    taskElem.addEventListener("click", handleHourLeftClick)
    taskElem.addEventListener("dragstart", handleTaskDragStart);
    console.log(task)
    taskElem.style["height"] = height + "rem"
    parentElem.appendChild(taskElem)

    return 
}

function renderTasks(taskID){
    // Use the task template to generate an new task element.
    if(taskID){
        let task = getTaskByID(taskID)
        document.getElementById(task.id)?.remove()
        drawTask(task)
    }else{

        tasks.map(task=>{
            // Remove existing element
            document.getElementById(task.id)?.remove()
            drawTask(task)
        })
    }
}

// ------------ Event Binders ------------
taskForm.addEventListener("submit", handleTaskSubmit);
document.addEventListener("keydown", handleTaskFormClose)
taskElements.forEach((task) => {
    task.addEventListener("dragstart", handleTaskDragStart);
    task.addEventListener("click", handleTaskLeftClick);
});

hours.forEach((hour) => {
    const date = weekRange[hour.dataset.day]
    hour.dataset["date"] = formatDate(date)
    hour.addEventListener("click", handleHourLeftClick);
    hour.addEventListener("dragover", handleHourDragOver);
    hour.addEventListener("drop", handleHourDrop);
});












// const dayHours = [
//     "1:00AM",
//     "2:00AM",
//     "3:00AM",
//     "4:00AM",
//     "5:00AM",
//     "6:00AM",
//     "7:00AM",
//     "8:00AM",
//     "9:00AM",
//     "10:00AM",
//     "11:00AM",
//     "12:00AM",
//     "1:00PM",
//     "2:00PM",
//     "3:00PM",
//     "4:00PM",
//     "5:00PM",
//     "6:00PM",
//     "7:00PM",
//     "8:00PM",
//     "9:00PM",
//     "10:00PM",
//     "11:00PM",
//     "12:00PM",
// ];

