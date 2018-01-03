const _ = require('lodash');
const handoverUtils = require('../utils/handoverUtils');
const queueUtils = require('../utils/skillsetUtils');
const sIDU = require('../utils/setInitialDataUtils');
const dateUtils = require('../utils/dateUtils');
const commonUtils = require('../utils/commonUtils');
const userUtils = require('../utils/userUtils');

function viewQueuePage(req, res) {

    let users = sIDU.setInitialUsersData();
    let handovers = req.session.handovers ? req.session.handovers : sIDU.setInitialHandoversData();
    let handoversLength = handovers.length;
    let queueType = req.query.agentId ? 'agent' : 'office';
    let queueAgent = '';
    if (queueType === 'agent') {
        queueAgent = userUtils.getUserByStaffIdFromListOfUsers(users, (req.query.agentId ? req.query.agentId : '40001003'));
    }
    let handoversQueueList = [];
    let sortedHandoversQueueList;
    for (let i=0; i < handoversLength; i++) {
        let handover = handoverUtils.getHandoverByIdFromListOfHandovers(handovers, handovers[i].id);
        let textDetails = handoverUtils.getHandoverDetails(handover);
        let dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised);
        let targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.targetDateAndTimeForDisplay);
        handover.benefitName = textDetails.benefitName;
        handover.handoverType = textDetails.handoverType;
        handover.handoverReason = textDetails.handoverReason;
        handover.dateRaised = (dateAndTimeRaisedForDisplay.day + " " + dateAndTimeRaisedForDisplay.month + " " + dateAndTimeRaisedForDisplay.year);
        handover.timeRaised = (dateAndTimeRaisedForDisplay.hours + ":" + dateAndTimeRaisedForDisplay.mins);
        handover.targetDate = (targetDateAndTimeForDisplay.day + " " + targetDateAndTimeForDisplay.month + " " + targetDateAndTimeForDisplay.year);
        handover.targetTime = (targetDateAndTimeForDisplay.hours + ":" + targetDateAndTimeForDisplay.mins);
        if (queueType === 'agent') {
            if (handover.inQueueOfStaffId === queueAgent.staffId) {
                handoversQueueList.push(handover);
            }
        } else {
            handoversQueueList.push(handover);
        }
    }
    sortedHandoversQueueList = _.sortBy(handoversQueueList, ['dateAndTimeRaised']);
    res.render('queue', {
        handoversQueueList : sortedHandoversQueueList,
        queueType : queueType,
        queueAgent : queueAgent
    });
}

function getNextQueueItem(req, res) {

    let handovers = req.session.handovers ? req.session.handovers : sIDU.setInitialHandoversData();
    let sortedHandovers = _.sortBy(handovers, ['dateAndTimeRaised']);
    let sortedHandoversLength = sortedHandovers.length;
    let gotFirstUnallocatedItem = 0;
    let newHandoversQueueList = [];
    for (let i=0; i < sortedHandoversLength; i++) {
        if (gotFirstUnallocatedItem === 0) {
            if (sortedHandovers[i].status === "Not allocated") {
                sortedHandovers[i].inQueueOfStaffId = "40001004";
                sortedHandovers[i].status = "In progress";
                gotFirstUnallocatedItem = 1;
            }
        }
        newHandoversQueueList.push(sortedHandovers[i]);
    }
    req.session.handovers = newHandoversQueueList;
    res.redirect('/queue/view?agentId=40001004');

}
module.exports.viewQueuePage = viewQueuePage;
module.exports.getNextQueueItem = getNextQueueItem;