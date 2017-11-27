const dateUtils = require('../utils/dateUtils');
const sIDU = require('../utils/setInitialDataUtils');

function getHandoverByIdFromListOfHandovers(handoversList, id) {

    let handovers = handoversList;
    let inputId = id || "1";
    let foundHandover;

    for (let i=0; i < handovers.length; i++) {
        if (handovers[i].id === inputId) {
            let handover = handovers[i];
            foundHandover = {
                "id" : handover.id,
                "nino" : handover.nino,
                "staffId" : handover.staffId,
                "raisedOnBehalfOfOfficeId" : handover.raisedOnBehalfOfOfficeId,
                "benefitId" : handover.benefitId,
                "benSubType" : handover.benSubType,
                "typeId" : handover.typeId,
                "reasonId" : handover.reasonId,
                "dateAndTimeRaised" : handover.dateAndTimeRaised,
                "dateAndTimeRaisedForDisplay" : dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised),
                "targetDateAndTime" : handover.targetDateAndTime,
                "targetDateAndTimeForDisplay" : dateUtils.formatDateAndTimeForDisplay(handover.targetDateAndTime),
                "callback" : handover.callback,
                "priority" : handover.priority,
                "notes" : handover.notes
            }
        }
    }

    return foundHandover;
}

function getHandoverDetails(handover) {

    let textVersions = {};
    let initialHandoversData = sIDU.setInitialBenefitsAndHandoversData();
    let benefitsList = initialHandoversData.initialBenefits;
    let handoverTypesList = initialHandoversData.initialHandoverTypes;
    let handoverReasonsList = initialHandoversData.initialHandoverReasons;

    let benefitName;
    let handoverType;
    let handoverReason;


    for (let i=0; i < benefitsList.length; i++) {
        if (handover.benefitId === benefitsList[i].id) {
            benefitName = benefitsList[i].benefitName;
        }
    }

    for (let i=0; i < handoverTypesList.length; i++) {
        if (handover.typeId === handoverTypesList[i].id) {
            handoverType = handoverTypesList[i].handoverType;
        }
    }

    for (let i=0; i < handoverReasonsList.length; i++) {
        if (handover.reasonId === handoverReasonsList[i].id) {
            handoverReason = handoverReasonsList[i].handoverReason;
        }
    }

    textVersions.benefitName = benefitName;
    textVersions.handoverType = handoverType;
    textVersions.handoverReason = handoverReason;


    return textVersions;

}

module.exports.getHandoverByIdFromListOfHandovers = getHandoverByIdFromListOfHandovers;
module.exports.getHandoverDetails = getHandoverDetails;

