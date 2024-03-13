class YearUI{
  
    year = Number(YearUI.baseYearInput.value);

    static rootElement = document.querySelector("section[id=year-view]");
    static baseYearInput = document.querySelector("input[name=base_year]")
  

    constructor(){
        const baseYear = Number(YearUI.baseYearInput.value)
        DateMethods.months["february"] = 28 + (baseYear%4 === 0)
        this.render()
    }

    static handleClickDay(event){
        event.preventDefault()
        baseDate.value = event.target.dataset["date"];

        YearUI.rootElement.style["display"] = "none"
        MonthUI.rootElement.style["display"] = "none"
        const week = new WeekUI()
        week.render()
        week.show()
    }

    static handleMonthTitleClick(event){
        let clickedMonth = event.target.parentElement.id
        const month = new MonthUI(clickedMonth)
        month.show()
        YearUI.rootElement.style["display"]="none"
    }

    static show(){
        YearUI.rootElement.style["display"] = "flex"
        MonthUI.rootElement.style["display"] = "none"
        WeekUI.rootElement.style["display"] = "none"
    }

    genMonth(monthName, noMonthDays, monthIndex, year) {
        // use the month template to generate a month elements.
        
        const monthElement = document
            .getElementById("month-template")
            .cloneNode(true);
        
        const monthTitle = monthElement.querySelector(".month-title");

        monthTitle.innerText = monthName;
        monthTitle.addEventListener("click", YearUI.handleMonthTitleClick)
        
        const daysElement = monthElement.querySelector("#month-days");  
        
        // populate month
        const monthWeeks = this.genMonthWeeks(noMonthDays, monthIndex, year);
        monthWeeks.map((week, index) => {
            const weekElement = document.createElement("tr");
            weekElement.id = `month-${monthIndex}-week-${index}`;
            week.map((day) => {
                weekElement.appendChild(day.element);
            });
            daysElement.appendChild(weekElement);
        });

        return monthElement;
    }

    genMonthWeeks(noDays, monthNum, year) {
        // Arrange the week days in a tabular format.

        const startingDay = new Date(`${year}-${monthNum}-1`);
        let offestDays = startingDay.getDay();

        if(offestDays === 0){
            offestDays = 7
        }

        const weeks = []; // Days organized into weeks
        let tempWeek = [];

        let day;
        for (day = 1; day <= noDays; day++) {
            const date = new Date(`${year}-${monthNum}-${day}`);
            const dayElement = document.createElement("td");
            dayElement.addEventListener("click", YearUI.handleClickDay)
            dayElement.dataset["date"] = DateMethods.formatDate(date);
            dayElement.classList.add("day");
            dayElement.innerText = day;

            tempWeek.push({
                date,
                element: dayElement,
            });

            // If end of week -> close week
            if ((day + offestDays) % 7 === 1) {
                weeks.push(tempWeek);
                tempWeek = [];
            }
            // if end of month -> close Week
            else if (day === noDays) {
                weeks.push(tempWeek);
            }
        }

        // offset the first week with empty cells
        let offestItems = [];
        let counter = 0;
        for (counter = 0; counter < offestDays - 1; counter++) {
            const offsetElement = document.createElement("td");
            offsetElement.classList.add("offset");
            offestItems.push({ element: offsetElement });
        }


        offestItems = [...offestItems, ...weeks[0]];
        weeks[0] = offestItems;
        return weeks; // A list of days organized into weeks.
    }

    render(){
        // Clear out the old months - for when the year value changes.
        YearUI.rootElement.querySelectorAll(".month").forEach((month)=>{
            month.remove();
        })
        
        // Create month element then insert into document.
        this.year = Number(YearUI.baseYearInput.value);
        Object.entries(DateMethods.months).map(([monthName, noMonthDays], monthIdx) => {
            const monthElement = this.genMonth(monthName, noMonthDays, monthIdx + 1, this.year);
            monthElement.id = monthName
            monthElement.classList.add("month")
            YearUI.rootElement.appendChild(monthElement);
        });
    }

    hide(){
        YearUI.rootElement.style["display"]="none"
    }

    show(){
        YearUI.rootElement.style["display"] = "flex"
    }

    
    
};



