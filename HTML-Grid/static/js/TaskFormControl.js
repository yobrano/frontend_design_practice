
// ----------- Elements Selection -----------
const taskForm = document.querySelector("#task-form");
const taskIdField = taskForm.querySelector("input[name=task_id]")
const taskHourField = taskForm.querySelector("input[name=task_hour]")
const taskDayField = taskForm.querySelector("input[name=task_day]")
const taskCompletedField = taskForm.querySelector("input[name=task_completed]")
const taskDateField = taskForm.querySelector("input[name=task_date]")
const taskStartTimeField = taskForm.querySelector("input[name=task_start_time]")
const taskEndTimeField = taskForm.querySelector("input[name=task_end_time]")
const taskTitleField = taskForm.querySelector("input[name=task_title]")
const taskDescriptionField = taskForm.querySelector("textarea[name=task_description]")



// ----------- Form Methods -----------
function readTaskForm() {
    // Generates a task item from task form.
    const taskItem = {
        id: taskIdField.value,
        day: taskDayField.value,
        hour: taskHourField.value,
        date: taskDateField.value,
        title: taskTitleField.value,
        endTime: taskEndTimeField.value,
        completed: taskCompletedField.checked,
        startTime: taskStartTimeField.value,
        description: taskDescriptionField.value,
        duration: ""
    }

    // Computed Fields.
    taskItem.duration = taskItem.endTime !== "" && taskItem.startTime !== "" ?
        DateMethods.timeDiff(taskItem.endTime, taskItem.startTime) : 1;

    taskItem.day = taskItem.date ?
        DateMethods.getWeekDay(taskItem.date) : taskItem.day

    // use start of the hour eg. 10:31AM --> 10:00AM
    taskItem.hour = taskItem.startTime ?
        DateMethods.hourStart(taskItem.startTime) : taskItem.hour

    return taskItem;
}

function hideTaskForm() {
    // Clears fields and changes display to none.
    taskIdField.value = "";
    taskHourField.value = "";
    taskDayField.value = "";
    taskCompletedField.checked = false;
    taskDateField.value = "";
    taskStartTimeField.value = "";
    taskEndTimeField.value = "";
    taskTitleField.value = "";
    taskDescriptionField.value = "";

    taskForm.style["display"] = "none";

    // Unselect the cell
    document.querySelector(".selected-hour")?.classList.remove("selected-hour");
    taskFormIsOpen = false;
}


function showTaskForm(task, pos) {
    // Populate fields and change display attribute.
        
    if (!task.id) {
        // New task item --> populate fields from clicked hour cell.
        taskDayField.value = task["day"];
        taskHourField.value = task["hour"];
        taskStartTimeField.value = DateMethods.to24Hrs(task["hour"]);
        taskDateField.value = DateMethods.formatDate(task["date"]);
    } else {
        // Upate task item --> Populate from existing task item.
        taskIdField.value = task["id"];
        taskDateField.value = task["date"];
        taskTitleField.value = task["title"];
        taskDayField.value = task["day"];
        taskHourField.value = task["hour"];
        taskEndTimeField.value = task["endTime"];
        taskCompletedField.value = task["completed"];
        taskStartTimeField.value = task["startTime"];
        taskDescriptionField.value = task["description"];
    }

    // Position task in the clicked cell.
    taskForm.style["display"] = "block";
    const y = pos.y  + window.scrollY - (pos.y/ window.innerHeight)* 0.95 *taskForm.getBoundingClientRect().height;    
    taskForm.style["position"] = "absolute";
    taskForm.style["left"] = pos.x + "px";
    taskForm.style["top"] = y + "px";

    taskFormIsOpen = true;
}