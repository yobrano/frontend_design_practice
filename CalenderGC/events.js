const events = [
    {
        id: crypto.randomUUID(),
        date: new Date("2024-03-10"),
        eventName: "Holiday",
        className: "my-class",
        state: "in-progress",
        onclick(e, data) {
            console.log(data);
            openModal(data);
        },
        dateColor: "#008080",
    },
    {
        id: crypto.randomUUID(),
        date: new Date("2024-03-07"),
        eventName: "Holiday with wife",
        className: "my-class",
        state: "done",
        onclick(e, data) {
            console.log(data);
            openModal(data);
        },
        dateColor: "#32CD32",
    },
];
const calendar = $("#calendar").calendarGC({ events });

var eventOnFocus = null;

const openModal = (data) => {

    $("#modal").slideDown(450, () => {
        $(".event-title")[0].value = data["eventName"];
        $("#event-date")[0].value = DateMethods.formatDate(data["date"]);
        $("#event-state")[0].value = data["state"];
        $("#event-color")[0].value = data["dateColor"];
        $("#event-id")[0].value = data["id"];

        $("#modal").css("display", "flex");
        $(".event-display").css("border-left", `5px solid ${data["dateColor"]}`);
        $(".event-display").css("border-right", `5px solid ${data["dateColor"]}`);
        $(".event-display").slideDown();
    });

    eventOnFocus = events.findIndex((event) => event.id === data["id"]);

};

const closeModal = (event) => {


    // Data clean up
    $(".event-display").slideUp(450, () => {
        $(".event-title")[0].value = "";
        $("#event-date")[0].value = "";
        $("#event-id")[0].value = "";
        $("#event-state")[0].value = "pending";
        eventOnFocus = null;
    });

    // Styles and effects.
    $("#calendar").hide()
    $("#modal").slideUp(50);
    $(".event-display").css("border", `5px solid white`);
    calendar.render();
    calendar.prevMonth();
    $("#calendar").show()

};

const handleTitleChange = (event) => {
    events[eventOnFocus].eventName = event.target.value;
};

const handleDateChange = (event) => {
    events[eventOnFocus].date = new Date(event.target.value);
};

const handleStateChange = (event) => {
    events[eventOnFocus].state = event.target.value;
};

const handleColorChange = (event) => {
    events[eventOnFocus].dateColor = event.target.value;

    $(".event-display").css("border-left", `5px solid ${event.target.value}`);
    $(".event-display").css("border-right", `5px solid ${event.target.value}`);
};
$("#event-title").on("change", handleTitleChange);
$("#event-date").on("change", handleDateChange);
$("#event-state").on("change", handleStateChange);
$("#event-color").on("change", handleColorChange);
