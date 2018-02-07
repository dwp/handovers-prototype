const _ = require('lodash');
const handoverUtils = require('../utils/handoverUtils');
const sIDU = require('../utils/setInitialDataUtils');
const dateUtils = require('../utils/dateUtils');
const userUtils = require('../utils/userUtils');
const officeUtils = require('../utils/officeUtils');
const customerUtils = require('../utils/customerUtils');
const callbackData = require('../data/callbackData.json');

function viewQueuePage(req, res) {

    let users = sIDU.setInitialUsersData();
    let user = req.session.user;
    let offices = sIDU.setInitialOfficesData();
    let handovers = req.session.handovers ? req.session.handovers : sIDU.setInitialHandoversData();
    let customersList = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let handoversLength = handovers.length;
    let callbackStatusValues = callbackData['callbackStatusValues'];
    let messages = req.session.messages ? req.session.messages : [];
    let messagesLength = messages.length;
    let queueType = req.query.agentId ? 'agent' : 'office';
    let handoversQueueList = [];
    let sortedHandoversQueueList;
    for (let i=0; i < handoversLength; i++) {
        let handover = handoverUtils.getHandoverByIdFromListOfHandovers(handovers, handovers[i].id);
        if (handover.status === "Cleared" || handover.status === "Withdrawn") {
        //    Do nothing
        } else {
            let callbackStatusDescription = callbackStatusValues[handover.callbackStatus].callbackStatus;
            handover.callbackStatusDescription = callbackStatusDescription;
            let handoverDetails = handoverUtils.getHandoverBenefitNameHandoverTypeAndHandoverReason(handover);
            let dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised);
            let targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.targetDateAndTime);
            handover.benefitName = handoverDetails.benefitName;
            handover.benefitAbbr = handoverDetails.benefitAbbr;
            handover.handoverType = handoverDetails.handoverType;
            handover.handoverReason = handoverDetails.handoverReason;
            handover.dateRaised = (dateAndTimeRaisedForDisplay.day + " " + dateAndTimeRaisedForDisplay.month + " " + dateAndTimeRaisedForDisplay.year);
            handover.timeRaised = (dateAndTimeRaisedForDisplay.hours + ":" + dateAndTimeRaisedForDisplay.mins);
            handover.targetDate = (targetDateAndTimeForDisplay.day + " " + targetDateAndTimeForDisplay.month + " " + targetDateAndTimeForDisplay.year);
            handover.targetTime = (targetDateAndTimeForDisplay.hours + ":" + targetDateAndTimeForDisplay.mins);
            handover.timeLeftToTarget = dateUtils.calcTimeLeftToTarget(handover.targetDateAndTime);
            handover.inQueueOfStaffDetails = userUtils.getUserByStaffIdFromListOfUsers(users, handover.inQueueOfStaffId);
            handover.receivingOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(offices, handover.receivingOfficeId);
            handover.customerDetails = customerUtils.getCustomerByNinoFromListOfCustomers(customersList, handover.nino);
            if (queueType === 'agent') {
                if (handover.inQueueOfStaffId == user.staffId) {
                    handoversQueueList.push(handover);
                }
            } else {
                handoversQueueList.push(handover);
            }
        }
    }
    req.session.messages = [];
    sortedHandoversQueueList = _.orderBy(handoversQueueList, ['callback', 'dateAndTimeRaised'], ['desc', 'asc']);
    res.render('queue', {
        messages : messages,
        messagesLength : messagesLength,
        handoversQueueList : sortedHandoversQueueList,
        queueType : queueType,
        queueAgent : user
    });
}

function getNextQueueItem(req, res) {

    let handovers = req.session.handovers ? req.session.handovers : sIDU.setInitialHandoversData();
    let sortedHandovers = _.sortBy(handovers, ['dateAndTimeRaised']);
    let sortedHandoversLength = sortedHandovers.length;
    let users = sIDU.setInitialUsersData();
    let user = req.session.user;
    let agentDetails = userUtils.getUserByStaffIdFromListOfUsers(users, req.query.agentId);
    let gotFirstUnallocatedItem = 0;
    let newHandoversQueueList = [];
    let messages = [];
    let message;
    for (let i=0; i < sortedHandoversLength; i++) {
        if (gotFirstUnallocatedItem === 0) {
            if (sortedHandovers[i].status === "Not allocated") {
                sortedHandovers[i].inQueueOfStaffId = user.staffId;
                sortedHandovers[i].status = "In progress";
                gotFirstUnallocatedItem = 1;
            }
        }
        newHandoversQueueList.push(sortedHandovers[i]);
    }
    if (gotFirstUnallocatedItem == 0) {
        message = ("There are no unallocated handovers for " + agentDetails.firstName + " " + agentDetails.lastName + ". Try again later");
        messages.push(message);
    }
    req.session.handovers = newHandoversQueueList;
    req.session.messages = messages;
    res.redirect('/queue/view?agentId=' + user.staffId);

}

module.exports.viewQueuePage = viewQueuePage;
module.exports.getNextQueueItem = getNextQueueItem;