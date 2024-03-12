class WeekUI {
    static rootElement = document.querySelector("section[id=week-view]");

    constructor() {
        this.toMonthBtn = WeekUI.rootElement.querySelector("[id=to-month]")
        this.toYearBtn = WeekUI.rootElement.querySelector("[id=to-year]")
        this.hourLabelsElement = WeekUI.rootElement.querySelector("#hours-labels");
        this.render();
        this.taskForm = new TaskFormUI()

    }

    static handleHourClick(event) {   
        // Open the task form.
        const taskForm = new TaskFormUI()
        taskForm.unmount()

        document.querySelector(".selected-hour")?.classList.remove("selected-hour");
        event.target.classList.add("selected-hour");
        
        let boundingRect = event.target.getBoundingClientRect();
        let clickedHourCell = event.target.dataset;
        if(clickedHourCell.role === "task"){
            clickedHourCell = event.target.parentElement.dataset
            boundingRect = event.target.parentElement.getBoundingClientRect()
            let ClickedTask = getClickedTask(clickedHourCell) 
            taskForm.render(ClickedTask, boundingRect)

        }else{
            taskForm.render(clickedHourCell, boundingRect);
        }

    }

    static handleHourDragOver(event) {
        event.preventDefault();
    }

    static handleHourDrop(event) {
        // Update the task status --> reflect the new cell attribs.
        const id = event.dataTransfer.getData("text");
        const draggableElement = document.getElementById(id);
        const dropzone = event.target;
    
        const taskIndex = tasks.findIndex((task) => task.id === draggableElement.id);
        const taskItem = getTaskByID(id)
        updateTask(draggableElement.id, {
            ...taskItem,
            id: draggableElement.id,
            day: dropzone.dataset["day"],
            hour: dropzone.dataset["hour"],
            date: dropzone.dataset["date"],
            startTime: DateMethods.to24Hrs(dropzone.dataset["hour"]),
        })


        drawNextDay(taskItem);
        dropzone.appendChild(draggableElement);
        event.dataTransfer.clearData();
    }

    static handleToYearClick(event){
        YearUI.show()
    }

    static handleToMonthClick(event){
        // Close the task form and open the month ui.
        document.querySelector(".selected-hour")?.classList.remove("selected-hour");
        hideTaskForm();

        const month= new MonthUI(event.target.value)
        month.render()
        month.show()
    }

    static show(){
        YearUI.rootElement.style["display"] = "none"
        MonthUI.rootElement.style["display"] = "none"
        WeekUI.rootElement.style["display"] = "block"
    }

    render() {
        // Create the week UI --> the hour-label and hour cells. 
        DateMethods.dayHours.map((hour) => {
            // Add the hour text on first column
            const hourIndexElement = document.createElement("div");
            hourIndexElement.classList.add("row");
            hourIndexElement.classList.add("index");
            hourIndexElement.innerText = hour;
            hourIndexElement.dataset["role"] = "hour-label";

            this.hourLabelsElement.appendChild(hourIndexElement);

            // Create cells for the tasks.
            DateMethods.weekDays.map((weekDay) => {
                const dayElement =  WeekUI.rootElement.querySelector(`[id=${weekDay}]`);
                const hourElement = document.createElement("div");

                hourElement.dataset["hour"] = hour;
                hourElement.dataset["day"] = weekDay;
                hourElement.dataset["role"] = "hour-cell";
                hourElement.dataset["date"] = DateMethods.formatDate(weekRange[weekDay]);
                
                hourElement.classList.add("row");

                hourElement.addEventListener("click", WeekUI.handleHourClick);
                hourElement.addEventListener("dragover", WeekUI.handleHourDragOver);
                hourElement.addEventListener("drop", WeekUI.handleHourDrop);

                hourElement.id = `${weekDay}-${hour}`;
                if (hour === "12:00AM") {
                    hourElement.innerText = ".";
                }
                dayElement.appendChild(hourElement);
            });
        });

        // Bind event listeners to navigation buttons
        this.toMonthBtn.addEventListener("click", WeekUI.handleToMonthClick)
        this.toYearBtn.addEventListener("click", WeekUI.handleToYearClick)

        let date = WeekUI.rootElement.querySelector("[data-day=Monday]").dataset.date
        this.toMonthBtn.value = DateMethods.getMonthName(date)

    }

    show() {
        WeekUI.show()
    }

    hide() {
        WeekUI.rootElement.style["display"] = "none";
    }
}
