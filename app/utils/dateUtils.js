
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
// Find the distance between now and the target date
    let distance = targetDateTime - now;
// Time calculations for hours and minutes
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    let timeToTarget;

    // If the target time has already passed, write some text, otherwise write the time left
    if (distance < 0) {
        timeToTarget = "Expired";
    } else {
        timeToTarget = (hours + " hrs " + minutes + " mins");
    }

    return timeToTarget;
}

module.exports.formatDateAndTimeForDisplay = formatDateAndTimeForDisplay;
module.exports.formatDateForDisplay = formatDateForDisplay;
module.exports.getNumericMonth = getNumericMonth;
module.exports.getMonthForDisplay = getMonthForDisplay;
module.exports.calcTimeLeftToTarget = calcTimeLeftToTarget;
