
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

function calcTimeLeftOrTimeOverdue(dateTime) {
// Set the date we're counting down to
    let target = new Date(dateTime);
// Get todays date and time
    let now = new Date();
// Find the difference between now and the target date
    let difference = target - now;
// Time calculations for hours and minutes
    let days = Math.floor(difference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
// Change difference to absolute value so not displaying negative numbers
    let absDays = Math.abs(days);
    let absHours = Math.abs(hours);
    let absMinutes = Math.abs(minutes);

    let timeToTarget;
    let timeOverdue;
    let overdueBetweenThreeAndFourHoursCountdown = 0;
    let expiredOrNot = 0;
    let calcResult;

    if (difference > 0) {                                           // target time not yet reached
        timeToTarget = (hours + " hrs " + minutes + " mins");
    } else {                                                        // target time has passed  (overdue)
        if (days > 0) {                                          // overdue by more than a day, so always show as expired
            timeOverdue = (absDays + " days " + absHours + " hrs " + absMinutes + " mins");
        } else {                                                    // overdue by less than a day
            if (absHours >= 4) {                                       // overdue by less than a day and by more than 4 hours, so show as expired
                timeOverdue = (absHours + " hrs " + absMinutes + " mins");
            } else {                                                // overdue by less than a day and by less than 4 hours
                if (absHours >= 3) {                                   // overdue by less than a day and by less than 4 hours, but by more than or equal to 3 hours
                    overdueBetweenThreeAndFourHoursCountdown = (60 - absMinutes); //  calculate how many minutes left of the fourth hour
                    timeOverdue = (absDays + " days " + absHours + " hrs " + absMinutes + " mins");
                }
            }
        }
        expiredOrNot = 1;
    }

    calcResult = {  "expiredOrNot" : expiredOrNot,
                    "timeToTarget" : timeToTarget,
                    "timeOverdue" : timeOverdue,
                    "overdueBetweenThreeAndFourHoursCountdown" : overdueBetweenThreeAndFourHoursCountdown
                };
    return calcResult;
}

module.exports.formatDateAndTimeForDisplay = formatDateAndTimeForDisplay;
module.exports.formatDateForDisplay = formatDateForDisplay;
module.exports.getNumericMonth = getNumericMonth;
module.exports.getMonthForDisplay = getMonthForDisplay;
module.exports.calcTimeLeftOrTimeOverdue = calcTimeLeftOrTimeOverdue;
