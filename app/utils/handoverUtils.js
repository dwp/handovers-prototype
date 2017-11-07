const Handover = require('../models/handover');
const Benefit = require('../models/benefit');
const HandoverType = require('../models/handover-type');
const HandoverReason = require('../models/handover-reason');
const HandoverNote = require('../models/handover-note');
const handoverData = require('../data/handoverData.json');

function setInitialHandoversData(){

    var initialHandoversData;
    var initialBenefits = []
    var initialHandoverTypes = [];
    var initialHandoverReasons = [];
    var initialHandovers = [];
    var initialHandoverNotes = [];

// Get data file and create lists
    var benefitsList = handoverData['benefits'];
    var handoverTypesList = handoverData['handoverTypes'];
    var handoverReasonsList = handoverData['handoverReasons'];
    var handoversList = handoverData['handovers'];
    var handoverNotesList = handoverData['handoverNotes'];

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

//Create list of handover note objects
    for (var i=0; i < handoverNotesList.length; i++) {
        var id = handoverNotesList[i].id;
        var handoverId = handoverNotesList[i].handoverId;
        var dateNoteAdded = handoverNotesList[i].dateNoteAdded;
        var userWhoAddedNote = handoverNotesList[i].userWhoAddedNote;
        var noteContent = handoverNotesList[i].noteContent;

        var handoverNoteObject = new HandoverNote(id, handoverId, dateNoteAdded, userWhoAddedNote, noteContent);
        initialHandoverNotes.push(handoverNoteObject);
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

    initialHandovers[0].notes = initialHandoverNotes;

    initialHandoversData = {
        "initialBenefits" : initialBenefits,
        "initialHandoverTypes" : initialHandoverTypes,
        "initialHandoverReasons" : initialHandoverReasons,
        "initialHandovers" : initialHandovers
    }

    return initialHandoversData;
}

function getHandoverById(id) {

    var handovers = this.setInitialHandoversData().initialHandovers;
    var inputId = id || "1";
    var foundHandover= {};

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
                "callback" : handover.callback,
                "priority" : handover.priority,
                "notes" : handover.notes
            }
        }
    }

    return foundHandover;
}
module.exports.setInitialHandoversData = setInitialHandoversData;
module.exports.getHandoverById = getHandoverById;
