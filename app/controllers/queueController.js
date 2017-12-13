const handoverUtils = require('../utils/handoverUtils');
const queueUtils = require('../utils/queueUtils');
const sIDU = require('../utils/setInitialDataUtils');
const dateUtils = require('../utils/dateUtils');
const commonUtils = require('../utils/commonUtils');

function viewQueuePage(req, res) {

    let bensHands = sIDU.setInitialBenefitsAndHandoversData();
    let handovers = req.session.handovers ? req.session.handovers : bensHands.initialHandovers;
    let length = handovers.length;
    let handoversList = [];
    let queueAgent = req.query.agentId ? req.query.agentId : '40001003';
    let queueType = req.query.agentId ? 'agent' : 'office';


    for (let i=0; i < length; i++) {
        let handover = handoverUtils.getHandoverByIdFromListOfHandovers(handovers, handovers[i].id);
        let textDetails = handoverUtils.getHandoverDetails(handover);
        let benefitName = textDetails.benefitName;
        let handoverType = textDetails.handoverType;
        let handoverReason = textDetails.handoverReason;
        handover.benefitName = benefitName;
        handover.handoverType = handoverType;
        handover.handoverReason = handoverReason;
        handover.dateRaised = (handover.dateAndTimeRaisedForDisplay.day + " " + handover.dateAndTimeRaisedForDisplay.month + " " + handover.dateAndTimeRaisedForDisplay.year);
        handover.timeRaised = (handover.dateAndTimeRaisedForDisplay.hours + ":" + handover.dateAndTimeRaisedForDisplay.mins);
        handover.targetDate = (handover.targetDateAndTimeForDisplay.day + " " + handover.targetDateAndTimeForDisplay.month + " " + handover.targetDateAndTimeForDisplay.year);
        handover.targetTime = (handover.targetDateAndTimeForDisplay.hours + ":" + handover.targetDateAndTimeForDisplay.mins);

        // Until sorted data item for staff this item is allocated to, just put first three in list of handovers in 'my queue' if queueType = agent

        if (queueType === 'agent') {
            if (handover.inQueueOfStaffId === queueAgent) {
                handoversList.push(handover);
            }
        } else {
            handoversList.push(handover);
        }
    }

    res.render('queue', {
        handoversList : handoversList,
        queueType : queueType
    });
}

module.exports.viewQueuePage = viewQueuePage;