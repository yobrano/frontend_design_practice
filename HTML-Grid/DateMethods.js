/*
Order in html
    * DateMethods.js
    * TaskFormControl.js
    * TaskRender.js
    * Tasks.js
    * index.js
    * calendar/calendar.js
*/ 

class DateMethods{
    static weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    
    static dayHours = [
        "1:00AM",
        "2:00AM",
        "3:00AM",
        "4:00AM",
        "5:00AM",
        "6:00AM",
        "7:00AM",
        "8:00AM",
        "9:00AM",
        "10:00AM",
        "11:00AM",
        "12:00PM",
        "1:00PM",
        "2:00PM",
        "3:00PM",
        "4:00PM",
        "5:00PM",
        "6:00PM",
        "7:00PM",
        "8:00PM",
        "9:00PM",
        "10:00PM",
        "11:00PM",
        "12:00AM",
    ];

    static getWeekDay(date){
        let temp = new Date(date);
        return DateMethods.weekDays[temp.getDay()];
    }

    static hourStart(time){
        time = DateMethods.to12Hrs(time);
        let startHour = time.split(":")[0];
        let AM_PM = time.slice(-2);
        let hour = `${startHour}:00${AM_PM}`;
        return hour
    }

    static formatDate(date) {
        date = new Date(date);
        // return Intl.DateTimeFormat("en-GB").format(date)
        let monthDay = String(date.getDate());
        let month = String(date.getMonth() + 1);
        let year = String(date.getYear() - 100 + 2000);
    
        monthDay = monthDay.length === 1 ? `0${monthDay}` : monthDay;
        month = month.length === 1 ? `0${month}` : month;
        return `${year}-${month}-${monthDay}`;
    }
    
    static offsetDate(date, offset) {
        // Convert to unix time (no. of milliseconds since 01/01/1970)
        const unixDate = date.valueOf();
        let hours = offset * 24;
        let minutes = hours * 60;
        let seconds = minutes * 60;
        let milliSeconds = seconds * 1000;
    
        // offset the current date using the milliseconds then generate a new date.
        const newUnixDate = unixDate + milliSeconds;
    
        return new Date(newUnixDate);
    }
    
    static getWeekRange(startDate) {
        let date = new Date(startDate);
        let day = date.getDay();
        let weekDates = {};
        for (let dayOffset = 0; dayOffset <= 6; dayOffset++) {
            let wkDay = DateMethods.offsetDate(date, dayOffset - day);
            let index = DateMethods.weekDays[wkDay.getDay()];
            weekDates[index] = wkDay;
        }
    
        return weekDates;
    }
    
    static timeDiff(t2, t1) {
        // t2 --> end time (24 hr format),
        // t1 --> Start time (24 hr format),
        // Return --> t2 - t1 (in hours)
    
        const time1 = new Date();
        const [t1Hours, t1Minutes] = t1.split(":");
        time1.setHours(t1Hours);
        time1.setMinutes(t1Minutes);
    
        const time2 = new Date();
        const [t2Hours, t2Minutes] = t2.split(":");
        time2.setHours(t2Hours);
        time2.setMinutes(t2Minutes);
    
        let minDiff = (time2 - time1) / 1000 / 60;
        let hrsDiff = minDiff / 60;
        return hrsDiff;
    }
    
    static to24Hrs(time) {
        let AM_PM = time.slice(-2);
        let [hours, minutes] = time.slice(0, -2).split(":");
        if (hours < 12 && AM_PM === "PM") {
            hours = Number(hours) + 12;
        } else if (hours === "12" && AM_PM === "AM") {
            hours = "00";
        }
    
        hours = String(hours);
        minutes = String(minutes);
    
        hours = hours.length === 1 ? `0${hours}` : hours;
        minutes = minutes.length === 1 ? `0${minutes}` : minutes;
    
        return `${hours}:${minutes}`;
    }
    
    static to12Hrs(time) {
        if (!time) return "";
    
        let [hours, minutes] = time.split(":");
        hours = Number(hours);
        minutes = Number(minutes);
    
        if (hours < 12) {
            hours = hours === 0 ? "12" : hours;
            return `${hours}:${minutes}AM`;
        } else if (hours === 12) {
            return `${hours}:${minutes}PM`;
        } else {
            return `${hours - 12}:${minutes}PM`;
        }
    }
}



