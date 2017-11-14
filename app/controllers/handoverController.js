const handoverUtils = require('../utils/handoverUtils');
const officeUtils = require('../utils/officeUtils');
const claimantUtils = require('../utils/claimantUtils');
const sIDU = require('../utils/setInitialDataUtils');
const dateUtils = require('../utils/dateUtils');
const commonUtils = require('../utils/commonUtils');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Handover Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function viewHandoverPage(req, res) {

    let handoversList = req.session.handovers ? req.session.handovers : sIDU.setInitialBenefitsAndHandoversData().initialHandovers;
    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant = req.session.claimant ? claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.session.claimant.nino) :
                                          claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);
    let handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverByIdFromListOfHandovers(handoversList, req.query.id);
    let textVersions = handoverUtils.getHandoverDetails(handover);
    let officesList = sIDU.setInitialOfficesData();
    let officeId = handover.owningOfficeId || "3";
    let officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, officeId);
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let officeTypesIndex = commonUtils.findPositionOfObjectInArray(officeDetails.officeTypeId, officeTypes);
    let officeTypeId = officeTypes[officeTypesIndex].id;
    let officeTypeName = officeTypes[officeTypesIndex].officeType;
    let officeType = {
        id : officeTypeId,
        officeType : officeTypeName
    }

    req.session.claimant = claimant;
    req.session.handovers = handoversList;
    req.session.handover = handover;
    req.session.officeDetails = officeDetails;

    res.render('handover', {
        benefitName : textVersions.benefitName,
        handoverType : textVersions.handoverType,
        handoverReason : textVersions.handoverReason,
        officeDetails : officeDetails,
        officeTypes : officeTypes,
        officeType : officeType,
        claimant : claimant,
        handover : handover
    });

}

function viewHandoverPageAction(req, res) {

    let handover = req.session.handover;
    let claimantNino = req.session.claimant && req.session.claimant.nino || console.log("No claimant in session, or no nino in claimant");
    let handoverClaimant = req.session.claimant;

    req.session.claimant = handoverClaimant;
    req.session.handover = handover;

    res.redirect('/handover/edit?nino=' + claimantNino);

}

function createHandoverPage(req, res) {
    let editOrCreate = 'create';
    let initialData = sIDU.setInitialBenefitsAndHandoversData();
    let benefitsList = initialData.initialBenefits;
    let handoverTypesList = initialData.initialHandoverTypes;
    let handoverReasonsList = initialData.initialHandoverReasons;
    let handovers = req.session.handovers ? req.session.handovers : initialData.initialHandovers;
    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);
    let officesList = sIDU.setInitialOfficesData();
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let officeId = 3;  // Change to let officeId = user.owningOfficeId || "3" once got user details in prototype
    let officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, officeId);

    req.session.claimant = claimant;
    req.session.handovers = handovers;
    req.session.claimants = claimants;

    res.render('handover-edit', {
        benList : benefitsList,
        handTypesList : handoverTypesList,
        handReasonsList : handoverReasonsList,
        claimant : claimant,
        officeDetails : officeDetails,
        officesList : officesList,
        officeTypes : officeTypes,
        editOrCreate : editOrCreate
    });

}

function createHandoverPageAction(req, res) {

    let newHandover = new Object();
    let handoversList = req.session.handovers ? req.session.handovers : sIDU.setInitialBenefitsAndHandoversData();
    let newHandoversList = handoversList;
    let handoverNote = req.body['handover-note'];
    //let handoverAttachment = req.body['handover-attachment'];
    let claimant = req.session.claimant;
    let newId = handoversList.length + 1;

    newHandover.id = newId;
    newHandover.nino = claimant.nino;
    newHandover.staffId = '40001001';
    newHandover.owningOfficeId = req.body['office-id'];
    newHandover.benefitId = req.body['benefit'];
    newHandover.typeId = req.body['handover-type'];;
    newHandover.reasonId = req.body['handover-reason'];
    newHandover.callback = '1';
    newHandover.priority = req.body['handover-priority'];
    newHandover.dateAndTimeRaised = new Date();
    newHandover.targetDateAndTime = new Date();
    newHandover.notes = [];
    //newHandover.attachments = [];

    if (newHandover.callback === '1') {
        newHandover.targetDateAndTime.setHours(newHandover.dateAndTimeRaised.getHours() + 3);
    }

    newHandover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(newHandover.dateAndTimeRaised);
    newHandover.targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(newHandover.targetDateAndTime);

    if (handoverNote === "" || handoverNote === null) {
        console.log("No new handover note added");
    } else {
        let newHandoverNote = new Object();
        newHandoverNote.id = '1';
        newHandoverNote.handoverId = newHandover.id;
        newHandoverNote.dateNoteAdded = newHandover.dateAndTimeRaised;
        newHandoverNote.userWhoAddedNote = newHandover.staffId;
        newHandoverNote.noteContent = handoverNote;
        newHandover.notes.push(newHandoverNote);
    }

    //if (handoverAttachment === "" || handoverAttachment === null) {
    //    console.log("No new attachment added");
    //} else {
    //    newHandover.attachments.push(handoverAttachment);
    //}

    newHandoversList.push(newHandover);
    req.session.handover = newHandover;
    req.session.handovers = newHandoversList;
    req.session.claimant = claimant;

    res.redirect('/handover/view?id=' + newId);

}

function editHandoverPage(req, res) {

    let editOrCreate = 'edit';
    let initialData = sIDU.setInitialBenefitsAndHandoversData();
    let benefitsList = initialData.initialBenefits;
    let handoverTypesList = initialData.initialHandoverTypes;
    let handoverReasonsList = initialData.initialHandoverReasons;
    let handovers = req.session.handovers ? req.session.handovers : initialData.initialHandovers;
    let handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverByIdFromListOfHandovers(handovers, req.query.id);
    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);
    let officesList = sIDU.setInitialOfficesData();
    let officeId = handover.owningOfficeId || "3";
    let officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, officeId);
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let officeTypesIndex = commonUtils.findPositionOfObjectInArray(officeDetails.officeTypeId, officeTypes);
    let officeTypeId = officeTypes[officeTypesIndex].id;
    let officeTypeName = officeTypes[officeTypesIndex].officeType;
    let officeType = {
        officeTypeId : officeTypeId,
        officeTypeName : officeTypeName
    }

    req.session.claimant = claimant;
    req.session.handover = handover;
    req.session.handovers = handovers;
    req.session.claimants = claimants;

    res.render('handover-edit', {
        benList : benefitsList,
        handTypesList : handoverTypesList,
        handReasonsList : handoverReasonsList,
        claimant : claimant,
        handover : handover,
        officesList : officesList,
        officeDetails : officeDetails,
        officeType : officeType,
        officeTypes : officeTypes,
        editOrCreate : editOrCreate
    });
}

function editHandoverPageAction(req, res) {

    let handoversList = req.session.handovers ? req.session.handovers : sIDU.setInitialBenefitsAndHandoversData();
    let handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverByIdFromListOfHandovers(handoversList, req.query.id);
    let editedHandover = new Object();
    let handoverNote = req.body['handover-note'];
    //let handoverAttachment = req.body['handover-attachment'];
    let dateAndTimeRaised = new Date(handover.dateAndTimeRaised);
    let targetDateAndTime = new Date(handover.targetDateAndTime);
    let callback = "1";
    let claimant = req.session.claimant;
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let handoverIndex = commonUtils.findPositionOfObjectInArray(handover.id, handoversList);
    let officeTypeIndex = commonUtils.findPositionOfObjectInArray(handover.officeTypeId, officeTypes);

    if (callback === '1') {
        targetDateAndTime.setHours(targetDateAndTime.getHours() + 3);
    }

    editedHandover.id = handover.id
    editedHandover.nino = claimant.nino;
    editedHandover.staffId = handover.staffId;
    editedHandover.owningOfficeId = req.body['office'];
    editedHandover.benefitId = req.body['benefit'];
    editedHandover.typeId = req.body['handover-type'];;
    editedHandover.reasonId = req.body['handover-reason'];
    editedHandover.callback = '1';
    editedHandover.priority = req.body['handover-priority'];
    editedHandover.dateAndTimeRaised = dateAndTimeRaised;
    editedHandover.targetDateAndTime = targetDateAndTime;
    editedHandover.notes = handover.notes;
    //editedHandover.attachments = [];

    if (editedHandover.callback === '1') {
        editedHandover.targetDateAndTime.setHours(editedHandover.dateAndTimeRaised.getHours() + 3);
    }

    editedHandover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(dateAndTimeRaised);
    editedHandover.targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(targetDateAndTime);


    if (handoverNote === "" || handoverNote === null) {
        console.log("No new handover note added");
    } else {
        let editedHandoverNote = new Object();
        editedHandoverNote.id = '1';
        editedHandoverNote.handoverId = handover.id;
        editedHandoverNote.dateNoteAdded = new Date();
        editedHandoverNote.userWhoAddedNote = editedHandover.staffId;
        editedHandoverNote.noteContent = handoverNote;
        editedHandover.notes.unshift(editedHandoverNote);
    }

    //if (handoverAttachment === "" || handoverAttachment === null) {
    //    console.log("No new attachment added");
    //} else {
    //    editedHandover.attachments.push(handoverAttachment);
    //}

    handoversList[handoverIndex] = editedHandover;

    req.session.handovers = handoversList;
    req.session.handover = editedHandover;
    req.session.claimant = claimant;

    res.redirect('/handover/view');

}

module.exports.viewHandoverPage = viewHandoverPage;
module.exports.viewHandoverPageAction = viewHandoverPageAction;
module.exports.createHandoverPage = createHandoverPage;
module.exports.createHandoverPageAction = createHandoverPageAction;
module.exports.editHandoverPage = editHandoverPage;
module.exports.editHandoverPageAction = editHandoverPageAction;
