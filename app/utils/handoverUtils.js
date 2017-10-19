const Handover = require('../models/handover');
const Benefit = require('../models/benefit');
const HandoverType = require('../models/handover-type');
const HandoverReason = require('../models/handover-reason');
const handoverData = require('../data/handoverData.json');

function setInitialHandoversData(){

    var initialHandoversData;
    var initialBenefits = []
    var initialHandoverTypes = [];
    var initialHandoverReasons = [];
    var initialHandovers = [];

// Get data file and create lists
    var benefitsList = handoverData['benefits'];
    var handoverTypesList = handoverData['handoverTypes'];
    var handoverReasonsList = handoverData['handoverReasons'];
    var handoversList = handoverData['handovers'];

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
        var id = handoversList[i].id;
        var nino = handoversList[i].nino;
        var staffId = handoversList[i].staffId;
        var owningOfficeId = handoversList[i].owningOfficeId;
        var benefitId = handoversList[i].benefitId;
        var typeId = handoversList[i].typeId;
        var reasonId = handoversList[i].reasonId;
        var callback = handoversList[i].callback;
        var priority = handoversList[i].priority;

        var handoverObject = new Handover(id, nino, staffId, owningOfficeId, benefitId, typeId, reasonId, callback, priority);
        handoverObject.setTimeAndDateRaised();
        handoverObject.calculateTargetTime();
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
