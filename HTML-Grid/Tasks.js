/*
Order in html
    * DateMethods.js
    * TaskFormControl.js
    * TaskRender.js
    * Tasks.js
    * index.js
    * calendar/calendar.js
*/ 

const tasks = [];


// Task CRUD functions
function getClickedTask({ day, hour, date }) {
    const task = tasks.filter((task) => {
        return task.hour === hour && task.day === day && task.date === date;
    })[0];
    return task;
}

function getTaskByID(taskID) {
    return tasks.filter((task) => task.id === taskID)[0];
}

function updateOrCreateTask(taskID) {
    const taskItem = readTaskForm()

    // Create if id is null or ""
    if (taskItem.id) {
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

