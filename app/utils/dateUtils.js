
function formatDateAndTimeForDisplay(date) {

    let inputDate = new Date(date);
    let displayDay = inputDate.getDate();
    let displayMonth = getMonthForDisplay(inputDate.getMonth());
    let displayNumericMonth = getNumericMonth(inputDate.getMonth());
    let displayYear = inputDate.getFullYear();
    let displayHours = inputDate.getHours();
    let mins = inputDate.getMinutes();
    let displayMins;
    if (mins < 10) {
        displayMins = "0" + mins;
    } else {
        displayMins = mins;
    }
    let dateAndTimeForDisplay = {
        "day"  : displayDay,
        "month": displayMonth,
        "numericMonth" : displayNumericMonth,
        "year" : displayYear,
        "hours": displayHours,
        "mins" : displayMins
    };

    return dateAndTimeForDisplay;
}

function formatDateForDisplay(date) {

    let inputDate = new Date(date)
    let displayDay = inputDate.getDate();
    let displayMonth = getMonthForDisplay(inputDate.getMonth());
    let displayNumericMonth = getNumericMonth(inputDate.getMonth());
    let displayYear = inputDate.getFullYear();
    let dateForDisplay = {
        "day"  : displayDay,
        "month": displayMonth,
        "numericMonth" : displayNumericMonth,
        "year" : displayYear,
    };

    return dateForDisplay;

}

function getNumericMonth(monthIn) {
    let monthOut = new Array()
    monthOut[0] = '01';
    monthOut[1] = '02';
    monthOut[2] = '03';
    monthOut[3] = '04';
    monthOut[4] = '05';
    monthOut[5] = '06';
    monthOut[6] = '07';
    monthOut[7] = '08';
    monthOut[8] = '09';
    monthOut[9] = '10';
    monthOut[10] = '11';
    monthOut[11] = '12';

    return monthOut[monthIn];

}

function getMonthForDisplay(monthIn) {
    var monthOut = new Array()
    monthOut[0] = 'January';
    monthOut[1] = 'February';
    monthOut[2] = 'March';
    monthOut[3] = 'April';
    monthOut[4] = 'May';
    monthOut[5] = 'June';
    monthOut[6] = 'July';
    monthOut[7] = 'August';
    monthOut[8] = 'September';
    monthOut[9] = 'October';
    monthOut[10] = 'November';
    monthOut[11] = 'December';

    return monthOut[monthIn];

}

function calcTimeLeftToTarget(date) {
// Set the date we're counting down to
    let targetDateTime = new Date(date).getTime();
// Get todays date and time
    let now = new Date().getTime();
// Find the difference between now and the target date
    let difference = targetDateTime - now;
// Time calculations for hours and minutes
    let days = Math.floor(difference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
// Find the difference between the target date and now
    let overdue = now - targetDateTime;
// Time overdue calculations for days, hours and minutes
    let overdueDays = Math.floor(overdue / (1000 * 60 * 60 * 24));
    let overdueHours = Math.floor((overdue % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let overdueMinutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60));

    let timeOverdue;
    let timeToTarget;
    let expiredOrNot = 0;
    let calcResult;

    if (difference < 0) {
        expiredOrNot = 1;
        timeOverdue = (overdueDays + " days " + overdueHours + " hrs " + overdueMinutes + " mins");
    } else {
        timeToTarget = (hours + " hrs " + minutes + " mins");
    }

    calcResult = { "expiredOrNot" : expiredOrNot, "timeToTarget" : timeToTarget, "timeOverdue" : timeOverdue };
    return calcResult;
}

module.exports.formatDateAndTimeForDisplay = formatDateAndTimeForDisplay;
module.exports.formatDateForDisplay = formatDateForDisplay;
module.exports.getNumericMonth = getNumericMonth;
module.exports.getMonthForDisplay = getMonthForDisplay;
module.exports.calcTimeLeftToTarget = calcTimeLeftToTarget;
