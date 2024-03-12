// ------------ Elements Selection ------------
const toCalendarButton = document.getElementById("to-calendar")
const baseDate = document.querySelector("#base-date")

// ------------ APP Globals ------------
const cellHeight = 3.65; // heigh of a day cell.
let selectedDate = new Date();
let weekRange = DateMethods.getWeekRange(selectedDate);
const yearUI = new YearUI()
const tasks = [];



// -------- Change handlers.
function handleBaseDateChange(event) {
    selectedDate = new Date(baseDate.value)
    const hourElements = document.querySelectorAll('[data-role="hour-cell"]')
    weekRange = DateMethods.getWeekRange(selectedDate)
    hourElements.forEach(element => {
        const index = element.dataset["day"]
        element.dataset['date'] = DateMethods.formatDate(weekRange[index])
    })
}

baseDate.addEventListener("change", handleBaseDateChange)



yearUI.show()
document.querySelector("input[id=base-year]")
.addEventListener("change", (event)=>{
    yearUI.render()
})