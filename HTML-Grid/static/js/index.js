// ------------ APP Globals ------------
const cellHeight = 3.65; // heigh of a day cell.
let selectedDate = new Date();
const yearUI = new YearUI()
const tasks = [];

// ------------ Elements Selection ------------
const baseDate = document.querySelector("#base-date")
baseDate.value = DateMethods.formatDate(selectedDate)



// -------- Change handlers --------
// function handleBaseDateChange(event) {
//     selectedDate = new Date(baseDate.value)
//     const hourElements = document.querySelectorAll('[data-role="hour-cell"]')
//     weekRange = DateMethods.getWeekRange(selectedDate)
//     hourElements.forEach(element => {
//         const index = element.dataset["day"]
//         element.dataset['date'] = DateMethods.formatDate(weekRange[index])
//     })
// }


yearUI.show()
document.querySelector("input[id=base-year]")
.addEventListener("change", (event)=>{
    const baseYear = Number(event.target.value)
    DateMethods.months.february = 28 + (baseYear % 4 === 0)
    yearUI.render()
})