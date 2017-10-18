const Benefit = require('../models/benefit');
const HandoverType = require('../models/handover-type');
const HandoverReason = require('../models/handover-reason');
const Handover = require('../models/handover');
const controllerData = require('../data/handoverData.json');

function setInitialHandoversData(){

    var initialHandoversData;
    var initialBenefits = []
    var initialHandoverTypes = [];
    var initialHandoverReasons = [];
    var initialHandovers = [];

// Get data file and create lists
    var benefitsList = controllerData['benefits'];
    var handoverTypesList = controllerData['handoverTypes'];
    var handoverReasonsList = controllerData['handoverReasons'];
    var handoversList = controllerData['handovers'];

// Create list of benefit objects
    for (var i=0; i < benefitsList.length; i++) {
        var id = benefitsList[i].id;
        var benefitName = benefitsList[i].benefitName;
        var benefitObject = new Benefit(id, benefitName);
        initialBenefits.push(benefitObject);
    }
// Create list of handover type objects
    for (var i=0; i < handoverTypesList.length; i++) {
        var id = handoverTypesList[i].id;
        var handoverType = handoverTypesList[i].handoverType;
        var handoverTypeObject = new HandoverType(id, handoverType);
        initialHandoverTypes.push(handoverTypeObject);
    }

// Create list of handover reason objects
    for (var i=0; i < handoverReasonsList.length; i++) {
        var id = handoverReasonsList[i].id;
        var handoverReason = handoverReasonsList[i].handoverReason;
        var handoverReasonObject = new HandoverReason(id, handoverReason);
        initialHandoverReasons.push(handoverReasonObject);
    }

// Create list of handover objects
    for (var i=0; i < handoversList.length; i++) {
        var id = handoversList[i].firstName;
        var claimantNino = handoversList[i].claimantNino;
        var staffId = handoversList[i].staffId;
        var owningOfficeId = handoversList[i].owningOfficeId;
        var benefitId = handoversList[i].benefitId;
        var typeId = handoversList[i].typeId;
        var reasonId = handoversList[i].reasonId;
        var callback = handoversList[i].callback;
        var priority = handoversList[i].priority;

        var handoverObject = new Handover(id, claimantNino, staffId, owningOfficeId, benefitId, typeId, reasonId, callback);
        initialHandovers.push(handoverObject);
    }

    initialHandoversData = {
        "initialBenefits" : initialBenefits,
        "initialHandoverTypes" : initialHandoverTypes,
        "initialHandoverReasons" : initialHandoverReasons,
        "initialHandovers" : initialHandovers
    }

    return initialHandoversData;
}

module.exports.setInitialHandoversData = setInitialHandoversData;
