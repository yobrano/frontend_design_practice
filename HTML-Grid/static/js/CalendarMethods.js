class CalendarMethods{
    static year = document.querySelector("input[name=base_year]").value
    static months = {
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

}