class MonthUI{
    static rootElement = document.querySelector("section[id=month-view]")

    constructor(month){
        this.monthElement = document.querySelector(`#${month}`).cloneNode(true);
        this.render();
        this.show()
    } 


    static show(){
        YearUI.rootElement.style["display"] = "none"
        MonthUI.rootElement.style["display"] = "flex"
        WeekUI.rootElement.style["display"] = "none"
    }

    
    render(){
        // Remove previous elements.
        MonthUI.rootElement.childNodes.forEach(element=>{
            element.remove()
        })

        // Add a listener to the day components.
        this.monthElement.classList.replace("month", "month-lg")
        this.monthElement.querySelectorAll(".day").forEach(element => {
            element.addEventListener("click", (event)=> YearUI.handleClickDay(event))
        });

        MonthUI.rootElement.appendChild(this.monthElement)

    }
    
    show(){
        MonthUI.show()
    }
    
    hide(){
        MonthUI.rootElement.style["display"] ="none"
    }
}