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

    let users = req.session.user ? req.session.user : sIDU.setInitialUsersData();
    let user = req.session.user ? req.session.user : users[0];
    let handoversList = req.session.handovers ? req.session.handovers : sIDU.setInitialBenefitsAndHandoversData().initialHandovers;
    let handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverByIdFromListOfHandovers(handoversList, req.query.id);
    let handoverTextDetails = handoverUtils.getHandoverDetails(handover);
    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant = req.session.claimant ? claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.session.claimant.nino) :
                                          claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);
    let officesList = sIDU.setInitialOfficesData();
    let officeId = handover.raisedOnBehalfOfOfficeId || "3";
    let officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, officeId);
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let officeTypesIndex = commonUtils.findPositionOfObjectInArray(officeDetails.officeTypeId, officeTypes);
    let officeTypeId = officeTypes[officeTypesIndex].id;
    let officeTypeName = officeTypes[officeTypesIndex].officeType;
    let officeType = {
        id : officeTypeId,
        officeType : officeTypeName
    }

    user.officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, user.owningOfficeId);
    let userOfficeTypeIndex = commonUtils.findPositionOfObjectInArray(user.officeDetails.officeTypeId, officeTypes);
    user.officeDetails.officeType = officeTypes[userOfficeTypeIndex].officeType;

    req.session.claimant = claimant;
    req.session.handovers = handoversList;
    req.session.handover = handover;
    req.session.officeDetails = officeDetails;

    res.render('handover', {
        benefitName : handoverTextDetails.benefitName,
        handoverType : handoverTextDetails.handoverType,
        handoverReason : handoverTextDetails.handoverReason,
        officeDetails : officeDetails,
        officeTypes : officeTypes,
        officeType : officeType,
        claimant : claimant,
        handover : handover,
        user : user,
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
    let users = req.session.user ? req.session.user : sIDU.setInitialUsersData();
    let user = req.session.user ? req.session.user : users[0];
    let benefitsList = initialData.initialBenefits;
    let handoverTypesList = initialData.initialHandoverTypes;
    let handoverReasonsList = initialData.initialHandoverReasons;
    let handovers = req.session.handovers ? req.session.handovers : initialData.initialHandovers;
    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);
    let officesList = sIDU.setInitialOfficesData();
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let officeId = 3;  // Change to let officeId = handover.raisedOnBehalfOfOfficeId || "3" once got different offices sorted
    let officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, officeId);

    user.officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, user.owningOfficeId);
    let userOfficeTypeIndex = commonUtils.findPositionOfObjectInArray(user.officeDetails.officeTypeId, officeTypes);
    user.officeDetails.officeType = officeTypes[userOfficeTypeIndex].officeType;

    req.session.claimant = claimant;
    req.session.handovers = handovers;
    req.session.claimants = claimants;

    res.render('handover-edit', {
        benList : benefitsList,
        handTypesList : handoverTypesList,
        handReasonsList : handoverReasonsList,
        claimant : claimant,
        user : user,
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
    let claimant = req.session.claimant;
    let newId = handoversList.length + 1;

    newHandover.id = newId;
    newHandover.nino = claimant.nino;
    newHandover.staffId = '40001001';
    newHandover.raisedOnBehalfOfOfficeId = req.body['office-id'];
    newHandover.benefitId = req.body['benefit'];

    if (newHandover.benefitId === "5") {
        newHandover.benSubType = req.body['benefit-sub'];
    } else {
        newHandover.benSubType = null;
    }
    newHandover.typeId = req.body['handover-type'];;
    newHandover.reasonId = req.body['handover-reason'];
    newHandover.callback = req.body['callback-req'];
    newHandover.priority = req.body['handover-priority'];
    newHandover.dateAndTimeRaised = new Date();
    newHandover.targetDateAndTime = new Date();
    newHandover.notes = [];

    if (newHandover.callback === 'Yes') {
        newHandover.targetDateAndTime.setHours(newHandover.dateAndTimeRaised.getHours() + 3);
    }

    newHandover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(newHandover.dateAndTimeRaised);
    newHandover.targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(newHandover.targetDateAndTime);

    if (handoverNote === "" || handoverNote === null) {
        // Do nothing
    } else {
        let newHandoverNote = new Object();
        newHandoverNote.id = '1';
        newHandoverNote.handoverId = newHandover.id;
        newHandoverNote.dateNoteAdded = newHandover.dateAndTimeRaised;
        newHandoverNote.userWhoAddedNote = newHandover.staffId;
        newHandoverNote.noteContent = handoverNote;
        newHandover.notes.push(newHandoverNote);
    }

    newHandoversList.push(newHandover);
    req.session.handover = newHandover;
    req.session.handovers = newHandoversList;
    req.session.claimant = claimant;

    res.redirect('/handover/view?id=' + newId);

}

function editHandoverPage(req, res) {

    let editOrCreate = 'edit';
    let initialData = sIDU.setInitialBenefitsAndHandoversData();
    let users = req.session.user ? req.session.user : sIDU.setInitialUsersData();
    let user = req.session.user ? req.session.user : users[0];
    let benefitsList = initialData.initialBenefits;
    let handoverTypesList = initialData.initialHandoverTypes;
    let handoverReasonsList = initialData.initialHandoverReasons;
    let handovers = req.session.handovers ? req.session.handovers : initialData.initialHandovers;
    let handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverByIdFromListOfHandovers(handovers, req.query.id);
    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);
    let officesList = sIDU.setInitialOfficesData();
    let officeId = handover.raisedOnBehalfOfOfficeId || "3";
    let officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, officeId);
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let officeTypesIndex = commonUtils.findPositionOfObjectInArray(officeDetails.officeTypeId, officeTypes);
    let officeTypeId = officeTypes[officeTypesIndex].id;
    let officeTypeName = officeTypes[officeTypesIndex].officeType;
    let officeType = {
        officeTypeId : officeTypeId,
        officeTypeName : officeTypeName
    }
    user.officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, user.owningOfficeId);
    let userOfficeTypeIndex = commonUtils.findPositionOfObjectInArray(user.officeDetails.officeTypeId, officeTypes);
    user.officeDetails.officeType = officeTypes[userOfficeTypeIndex].officeType;

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
        user: user,
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
    let dateAndTimeRaised = new Date(handover.dateAndTimeRaised);
    let targetDateAndTime = new Date(handover.targetDateAndTime);
    let claimant = req.session.claimant;
    let handoverIndex = commonUtils.findPositionOfObjectInArray(handover.id, handoversList);
    let callback = req.body['callback-req'];
    if (callback === 'Yes') {
        targetDateAndTime.setHours(targetDateAndTime.getHours() + 3);
    }

    editedHandover.id = handover.id
    editedHandover.nino = claimant.nino;
    editedHandover.staffId = handover.staffId;
    editedHandover.owningOfficeId = req.body['office'];
    editedHandover.benefitId = req.body['benefit'];

    if (editedHandover.benefitId === "5") {
        editedHandover.benSubType = req.body['benefit-sub'];
    } else {
        editedHandover.benSubType = null;
    }

    editedHandover.typeId = req.body['handover-type'];;
    editedHandover.reasonId = req.body['handover-reason'];
    editedHandover.callback = callback;
    editedHandover.priority = req.body['handover-priority'];
    editedHandover.dateAndTimeRaised = dateAndTimeRaised;
    editedHandover.targetDateAndTime = targetDateAndTime;
    editedHandover.notes = handover.notes;

    if (editedHandover.callback === 'Yes') {
        editedHandover.targetDateAndTime.setHours(editedHandover.dateAndTimeRaised.getHours() + 3);
    }

    editedHandover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(dateAndTimeRaised);
    editedHandover.targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(targetDateAndTime);


    if (handoverNote === "" || handoverNote === null) {
        // Do nothing
    } else {
        let editedHandoverNote = new Object();
        editedHandoverNote.id = '1';
        editedHandoverNote.handoverId = handover.id;
        editedHandoverNote.dateNoteAdded = new Date();
        editedHandoverNote.userWhoAddedNote = editedHandover.staffId;
        editedHandoverNote.noteContent = handoverNote;
        editedHandover.notes.unshift(editedHandoverNote);
    }

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
