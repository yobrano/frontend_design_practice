let taskFormIsOpen = false;

class TaskFormUI{
    static rootElement = document.querySelector("[id=task-form]")

    constructor(){
        this.rootElement = TaskFormUI.rootElement

        // ----------- Elements Selection -----------
        this.taskIdField = this.rootElement.querySelector("input[name=task_id]")
        this.taskHourField = this.rootElement.querySelector("input[name=task_hour]")
        this.taskDayField = this.rootElement.querySelector("input[name=task_day]")
        this.taskCompletedField = this.rootElement.querySelector("input[name=task_completed]")
        this.taskDateField = this.rootElement.querySelector("input[name=task_date]")
        this.taskStartTimeField = this.rootElement.querySelector("input[name=task_start_time]")
        this.taskEndTimeField = this.rootElement.querySelector("input[name=task_end_time]")
        this.taskTitleField = this.rootElement.querySelector("input[name=task_title]")
        this.taskDescriptionField = this.rootElement.querySelector("textarea[name=task_description]")

        this.submitButton = this.rootElement.querySelector(`input[type=submit]`)
        this.deleteButton = this.rootElement.querySelector(`[id="delete-task"]`)
        
        // Event Binding
        this.rootElement.addEventListener("keydown", TaskFormUI.handleEscape)
        this.deleteButton.addEventListener("click", TaskFormUI.handleDelete)
        document.addEventListener("submit", TaskFormUI.handleSubmit)
    }

    static handleSubmit(event){
        event.preventDefault()
        const taskForm = new TaskFormUI()
        let taskItem = taskForm.collectTaskItem()
        taskItem = taskItem.id? updateTask(taskItem.id, taskItem): createTask(taskItem)
        taskForm.unmount()

        const taskItemUI = new TaskUI(taskItem)
        taskItemUI.render()
    }

    static handleDelete(event){
        event.preventDefault()
        const taskForm = new TaskFormUI()
        const taskItem = taskForm.collectTaskItem()
        deleteTask(taskItem.id)
        TaskUI.unmount(taskItem.id)
        
        taskForm.unmount()
    }

    static handleEscape(event){
        if(event.code === "Escape" && taskFormIsOpen){
            const tempForm = new TaskFormUI()
            tempForm.unmount();
        }
    }



    
    render(task, pos) {
        // Populate fields and change display attribute.
        this.populateTaskFom(task)

        // Position task form in the clicked cell.
        this.rootElement.style["display"] = "block";
        const y = pos.y  + window.scrollY - (pos.y/ window.innerHeight)* 0.9 * this.rootElement.getBoundingClientRect().height;    
        this.rootElement.style["position"] = "absolute";
        this.rootElement.style["left"] = pos.x + "px";
        this.rootElement.style["top"] = y + "px";

        taskFormIsOpen = true;
    }


    
    unmount() {
        // Clears fields and changes display to none.
        this.taskIdField.value = "";
        this.taskHourField.value = "";
        this.taskDayField.value = "";
        this.taskCompletedField.checked = false;
        this.taskDateField.value = "";
        this.taskStartTimeField.value = "";
        this.taskEndTimeField.value = "";
        this.taskTitleField.value = "";
        this.taskDescriptionField.value = "";
    
    
        // Unselect the hour cell
        document.querySelector(".selected-hour")?.classList.remove("selected-hour");
        this.rootElement.style["display"] = "none"
        taskFormIsOpen = false;
    }


    collectTaskItem() {
        // Generates a task item from task form.
        const taskItem = {
            id: this.taskIdField.value,
            day: this.taskDayField.value,
            hour: this.taskHourField.value,
            date: this.taskDateField.value,
            title: this.taskTitleField.value,
            endTime: this.taskEndTimeField.value,
            completed: this.taskCompletedField.checked,
            startTime: this.taskStartTimeField.value,
            description: this.taskDescriptionField.value,
            duration: ""
        }

        // duration --> endtime - starttime.
        taskItem.duration = taskItem.endTime !== "" && taskItem.startTime !== "" ?
            DateMethods.timeDiff(taskItem.endTime, taskItem.startTime) : 1;
        
        // 11/03/2024 --> Monday
        taskItem.day = taskItem.date ?
            DateMethods.getWeekDay(taskItem.date) : taskItem.day

        // use start of the hour eg. 10:31AM --> 10:00AM
        taskItem.hour = taskItem.startTime ?
            DateMethods.hourStart(taskItem.startTime) : taskItem.hour

        return taskItem;
    }   


    populateTaskFom(task){
        if (!task.id) {
            // New task item --> populate fields from clicked hour cell.
            this.taskDayField.value = task["day"];
            this.taskHourField.value = task["hour"];
            this.taskStartTimeField.value = DateMethods.to24Hrs(task["hour"]);
            this.taskDateField.value = DateMethods.formatDate(task["date"]);
        } else {
            // Upate task item --> Populate from existing task item.
            this.taskIdField.value = task["id"];
            this.taskDateField.value = task["date"];
            this.taskTitleField.value = task["title"];
            this.taskDayField.value = task["day"];
            this.taskHourField.value = task["hour"];
            this.taskEndTimeField.value = task["endTime"];
            this.taskCompletedField.checked = task["completed"];
            this.taskStartTimeField.value = task["startTime"];
            this.taskDescriptionField.value = task["description"];
        }
    }
    
  
}