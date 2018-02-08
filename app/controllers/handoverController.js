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
const callbackData = require('../data/callbackData');

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
    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer = customerUtils.getCustomerByNinoFromListOfCustomers(customers, req.query.nino);
    let handover = {};
    let errors = req.session.errors ?req.session.errors : [];
    if (errors.length !== 0) {
        handover = req.session.invalidHandover;
    } else {
    //     Do nothing
    }
    let initialData = sIDU.setInitialBenefitsAndHandoversData();
    let users = sIDU.setInitialUsersData();
    let user = req.session.user ? req.session.user : users[0];
    let benefitsList = initialData.initialBenefits;
    let handoverTypesList = initialData.initialHandoverTypes;
    let handoverReasonsList = initialData.initialHandoverReasons;
    let handovers = req.session.handovers ? req.session.handovers : initialData.initialHandovers;
    let officesList = sIDU.setInitialOfficesData();
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
        handover : handover,
        benList : benefitsList,
        handTypesList : handoverTypesList,
        handReasonsList : handoverReasonsList,
        customer : customer,
        user : user,
        officeDetails : officeDetails,
        customerOfficeDetails : customerOfficeDetails,
        officesList : officesList,
        officeTypes : officeTypes,
        editOrCreate : editOrCreate,
        errors : errors,
        errorsLength : errors.length
    });

}

function createHandoverPageAction(req, res) {

    let handoversList = req.session.handovers ? req.session.handovers : sIDU.setInitialBenefitsAndHandoversData();
    let customer = req.session.customer;
    let users = sIDU.setInitialUsersData();
    let handoverNote = req.body['handover-note'];
    let messages = [];
    let updateResultedFromCustomerContactIndicator = req.body['handover-contact-indicator'];
    let validatedHandover;
    let newHandover = {};
    let newHandoverDetails;
    let newHandoverNote = {};
    let newHandoversList = handoversList;
    let handover;
    newHandover.id = handoversList.length + 1;
    newHandover.nino = customer.nino;
    newHandover.description = req.body['handover-description'];
    newHandover.raisedByStaffId = '40001001';
    let agent = userUtils.getUserByStaffIdFromListOfUsers(users, newHandover.raisedByStaffId);
    newHandover.raisedOnBehalfOfOfficeId = agent.owningOfficeId;
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
    if (newHandover.callback === "Yes") {
        newHandover.callbackStatus = 1;
    } else {
        newHandover.callbackStatus = 0;
    }
    newHandover.firstCallbackResult = 0;
    newHandover.secondCallbackResult = 0;
    newHandover.thirdCallbackResult = 0;
    newHandover.escalated = req.body['handover-escalated'];
    newHandover.status = "Not allocated";
    newHandover.inQueueOfStaffId = "";
    newHandover.dateAndTimeRaised = new Date();
    newHandover.targetDateAndTime = new Date();
    newHandover.targetDateAndTime.setHours(newHandover.dateAndTimeRaised.getHours() + 3);
    newHandover.notes = [];
    validatedHandover = handoverUtils.validateHandover(newHandover);
    if (handoverNote === "" || handoverNote === null) {
    //     Do nothing
    } else {
        newHandoverNote.id = '1';
        newHandoverNote.handoverId = newHandover.id;
        newHandoverNote.dateNoteAdded = new Date();
        newHandoverNote.userWhoAddedNote = newHandover.raisedByStaffId;
        newHandoverNote.updateResultedFromCustomerContactIndicator = updateResultedFromCustomerContactIndicator;
        newHandoverNote.noteContent = handoverNote;
        validatedHandover.handover.notes.push(new HandoverNote(newHandoverNote));
    }
    handover = new Handover(validatedHandover.handover);
    if (validatedHandover.errors.length === 0) {
        newHandoversList.push(handover);
        req.session.handovers = newHandoversList;
        req.session.handover = handover;
        req.session.invalidHandover = {};
        req.session.errors = [];
        newHandoverDetails = handoverUtils.getHandoverBenefitNameHandoverTypeAndHandoverReason(handover);
        handover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised);
        messages[0] = "Successfully created handover for " + customer.firstName + " " + customer.lastName;
        messages[1] = "Handover raised : " + handover.dateAndTimeRaisedForDisplay.day + " " + handover.dateAndTimeRaisedForDisplay.month +
            " " + handover.dateAndTimeRaisedForDisplay.year + " at " + handover.dateAndTimeRaisedForDisplay.hours + ":" + handover.dateAndTimeRaisedForDisplay.mins;
        messages[2] = "Benefit type : "  + newHandoverDetails.benefitName;
        messages[3] = "Handover type : " + newHandoverDetails.handoverType;
        req.session.messages = messages;
        res.redirect('/customer/summary?nino=' + handover.nino);
    } else {
        req.session.invalidHandover = handover;
        req.session.handover = {};
        req.session.errors = validatedHandover.errors;
        req.session.messages = [];
        res.redirect('/handover/create?nino=' + handover.nino);
    }

}

function editHandoverPage(req, res) {

    let editOrCreate = 'edit';
    let errors = req.session.errors ? req.session.errors : [];
    let initialData = sIDU.setInitialBenefitsAndHandoversData();
    let benefitsList = initialData.initialBenefits;
    let handoverTypesList = initialData.initialHandoverTypes;
    let handoverReasonsList = initialData.initialHandoverReasons;
    let callbackStatusValues = callbackData['callbackStatusValues'];
    let callbackResultValues = callbackData['callbackResultValues'];
    let users = sIDU.setInitialUsersData();
    let handovers = req.session.handovers ? req.session.handovers : initialData.initialHandovers;
    let handover;
    let handoverNotes = [];
    if (errors.length === 0) {
        handover = handoverUtils.getHandoverByIdFromListOfHandovers(handovers, req.query.id);
    } else {
        handover = req.session.invalidHandover;
    }
    let handoverDetails = handoverUtils.getHandoverBenefitNameHandoverTypeAndHandoverReason(handover);
    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer = customerUtils.getCustomerByNinoFromListOfCustomers(customers, handover.nino);
    let officesList = sIDU.setInitialOfficesData();
    let officeTypes = sIDU.setInitialOfficeTypesData();
    let customerOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, customer.customerOfficeId)
    let userWhoRaisedHandover = userUtils.getUserByStaffIdFromListOfUsers(users, handover.raisedByStaffId);
    userWhoRaisedHandover.officeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, userWhoRaisedHandover.owningOfficeId);
    let userOfficeTypeIndex = commonUtils.findPositionOfObjectInArray(userWhoRaisedHandover.officeDetails.officeTypeId, officeTypes);
    userWhoRaisedHandover.officeDetails.officeType = officeTypes[userOfficeTypeIndex].officeType;
    handover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised);
    handover.targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.targetDateAndTime);
    handover.timeLeftToTarget = dateUtils.calcTimeLeftOrTimeOverdue(handover.targetDateAndTime);
    handover.receivingOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, handover.receivingOfficeId);
    let inQueueOfStaffDetails;
    if (handover.inQueueOfStaffId !== "") {
        inQueueOfStaffDetails = userUtils.getUserByStaffIdFromListOfUsers(users, handover.inQueueOfStaffId);
    }
    if (!handover.notes) {
        // Do nothing
    } else {
        for (let i=0; i < handover.notes.length; i++) {
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
    handover.callbackStatusDescription = callbackStatusValues[handover.callbackStatus].callbackStatus;
    handover.firstCallbackResultDescription = callbackResultValues[handover.firstCallbackResult].callbackResult;
    handover.secondCallbackResultDescription = callbackResultValues[handover.secondCallbackResult].callbackResult;
    handover.thirdCallbackResultDescription = callbackResultValues[handover.thirdCallbackResult].callbackResult;

    req.session.customer = customer;
    req.session.customers = customers;
    req.session.handover = handover;
    req.session.handovers = handovers;
    res.render('handover-edit', {
        users : users,
        benList : benefitsList,
        handTypesList : handoverTypesList,
        handReasonsList : handoverReasonsList,
        benefitName : handoverDetails.benefitName,
        handoverType : handoverDetails.handoverType,
        handoverReason : handoverDetails.handoverReason,
        handoverNotes : handoverNotes,
        handoverNotesLength : handoverNotes.length,
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
    let allocatedUser = req.body['handover-allocated-user'];
    let editedHandover = {};
    let editedHandoverNote = {};
    let validatedHandoverAndErrors;
    let validatedHandoverDetails;
    let newHandoverNotes = [];
    let messages = [];
    let dateAndTimeRaisedForDisplay;
    editedHandover.id = handover.id
    editedHandover.nino = handover.nino;
    editedHandover.description = handover.description;
    editedHandover.raisedByStaffId = handover.raisedByStaffId;
    editedHandover.inQueueOfStaffId = allocatedUser ? allocatedUser : handover.inQueueOfStaffId;
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

    if (handover.status === "Cleared" || handover.status === "Withdrawn") {
        editedHandover.callbackStatus = handover.callbackStatus;
        editedHandover.status = handover.status;
        editedHandover.firstCallbackResult = handover.firstCallbackResult;
        editedHandover.secondCallbackResult= handover.secondCallbackResult
        editedHandover.thirdCallbackResult = handover.thirdCallbackResult;
    } else {
        if (editedHandover.callback === "No") {
            editedHandover.callbackStatus = 0;
            editedHandover.firstCallbackResult = 0;
            editedHandover.secondCallbackResult= 0;
            editedHandover.thirdCallbackResult = 0;
        } else {
            if (handover.callback === "No") {               // i.e. callback required used to be "No" but it's been changed to "Yes"
                editedHandover.callbackStatus = 1;
                editedHandover.firstCallbackResult = 0;
                editedHandover.secondCallbackResult = 0;
                editedHandover.thirdCallbackResult = 0;
            } else {                                        // i.e. it used to be "Yes", and its still "Yes", so now need to check if the callbackStatus has changed
                let newCallbackStatusAndResult;
                let newResult = parseInt(req.body['handover-callback-result']);
                let firstCallResult = handover.firstCallbackResult;
                let secondCallResult = handover.secondCallbackResult;
                let thirdCallResult = handover.thirdCallbackResult;
                newCallbackStatusAndResult = getNewCallbackStatusAndResult(handover.callbackStatus, newResult,
                    firstCallResult, secondCallResult, thirdCallResult);
                editedHandover.callbackStatus = newCallbackStatusAndResult.newStatus;
                editedHandover.firstCallbackResult = newCallbackStatusAndResult.newFirst;
                editedHandover.secondCallbackResult = newCallbackStatusAndResult.newSecond;
                editedHandover.thirdCallbackResult = newCallbackStatusAndResult.newThird;
            }
        }
        if (editedHandover.callbackStatus == 4) {
            editedHandover.status = "Cleared";
        } else {
            if (handover.inQueueOfStaffId === "" && editedHandover.inQueueOfStaffId !== "") {
                editedHandover.status = "In progress";
            } else {
                editedHandover.status = req.body['handover-status'] ? req.body['handover-status'] : handover.status;
            }
        }
    }
    if (handover.inQueueOfStaffId === "" && editedHandover.inQueueOfStaffId !== "") { editedHandover.status = "In progress" ;}
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
    req.session.customer = customer;
    validatedHandoverAndErrors = handoverUtils.validateHandover(editedHandover);
    if (validatedHandoverAndErrors.errors.length == 0) {
        handoversList[handoverIndex] = validatedHandoverAndErrors.handover;
        req.session.errors = [];
        dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(validatedHandoverAndErrors.handover.dateAndTimeRaised);
        validatedHandoverDetails = handoverUtils.getHandoverBenefitNameHandoverTypeAndHandoverReason(validatedHandoverAndErrors.handover);
        messages[0] = "Successfully amended handover for " + customer.firstName + " " + customer.lastName;
        messages[1] = "Handover raised : " + dateAndTimeRaisedForDisplay.day + " " + dateAndTimeRaisedForDisplay.month +
            " " + dateAndTimeRaisedForDisplay.year + " at " + dateAndTimeRaisedForDisplay.hours + ":" + dateAndTimeRaisedForDisplay.mins;
        messages[2] = "Benefit type : "  + validatedHandoverDetails.benefitName;
        messages[3] = "Handover type : " + validatedHandoverDetails.handoverType;
        req.session.messages = messages;
        req.session.handovers = handoversList;
        req.session.invalidHandover = {};
        req.session.handover = validatedHandoverAndErrors.handover;
        res.redirect('/customer/summary?nino=' + validatedHandoverAndErrors.handover.nino);
    } else {
        req.session.invalidHandover = validatedHandoverAndErrors.handover;
        req.session.errors = validatedHandoverAndErrors.errors;
        req.session.handover = {};
        req.session.messages = [];
        res.redirect('/handover/edit?id=' + validatedHandoverAndErrors.handover.id);
    }
}

function getNewCallbackStatusAndResult(currentCallbackStatus, newResult, firstCallResult, secondCallResult, thirdCallResult) {

    let newStatus;
    let newFirst;
    let newSecond;
    let newThird;

    if (newResult == 0) {
        newStatus = currentCallbackStatus;
        newFirst = firstCallResult;
        newSecond = secondCallResult;
        newThird = thirdCallResult;
    } else {
        if (currentCallbackStatus == 1) {    //    First call pending
            newSecond = 0;                     //      Second callback result should remain empty
            newThird = 0;                      //      Third callback result should remain empty
            if (newResult == 1) {            //      Result recorded as successful
                newStatus = 4;                //          Callback status = complete
                newFirst = 1;                 //          Record first callback as successful
            } else {                            //      Result recorded must be 2, 3 or 4 (failure)
                newStatus = 2;                 //          Second call pending, because first call failed
                newFirst = newResult;         //          First call result recorded as relevant fail value (i.e. newResult)
            }
        }
        if (currentCallbackStatus == 2) {    //    Second call pending
            newFirst = firstCallResult;         //      Keep first callback result
            newThird = 0;                      //      Third callback result should remain empty
            if (newResult == 1) {            //      Result recorded as successful
                newStatus = 4;                //          Callback status = complete
                newSecond = 1;                //          Record second callback as successful
            } else {                            //      New result must be 2, 3 or 4 (failure)
                newStatus = 3                 //          Third call pending, because second call failed
                newSecond = newResult;          //          Second call result recorded as relevant fail value (i.e. newResult)
            }
        }
        if (currentCallbackStatus == 3) {    //    Third call pending
            newFirst = firstCallResult;         //      Keep first callback result the same
            newSecond = secondCallResult;       //      Keep second callback result the same
            newStatus = 4;                    //      New status = complete whether third call is success or fail
            if (newResult == 1) {            //      Result recorded as successful
                newThird = 1;                 //          Record third callback as successful
            } else {                            //      New result must be 2, 3 or 4 (failure)
                newThird = newResult;          //          Third call result recorded as relevant fail value (i.e. newResult)
            }
        }
    }
    return {
        "newStatus" : newStatus,
        "newFirst" : newFirst,
        "newSecond" : newSecond,
        "newThird" : newThird
    }
}

module.exports.viewHandoverPage = viewHandoverPage;
module.exports.viewHandoverPageAction = viewHandoverPageAction;
module.exports.createHandoverPage = createHandoverPage;
module.exports.createHandoverPageAction = createHandoverPageAction;
module.exports.editHandoverPage = editHandoverPage;
module.exports.editHandoverPageAction = editHandoverPageAction;
