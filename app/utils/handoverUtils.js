const dateUtils = require('../utils/dateUtils');
const sIDU = require('../utils/setInitialDataUtils');

function getHandoverByIdFromListOfHandovers(handoversList, id) {

    var handovers = handoversList;
    var inputId = id || "1";
    var foundHandover = {};

    for (var i=0; i < handovers.length; i++) {
        if (handovers[i].id === inputId) {
            var handover = handovers[i];
            foundHandover = {
                "id" : handover.id,
                "nino" : handover.nino,
                "staffId" : handover.staffId,
                "owningOfficeId" : handover.owningOfficeId,
                "benefitId" : handover.benefitId,
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

    var textVersions = {};
    var initialHandoversData = sIDU.setInitialBenefitsAndHandoversData();
    var benefitsList = initialHandoversData.initialBenefits;
    var handoverTypesList = initialHandoversData.initialHandoverTypes;
    var handoverReasonsList = initialHandoversData.initialHandoverReasons;

    var benefitName;
    var handoverType;
    var handoverReason;


    for (var i=0; i < benefitsList.length; i++) {
        if (handover.benefitId === benefitsList[i].id) {
            benefitName = benefitsList[i].benefitName;
        }
    }

    for (var i=0; i < handoverTypesList.length; i++) {
        if (handover.typeId === handoverTypesList[i].id) {
            handoverType = handoverTypesList[i].handoverType;
        }
    }

    for (var i=0; i < handoverReasonsList.length; i++) {
        if (handover.reasonId === handoverReasonsList[i].id) {
            handoverReason = handoverReasonsList[i].handoverReason;
        }
    }

    textVersions.benefitName = benefitName;
    textVersions.handoverType = handoverType;
    textVersions.handoverReason = handoverReason;


    return textVersions;

}

function findPositionOfHandoverInArray(inputQueryId, handoversList) {
    let positionOfApptInArray;
    let handoversArray = handoversList;
    let arrLength = handoversArray.length;
    let queryId = parseInt(inputQueryId);

    for (let i = 0; i < arrLength; i++) {

        if (handoversArray[i].id === queryId) {
            positionOfApptInArray = i;
        }
    }

    return positionOfApptInArray;
}

module.exports.getHandoverByIdFromListOfHandovers = getHandoverByIdFromListOfHandovers;
module.exports.getHandoverDetails = getHandoverDetails;
module.exports.findPositionOfHandoverInArray = findPositionOfHandoverInArray;
