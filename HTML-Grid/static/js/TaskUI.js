class TaskUI {
    constructor(task) {
        this.task = task
        this.rootElement = task.id && document.getElementById(task.id)
    }


    static handleTaskDragStart(event) {
        const taskForm = new TaskFormUI()
        taskForm.unmount()
        event.dataTransfer.setData("text/plain", event.target.id);
        const task = getTaskByID(event.target.id);
        
        document.querySelector(`[id="${task.id}"][data-extension=true]`)?.remove();
    }
    
    
    static drawNextDay(task, startHour) {
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
    

    static unmount(taskID) {
        if (taskID) {
            document.getElementById(taskID).remove()
            
        } else {
            document.querySelectorAll("[data-role=task]").forEach(element => element.remove())
        }
    }
    

    render() {
        // Copy attributes onto task template then append to hour cell.
        document.getElementById(this.task.id)?.remove()

        const taskTemplate = document.querySelector("#task-template");
        const taskElem = taskTemplate.cloneNode(true);
        
        const parentElem = document.querySelector(
            `[data-day="${this.task.day}"][data-hour="${this.task.hour}"][data-date="${this.task.date}"]`
        );

        taskElem.id = this.task["id"];
        taskElem.textContent = this.task["title"];
        taskElem.addEventListener("dragstart", TaskUI.handleTaskDragStart);
    
        let height = Math.max(this.task["duration"] * cellHeight, 1);
        if (this.task.isExtension) {
            taskElem.dataset["extension"] = true;
            height = Math.max(this.task["duration"] * cellHeight, 1);
        }
        taskElem.dataset["role"] = "task"
        taskElem.style["height"] = height + "rem";
        parentElem.appendChild(taskElem);

        this.rootElement = taskElem;
    }

}