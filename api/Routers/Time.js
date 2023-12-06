const TimeFunc = () => {

    const newDate = new Date()
    const date = newDate.getDate()
    let month = newDate.getMonth() + 1
    const year = newDate.getFullYear()
    let day = newDate.getDay()
    let hours = newDate.getHours()
    const minutes = newDate.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;


    switch (day) {
        case 1:
            day = "Monday"
            break;
        case 2:
            day = "Tuesday"
            break;
        case 3:
            day = "Wednesday"
            break;
        case 4:
            day = "Thursday"
            break;
        case 5:
            day = "Friday"
            break;
        case 6:
            day = "Saturday"
            break;
        case 7:
            day = "Sunday"
            break;

        default:
            break;
    }
    switch (month) {
        case 1:
            month = "Jan"
            break;
        case 2:
            month = "Feb"
            break;
        case 3:
            month = "Mar"
            break;
        case 4:
            month = "Apr"
            break;
        case 5:
            month = "May"
            break;
        case 6:
            month = "June"
            break;
        case 7:
            month = "July"
            break;
        case 8:
            month = "Aug"
            break;
        case 9:
            month = "Sept"
            break;
        case 10:
            month = "Oct"
            break;
        case 11:
            month = "Nov"
            break;
        case 12:
            month = "Dec"
            break;
        case 7:
            month = "July"
            break;

        default:
            break;
    }

    return {date, month, year, day, hours, minutes, ampm }
}

module.exports = TimeFunc
