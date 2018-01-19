const Handover = require('../models/Handover.model');
const HandoverNote = require('../models/HandoverNote.model');
const HandoverType = require('../models/HandoverType.model');
const HandoverReason = require('../models/HandoverReason.model');
const sIDU = require('../utils/setInitialDataUtils');
const handoverUtils = require('../utils/handoverUtils');
const officeUtils = require('../utils/officeUtils');
const customerUtils = require('../utils/customerUtils');
const userUtils = require('../utils/userUtils');
const dateUtils = require('../utils/dateUtils');
const commonUtils = require('../utils/commonUtils');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Handover Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function viewHandoverPage(req, res) {

    let errors = req.session.errors ? req.session.errors : [];
    let users = sIDU.setInitialUsersData();

    // Get full details of the handover
    let handoversList = req.session.handovers ? req.session.handovers : sIDU.setInitialBenefitsAndHandoversData().initialHandovers;
    let handover;
    if (req.query.id === null) {
        handover = req.session.handover ? req.session.handover : handoversList[0];
    } else {
        handover = handoverUtils.getHandoverByIdFromListOfHandovers(handoversList, req.query.id);
    }
    handover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised);
    handover.targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.targetDateAndTime);
    let handoverDetails = handoverUtils.getHandoverBenefitNameHandoverTypeAndHandoverReason(handover);

    //......including the notes
    let handoverNotes = [];
    if (handover.notes === null) {
    //     do nothing
    } else {
        let handNoteLen = handover.notes.length;
        for (let i=0; i < handNoteLen; i++) {
            let handoverNote = {
                id: handover.notes[i].id,
                dateNoteAdded: dateUtils.formatDateAndTimeForDisplay(handover.notes[i].dateNoteAdded),
                userWhoAddedNote: userUtils.getUserByStaffIdFromListOfUsers(users, handover.notes[i].userWhoAddedNote),
                updateResultedFromCustomerContactIndicator: handover.notes[i].updateResultedFromCustomerContactIndicator,
                noteContent: handover.notes[i].noteContent
            }
            handoverNotes.push(handoverNote);
        }
    }

    // Get details of the customer this handover is for
    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer = customerUtils.getCustomerByNinoFromListOfCustomers(customers, handover.nino);

    // Get customer office, receiving office, raising agent, and the raising agent's office, for the handover
    let officesList = sIDU.setInitialOfficesData();
    let customerOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, customer.customerOfficeId);
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let receivingOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, handover.receivingOfficeId);
    let agentWhoRaisedHandover = userUtils.getUserByStaffIdFromListOfUsers(users, handover.raisedByStaffId);
    agentWhoRaisedHandover.officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, agentWhoRaisedHandover.owningOfficeId);
    let agentOfficeTypeIndex = commonUtils.findPositionOfObjectInArray(agentWhoRaisedHandover.officeDetails.officeTypeId, officeTypes);
    agentWhoRaisedHandover.officeDetails.officeType = officeTypes[agentOfficeTypeIndex].officeType;

    // Get details of agent dealing with the handover if applicable
    let inQueueOfStaffDetails;
    if (handover.inQueueOfStaffId !== "") {
        inQueueOfStaffDetails = userUtils.getUserByStaffIdFromListOfUsers(users, handover.inQueueOfStaffId);
    }

    req.session.customer = customer;
    req.session.handovers = handoversList;
    req.session.handover = handover;

    res.render('handover', {
        benefitName : handoverDetails.benefitName,
        handoverType : handoverDetails.handoverType,
        handoverReason : handoverDetails.handoverReason,
        handoverNotes : handoverNotes,
        handoverNotesLength : handoverNotes.length,
        receivingOfficeDetails : receivingOfficeDetails,
        inQueueOfStaffDetails : inQueueOfStaffDetails,
        customerOfficeDetails : customerOfficeDetails,
        customer : customer,
        handover : handover,
        agentWhoRaisedHandover : agentWhoRaisedHandover,
        errors : errors,
        errorsLength : errors.length
    });

}

function viewHandoverPageAction(req, res) {

    let handover = req.session.handover;
    let customerNino = req.session.customer && req.session.customer.nino || console.log("No customer in session, or no nino in customer");
    req.session.handover = handover;
    res.redirect('/handover/edit?nino=' + customerNino);

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
    let officesList = sIDU.setInitialOfficesData();
    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer = customerUtils.getCustomerByNinoFromListOfCustomers(customers, req.query.nino);
    let customerOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, customer.customerOfficeId);
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let officeId = 3;  // Change to let officeId = handover.raisedOnBehalfOfOfficeId || "3" once got different offices sorted
    let officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, officeId);
    user.officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, user.owningOfficeId);
    let userOfficeTypeIndex = commonUtils.findPositionOfObjectInArray(user.officeDetails.officeTypeId, officeTypes);
    user.officeDetails.officeType = officeTypes[userOfficeTypeIndex].officeType;
    req.session.customer = customer;
    req.session.handovers = handovers;
    req.session.customers = customers;
    res.render('handover-edit', {
        benList : benefitsList,
        handTypesList : handoverTypesList,
        handReasonsList : handoverReasonsList,
        customer : customer,
        user : user,
        officeDetails : officeDetails,
        customerOfficeDetails : customerOfficeDetails,
        officesList : officesList,
        officeTypes : officeTypes,
        editOrCreate : editOrCreate
    });

}

function createHandoverPageAction(req, res) {

    let handoversList = req.session.handovers ? req.session.handovers : sIDU.setInitialBenefitsAndHandoversData();
    let customer = req.session.customer;
    let users = sIDU.setInitialUsersData();
    let handoverNote = req.body['handover-note'];
    let updateResultedFromCustomerContactIndicator = req.body['handover-contact-indicator'];
    let newHandover = {};
    let newHandoversList = handoversList;
    let handoverToCreate;
    let newId = handoversList.length + 1;
    newHandover.id = newId;
    newHandover.nino = customer.nino;
    newHandover.raisedByStaffId = '40001001';
    let user = userUtils.getUserByStaffIdFromListOfUsers(users, newHandover.raisedByStaffId);
    newHandover.raisedOnBehalfOfOfficeId = user.owningOfficeId;
    newHandover.benefitId = req.body['benefit'];
    if (newHandover.benefitId === "5") {
        newHandover.benSubType = req.body['benefit-sub'];
    } else {
        newHandover.benSubType = null;
    }
    // Set receiving office to this value until/unless prototype changed to show some kind of routing rules
    newHandover.receivingOfficeId = 4;
    newHandover.typeId = req.body['handover-type'];;
    newHandover.reasonId = req.body['handover-reason'];
    newHandover.callback = req.body['handover-callback'];
    newHandover.priority = req.body['handover-priority'];
    newHandover.status = "Not allocated";
    newHandover.inQueueOfStaffId = "";
    newHandover.dateAndTimeRaised = new Date();
    newHandover.targetDateAndTime = new Date();
    newHandover.targetDateAndTime.setHours(newHandover.dateAndTimeRaised.getHours() + 3);
    newHandover.notes = [];
    newHandover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(newHandover.dateAndTimeRaised);
    newHandover.targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(newHandover.targetDateAndTime);
    if (handoverNote === "" || handoverNote === null) {
        // Do nothing
    } else {
        let newHandoverNote = {};
        newHandoverNote.id = '1';
        newHandoverNote.handoverId = newHandover.id;
        newHandoverNote.dateNoteAdded = new Date();
        newHandoverNote.userWhoAddedNote = newHandover.raisedByStaffId;
        newHandoverNote.updateResultedFromCustomerContactIndicator = updateResultedFromCustomerContactIndicator;
        newHandoverNote.noteContent = handoverNote;
        let handoverNoteToCreate = new HandoverNote(newHandoverNote);
        newHandover.notes.push(handoverNoteToCreate );
    }
    handoverToCreate = new Handover(newHandover);
    newHandoversList.push(handoverToCreate);
    req.session.handover = handoverToCreate;
    req.session.handovers = newHandoversList;
    req.session.customer = customer;
    res.redirect('/customer/summary?id=' + handoverToCreate.nino);

}

function editHandoverPage(req, res) {

    let editOrCreate = 'edit';
    let initialData = sIDU.setInitialBenefitsAndHandoversData();
    let users = req.session.user ? req.session.user : sIDU.setInitialUsersData();
    let handovers = req.session.handovers ? req.session.handovers : initialData.initialHandovers;
    let handover = handoverUtils.getHandoverByIdFromListOfHandovers(handovers, req.query.id);
    let handoverNotes = [];
    let handoverDetails = handoverUtils.getHandoverBenefitNameHandoverTypeAndHandoverReason(handover);
    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer = customerUtils.getCustomerByNinoFromListOfCustomers(customers, handover.nino);
    let officesList = sIDU.setInitialOfficesData();
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let customerOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, customer.customerOfficeId)
    let receivingOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, handover.receivingOfficeId);
    let userWhoRaisedHandover = userUtils.getUserByStaffIdFromListOfUsers(users, handover.raisedByStaffId);
    userWhoRaisedHandover.officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, userWhoRaisedHandover.owningOfficeId);
    let userOfficeTypeIndex = commonUtils.findPositionOfObjectInArray(userWhoRaisedHandover.officeDetails.officeTypeId, officeTypes);
    userWhoRaisedHandover.officeDetails.officeType = officeTypes[userOfficeTypeIndex].officeType;
    let errors = req.session.errors ? req.session.errors : [];
    handover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised);
    handover.targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.targetDateAndTime);
    let inQueueOfStaffDetails;
    if (handover.inQueueOfStaffId !== "") {
        inQueueOfStaffDetails = userUtils.getUserByStaffIdFromListOfUsers(users, handover.inQueueOfStaffId);
    }
    if (handover.notes === null) {
        handoverNotes = [];
    } else {
        for (let i=0; i < handover.notes.length; i++) {
            let handoverNote = {
                id: handover.notes[i].id,
                dateNoteAdded: dateUtils.formatDateAndTimeForDisplay(new Date(handover.notes[i].dateNoteAdded)),
                userWhoAddedNote: userUtils.getUserByStaffIdFromListOfUsers(users, handover.notes[i].userWhoAddedNote),
                updateResultedFromCustomerContactIndicator: handover.notes[i].updateResultedFromCustomerContactIndicator,
                noteContent: handover.notes[i].noteContent
            }
            handoverNotes.push(handoverNote);
        }
    }
    req.session.customer = customer;
    req.session.customers = customers;
    req.session.handover = handover;
    req.session.handovers = handovers;
    res.render('handover-edit', {
        benefitName : handoverDetails.benefitName,
        handoverType : handoverDetails.handoverType,
        handoverReason : handoverDetails.handoverReason,
        handoverNotes : handoverNotes,
        handoverNotesLength : handoverNotes.length,
        receivingOfficeDetails : receivingOfficeDetails,
        inQueueOfStaffDetails : inQueueOfStaffDetails,
        customer : customer,
        handover : handover,
        userWhoRaisedHandover : userWhoRaisedHandover,
        customerOfficeDetails : customerOfficeDetails,
        editOrCreate : editOrCreate,
        errors : errors,
        errorsLength : errors.length
    });
}

function editHandoverPageAction(req, res) {

    let users = req.session.user ? req.session.user : sIDU.setInitialUsersData();
    let user = req.session.user ? req.session.user : users[0];
    let handoversList = req.session.handovers ? req.session.handovers : sIDU.setInitialBenefitsAndHandoversData();
    let handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverByIdFromListOfHandovers(handoversList, req.query.id);
    let handoverIndex = commonUtils.findPositionOfObjectInArray(handover.id, handoversList);
    let customer = req.session.customer;
    let handoverNote = req.body['handover-note'];
    let updateResultedFromCustomerContactIndicator = req.body['handover-contact-indicator'];
    let editedHandover = {};
    let editedHandoverNote = {};
    let newHandoverNotes = [];
    let errors = [];
    editedHandover.id = handover.id
    editedHandover.nino = handover.nino;
    editedHandover.raisedByStaffId = handover.raisedByStaffId;
    editedHandover.raisedOnBehalfOfOfficeId = handover.raisedOnBehalfOfOfficeId;
    editedHandover.receivingOfficeId = handover.receivingOfficeId;
    editedHandover.benefitId = req.body['benefit'] || handover.benefitId;
    if (editedHandover.benefitId === "5") {
        editedHandover.benSubType = req.body['benefit-sub'] || handover.benSubType;
    } else {
        editedHandover.benSubType = null;
    }
    editedHandover.typeId = req.body['handover-type'] || handover.typeId;
    editedHandover.reasonId = req.body['handover-reason'] || handover.reasonId;
    editedHandover.callback = req.body['handover-callback'];
    editedHandover.status = req.body['handover-status'] || handover.status;
    editedHandover.dateAndTimeRaised = handover.dateAndTimeRaised;
    editedHandover.targetDateAndTime = handover.targetDateAndTime;

    if (handoverNote === "" || handoverNote === null) {
        newHandoverNotes = handover.notes;
    } else {
        editedHandoverNote.handoverId = handover.id;
        editedHandoverNote.dateNoteAdded = new Date();
        editedHandoverNote.userWhoAddedNote = user.staffId;
        editedHandoverNote.updateResultedFromCustomerContactIndicator = updateResultedFromCustomerContactIndicator;
        editedHandoverNote.noteContent = handoverNote;
        if (handover.notes === null) {
            editedHandoverNote.id = "1";
            let updatedHandoverNote = new HandoverNote(editedHandoverNote);
            newHandoverNotes.push(updatedHandoverNote);
        } else {
            editedHandoverNote.id = handover.notes.length + 1;
            let updatedHandoverNote = new HandoverNote(editedHandoverNote);
            newHandoverNotes = handover.notes;
            newHandoverNotes.unshift(updatedHandoverNote);
        }
    }
    editedHandover.notes = newHandoverNotes;
    handoversList[handoverIndex] = editedHandover;
    req.session.errors = errors;
    req.session.handovers = handoversList;
    req.session.handover = editedHandover;
    req.session.customer = customer;
    res.redirect('/customer/summary?nino=' + editedHandover.nino);

}

module.exports.viewHandoverPage = viewHandoverPage;
module.exports.viewHandoverPageAction = viewHandoverPageAction;
module.exports.createHandoverPage = createHandoverPage;
module.exports.createHandoverPageAction = createHandoverPageAction;
module.exports.editHandoverPage = editHandoverPage;
module.exports.editHandoverPageAction = editHandoverPageAction;
