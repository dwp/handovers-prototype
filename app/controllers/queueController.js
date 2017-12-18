var _ = require('lodash');

const handoverUtils = require('../utils/handoverUtils');
const queueUtils = require('../utils/queueUtils');
const sIDU = require('../utils/setInitialDataUtils');
const dateUtils = require('../utils/dateUtils');
const commonUtils = require('../utils/commonUtils');
const userUtils = require('../utils/userUtils');

function viewQueuePage(req, res) {

    let bensHands = sIDU.setInitialBenefitsAndHandoversData();
    let handovers = req.session.handovers ? req.session.handovers : bensHands.initialHandovers;
    let length = handovers.length;
    let handoversList = [];
    let queueAgent = req.query.agentId ? req.query.agentId : '40001003';
    let queueType = req.query.agentId ? 'agent' : 'office';
    let users = sIDU.setInitialUsersData();
    let queueUser = userUtils.getUserByStaffIdFromListOfUsers(users, queueAgent);
    let sortedHandoversList;

    for (let i=0; i < length; i++) {
        let handover = handoverUtils.getHandoverByIdFromListOfHandovers(handovers, handovers[i].id);
        let textDetails = handoverUtils.getHandoverDetails(handover);
        let benefitName = textDetails.benefitName;
        let handoverType = textDetails.handoverType;
        let handoverReason = textDetails.handoverReason;
        let dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised);
        let targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.targetDateAndTimeForDisplay);
        handover.benefitName = benefitName;
        handover.handoverType = handoverType;
        handover.handoverReason = handoverReason;
        handover.dateRaised = (dateAndTimeRaisedForDisplay.day + " " + dateAndTimeRaisedForDisplay.month + " " + dateAndTimeRaisedForDisplay.year);
        handover.timeRaised = (dateAndTimeRaisedForDisplay.hours + ":" + dateAndTimeRaisedForDisplay.mins);
        handover.targetDate = (targetDateAndTimeForDisplay.day + " " + targetDateAndTimeForDisplay.month + " " + targetDateAndTimeForDisplay.year);
        handover.targetTime = (targetDateAndTimeForDisplay.hours + ":" + targetDateAndTimeForDisplay.mins);

        if (queueType === 'agent') {
            if (handover.inQueueOfStaffId === queueAgent) {
                handoversList.push(handover);
            }
        } else {
            handoversList.push(handover);
        }
    }

    sortedHandoversList = _.sortBy(handoversList, ['dateAndTimeRaised']);

    res.render('queue', {
        handoversList : sortedHandoversList,
        queueType : queueType,
        queueUser : queueUser
    });
}

function getNextQueueItem(req, res) {

    let bensHands = sIDU.setInitialBenefitsAndHandoversData();
    let handovers = req.session.handovers ? req.session.handovers : bensHands.initialHandovers;
    let length = handovers.length;
    let gotFirstUnallocatedItem = 0;
    let newHandoversList = [];

    for (let i=0; i < length; i++) {
        if (gotFirstUnallocatedItem === 0) {
            if (handovers[i].status === "Not allocated") {
                handovers[i].inQueueOfStaffId = "40001004";
                handovers[i].status = "In progress";
                gotFirstUnallocatedItem = 1;
            }
        }
        newHandoversList.push(handovers[i]);
    }

    req.session.handovers = newHandoversList;

    res.redirect('/queue/view?agentId=40001004');

}
module.exports.viewQueuePage = viewQueuePage;
module.exports.getNextQueueItem = getNextQueueItem;