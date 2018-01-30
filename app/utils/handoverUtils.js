const dateUtils = require('../utils/dateUtils');
const sIDU = require('../utils/setInitialDataUtils');

function getHandoverByIdFromListOfHandovers(handoversList, id) {

    let handovers = handoversList;
    let inputId = id || "1";
    let foundHandover;

    for (let i=0; i < handovers.length; i++) {
        if (handovers[i].id == inputId) {
            foundHandover = handovers[i];
        }
    }

    return foundHandover;
}

function getHandoverBenefitNameHandoverTypeAndHandoverReason(handover) {

    let textVersions = {};
    let initialHandoversData = sIDU.setInitialBenefitsAndHandoversData();
    let benefitsList = initialHandoversData.initialBenefits;
    let handoverTypesList = initialHandoversData.initialHandoverTypes;
    let handoverReasonsList = initialHandoversData.initialHandoverReasons;

    let benefitName;
    let benefitAbbr;
    let handoverType;
    let handoverReason;

    for (let i=0; i < benefitsList.length; i++) {
        if (handover.benefitId === benefitsList[i].id) {
            benefitName = benefitsList[i].benefitName;
            benefitAbbr = benefitsList[i].benefitAbbr;
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
    textVersions.benefitAbbr = benefitAbbr;
    textVersions.handoverType = handoverType;
    textVersions.handoverReason = handoverReason;


    return textVersions;

}

function validateHandover(inputHandover) {
    let validatedHandover;
    let handover = {};
    let errors = [];

    if (inputHandover.benefitId === "") {
        errors.push({
            message: "Benefit must be selected from dropdown list",
            field: "benefit"
        });
    } else {
        handover.benefitId = inputHandover.benefitId;
    }

    if (inputHandover.benefitId == 5) {
        if (inputHandover.benSubType === "") {
            errors.push({
                message: "Benefit sub-type must be selected from dropdown list",
                field: "benSubType"
            });
        } else {
            handover.benSubType = inputHandover.benSubType;
        }
    }

    if (inputHandover.typeId === "") {
        errors.push({
            message: "Handover type must be selected from dropdown list",
            field: "handover-type"
        });
    } else {
        handover.typeId = inputHandover.typeId;
    }

    if (inputHandover.reasonId === "") {
        errors.push({
            message: "Handover reason must be selected from dropdown list",
            field: "handover-reason"
        });
    } else {
        handover.reasonId = inputHandover.reasonId;
    }
    handover.id = inputHandover.id;
    handover.nino = inputHandover.nino;
    handover.raisedByStaffId = inputHandover.raisedByStaffId;
    handover.inQueueOfStaffId = inputHandover.inQueueOfStaffId;
    handover.raisedOnBehalfOfOfficeId = inputHandover.raisedOnBehalfOfOfficeId;
    handover.receivingOfficeId = inputHandover.receivingOfficeId;
    handover.callback = inputHandover.callback;
    handover.callbackStatus = inputHandover.callbackStatus;
    handover.firstCallback = inputHandover.firstCallback;
    handover.secondCallback = inputHandover.secondCallback;
    handover.thirdCallback = inputHandover.thirdCallback;
    handover.escalated = inputHandover.escalated;
    handover.status = inputHandover.status;
    handover.inQueueOfStaffId = inputHandover.inQueueOfStaffId;
    handover.dateAndTimeRaised = inputHandover.dateAndTimeRaised;
    handover.targetDateAndTime = inputHandover.targetDateAndTime;
    handover.notes = inputHandover.notes;

    validatedHandover = {
        "handover" : handover,
        "errors" : errors
    };

    return validatedHandover;
}

module.exports.getHandoverByIdFromListOfHandovers = getHandoverByIdFromListOfHandovers;
module.exports.getHandoverBenefitNameHandoverTypeAndHandoverReason = getHandoverBenefitNameHandoverTypeAndHandoverReason;
module.exports.validateHandover = validateHandover;

