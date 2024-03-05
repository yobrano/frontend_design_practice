const year = 2024
const months = {
    january:31, february:28, march:31,  
    april:30,   may:31,     june:30,     
    july:31,    august:31,  september:30,
    october:31, november:30,december:31
}
const weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",];


Object.entries(months).map(([month, noMonthDays], monthIdx)=>{
    // Create month element. 
    const monthElement = genMonth(month, noMonthDays, monthIdx + 1)
    // insert into document.
    // 
})



function genMonth(monthName, noMonthDays, monthIndex){
    const monthElement = document.getElementById("month-template").cloneNode(true)
    monthElement.style["display"] = "block"
    monthElement.querySelector(".month-title").innerText = monthName
    const daysElement = document.getElementById("month-days")
    
    const startingDay = new Date(`${year}-${monthIndex}-1`)
    const offestDays = startingDay.getDay() + 1

    console.log(monthElement)
    return monthElement
}



const monthTemplate = document.getElementById("month-template").cloneNode(true)
const week = monthTemplate.querySelector("week")
const monthDay = document.getElementById("month-days")

monthTemplate.style["display"] = "block"

const monthName = "February"
const monthNum = 2
const noDays = 31
const startingDay = new Date(`${year}-${monthNum}-1`)
const offestDays = startingDay.getDay() + 1


let day = 0
const days= []
let temp = []
for(day= 1; day<= noDays; day++){
    const date = new Date(`${year}-${monthNum}-${day+1}`)
    const weekDay = weekDays[date.getDay()]
    
    const dayElement = document.createElement("td")
    dayElement.dataset["date"] = formatDate(date)
    dayElement.id = day
    dayElement.classList.add("day")
    dayElement.innerText  = day

    const dayObj = {
        date,
        element: dayElement,
    }

    temp.push(dayObj)
    if((day + offestDays) % 7 === 1){
        days.push(temp)
        temp = []
    }
    else if(day=== noDays){
        days.push(temp)
    }
    
}



let offestItems = []
let counter = 0
for(counter = 0; counter < offestDays - 1  ; counter++){
    const offsetElement = document.createElement("td")
    offsetElement.classList.add("offset")
    offestItems.push({element: offsetElement})
}


offestItems = [...offestItems, ...days[0]]  
days[0] = offestItems

const weeks = days.map((week, index)=>{
    const weekElement = document.createElement("tr")
    weekElement.id=`week-${index}`
    const dayz = week.map((day, ) => {
        weekElement.appendChild(day.element)
        
    })  
    monthDay.appendChild(weekElement)
    return weekElement
})



function formatDate(date) {
    date = new Date(date)
    // return Intl.DateTimeFormat("en-GB").format(date)
    let monthDay = String(date.getDate())
    let month = String(date.getMonth() + 1)
    let year = String((date.getYear() - 100) + 2000)

    monthDay = monthDay.length === 1 ? `0${monthDay}` : monthDay
    month = month.length === 1 ? `0${month}` : month
    return `${year}-${month}-${monthDay}`
}



function genDays(noDays, year, monthNum){
    const days= []
    let temp = []
    
    let day 
    for(day= 1; day<= noDays; day++){
        const date = new Date(`${year}-${monthNum}-${day}`)
        
        const dayElement = document.createElement("td")
        dayElement.dataset["date"] = formatDate(date)
        dayElement.id = day
        dayElement.classList.add("day")
        dayElement.innerText  = day
    
        const dayObj = {
            date,
            element: dayElement,
        }
    
        temp.push(dayObj)
        if((day + offestDays) % 7 === 1){
            days.push(temp)
            temp = []
        }
        else if(day=== noDays){
            days.push(temp)
        }
        
    }

    return days
}
