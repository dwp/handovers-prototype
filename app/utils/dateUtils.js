
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

function calcTimeLeftOrTimeOverdue(targetDateTime, callback) {

    let callbackReqd = 0;
    let now = new Date();                                                           //  Find date and time now
    let target = new Date(targetDateTime);                                          //  Assign dateTime input object to new local date object
    let difference = target - now;                                                  //  Find difference between the target and now
    let targetPlusOneHour = new Date(targetDateTime);                               //  Assign dateTime input object to another new local date object
    targetPlusOneHour.setHours(targetPlusOneHour.getHours() + 1);                   //  Set to target time plus one hour
    let differencePlusOneHour = targetPlusOneHour - now;                            //  Find difference between target time plus one hour, and now
    let withinOriginalTargetTime = 0;
    let withinAdditionalHour = 0;
    let expired = 0;
    let timeOverdue;
    let timeRemaining;
    let calcResult;

    // Time calculations for the difference in hours and minutes between target time and now
    let days = Math.floor(difference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    let hoursPlusOne = Math.floor((differencePlusOneHour % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutesPlusOne = Math.floor((differencePlusOneHour % (1000 * 60 * 60)) / (1000 * 60));
    if (callback === "Yes") {
        callbackReqd = 1;
    }

    if ( difference > 0) {                                                          //  If difference is positive, we are still within the original target time
        withinOriginalTargetTime = 1;
    } else {
        if ( differencePlusOneHour > 0 ) {                                          //  If callback is reqd, and difference to target time plus one hour is positive, we are still within the callback escalation additional time
            withinAdditionalHour = 1;
        }
    }

    if (withinOriginalTargetTime == 1) {
        timeRemaining = (hours + " hrs " + minutes + " minutes");
    } else {
        if (withinAdditionalHour == 1 && callbackReqd == 1) {
            timeRemaining = (hoursPlusOne + " hrs " + minutesPlusOne + " mins");
        } else {
            expired = 1;
        }
    }

    if ( expired == 1) {
        timeOverdue = ((Math.abs(days) - 1) + " days " + (Math.abs(hours) -1) + " hrs " + Math.abs(minutes) + " mins");
    }

    calcResult =  { "expired" : expired,
                    "withinOriginalTargetTime" : withinOriginalTargetTime,
                    "withinAdditionalHour" : withinAdditionalHour,
                    "timeRemaining" : timeRemaining,
                    "timeOverdue" : timeOverdue
                    };

    return calcResult;

}

module.exports.formatDateAndTimeForDisplay = formatDateAndTimeForDisplay;
module.exports.formatDateForDisplay = formatDateForDisplay;
module.exports.getNumericMonth = getNumericMonth;
module.exports.getMonthForDisplay = getMonthForDisplay;
module.exports.calcTimeLeftOrTimeOverdue = calcTimeLeftOrTimeOverdue;
