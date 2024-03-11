const year = 2024
const months = {
    january: 31,
    february:  (year % 4 === 0)?29:28,
    march: 31,
    april: 30,
    may: 31,
    june: 30,
    july: 31,
    august: 31,
    september: 30,
    october: 31,
    november: 30,
    december: 31,
};

Object.entries(months).map(([monthName, noMonthDays], monthIdx) => {
    // Create month element then insert into document.

    const monthElement = genMonth(monthName, noMonthDays, monthIdx + 1);
    monthElement.id = monthName
    monthElement.classList.add("month")
    document.querySelector("section").appendChild(monthElement);
});

function genMonth(monthName, noMonthDays, monthIndex) {
    // use the month template to generate a month elements.

    const monthElement = document
        .getElementById("month-template")
        .cloneNode(true);
    monthElement.querySelector(".month-title").innerText = monthName;

    const daysElement = monthElement.querySelector("#month-days");  
    // daysElement.innerHTML = ""
    
    const monthWeeks = genMonthWeeks(noMonthDays, monthIndex);
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



function handleClickDay(event){
    event.preventDefault()
    baseDate.value = event.target.dataset["date"];

    document.querySelector("section[id=calendar]").style["display"] = "none"
    document.querySelector("section[id=tasks]").style["display"] = "block"
    changeBaseDate()
    openTasks()
    
}

function genMonthWeeks(noDays, monthNum) {
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
        dayElement.addEventListener("click", handleClickDay)
        dayElement.dataset["date"] = DateMethods.formatDate(date);
        dayElement.id = day;
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
