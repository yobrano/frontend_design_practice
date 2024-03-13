class WeekUI {
    static rootElement = document.querySelector("section[id=week-view]");
    static baseDateInput = document.querySelector("[name=base_date]");

    constructor() {
        this.toMonthBtn = WeekUI.rootElement.querySelector("[id=to-month]")
        this.toYearBtn = WeekUI.rootElement.querySelector("[id=to-year]")
        this.hourLabelsElement = WeekUI.rootElement.querySelector("#hours-labels");
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


        TaskUI.drawNextDay(taskItem);
        dropzone.appendChild(draggableElement);
        event.dataTransfer.clearData();
    }

    static handleToYearClick(event){
        document.querySelector(".selected-hour")?.classList.remove("selected-hour");
        new WeekUI().unmount()
        new TaskFormUI().unmount()
        YearUI.show()
    }



    static handleToMonthClick(event){
        // Close the task form and open the month ui.
        document.querySelector(".selected-hour")?.classList.remove("selected-hour");
        const taskform = new TaskFormUI()
        taskform.unmount()
        WeekUI.unmount()
        
        const month= new MonthUI(event.target.value)
        month.render()
        month.show()
    }




    static show(){
        YearUI.rootElement.style["display"] = "none"
        MonthUI.rootElement.style["display"] = "none"
        WeekUI.rootElement.style["display"] = "block"
    }

    static unmount(){
        // Remove the cells and hide the whole week ui.
        WeekUI.rootElement.querySelectorAll("[data-role=hour-label]")
        .forEach(element => {
            element.remove()
        });
        
        WeekUI.rootElement.querySelectorAll("[data-role=hour-cell]")
        .forEach(element => {
            element.remove()
        });

        WeekUI.rootElement.style["display"] = "none"
    }

    render() {
        

        // Remove any previous render results.
        this.unmount()
        this.selectedDate = new Date(WeekUI.baseDateInput.value);
        this.weekRange = DateMethods.getWeekRange(this.selectedDate);

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

                hourElement.dataset["date"] = DateMethods.formatDate(this.weekRange[weekDay]);
                
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
        // Display Cells and tasks
        this.show()
        
        const weekDates = Object.values(this.weekRange)
        weekDates.forEach(date=>{
            date = DateMethods.formatDate(date)
            tasks.forEach(task=>(task.date === date) && new TaskUI(task).render())
        })

        // Bind event listeners to navigation buttons
        this.toMonthBtn.addEventListener("click", WeekUI.handleToMonthClick)
        this.toYearBtn.addEventListener("click", WeekUI.handleToYearClick)

        let date = WeekUI.rootElement.querySelector("[data-day=Monday]").dataset.date
        this.toMonthBtn.value = DateMethods.getMonthName(date)

    }


    show() {
        WeekUI.show()
    }

    unmount() {
        WeekUI.unmount()
    }
}
