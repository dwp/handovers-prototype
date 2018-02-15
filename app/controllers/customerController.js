const _ = require('lodash');
const Customer = require('../models/Customer.model');
const sIDU = require('../utils/setInitialDataUtils');
const officeUtils = require('../utils/officeUtils');
const customerUtils = require('../utils/customerUtils');
const dateUtils = require('../utils/dateUtils');
const handoverUtils = require('../utils/handoverUtils');
const userUtils = require('../utils/userUtils');
const callbackData = require('../data/callbackData.json');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Customer Controllers
/*
/*    Throughout these controller functions, if all input data for an individual customer is valid then a Customer
/*    object is created. If it is not valid then a generic object is created while errors are being handled. Once all
/*    errors have been cleared, then a Customer object is created.
/*
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function customerFindPage(req, res) {

    res.render('customer-find');
}

function customerFindPageAction(req, res) {

    let customersList = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let inputNino = req.body.nino ? req.body.nino : "AA123456B";
    let customer = customerUtils.getCustomerByNinoFromListOfCustomers(customersList, inputNino);
    if (!customer.firstName) {
        res.render('customer_search_results', customer);
    } else {
        req.session.customer = customer;
        res.redirect('/customer/summary');
    }
}

function customerViewPage(req, res) {

    let officesList = sIDU.setInitialOfficesData();
    let customersList = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer;
    if(req.query.nino) {
        customer = customerUtils.getCustomerByNinoFromListOfCustomers(customersList, req.query.nino);
    } else {
        customer = req.session.customer ? req.session.customer : customersList[0];
    }
    let customerOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, customer.customerOfficeId);
    let customerDobForDisplay = dateUtils.formatDateForDisplay(customer.dob);
    customer.birthDay = customerDobForDisplay.day;
    customer.birthMonth = customerDobForDisplay.month;
    customer.birthYear = customerDobForDisplay.year;
    res.render('customer', {
        customer : customer,
        customerOfficeDetails : customerOfficeDetails
    });
}

function customerSummaryPage(req, res) {

    let officesList = sIDU.setInitialOfficesData();
    let customersList = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let users = sIDU.setInitialUsersData();
    let messages = req.session.messages ? req.session.messages : [];
    let messagesLength = messages.length;
    let errors = req.session.errors ? req.session.errors : [];
    let handovers = req.session.handovers ? req.session.handovers : sIDU.setInitialHandoversData();
    let callbackStatusValues = callbackData['callbackStatusValues'];
    let customer;
    let handoversList = [];
    let sortedHandoversList;
    if (errors.length === 0) {
        if(req.query.nino) {
            customer = customerUtils.getCustomerByNinoFromListOfCustomers(customersList, req.query.nino);
        } else {
            customer = req.session.customer ? req.session.customer : customersList[0];
        }
    } else {
        customer = req.session.invalidCustomer;
    }
    let customerOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, customer.customerOfficeId);
    let customerDobForDisplay = dateUtils.formatDateForDisplay(customer.dob);

    for (let i=0; i < handovers.length; i++) {
        let handover = handovers[i];
        if (handover.nino === customer.nino) {
            let handoverDetails = handoverUtils.getHandoverBenefitNameHandoverTypeAndHandoverReason(handover);
            handover.receivingOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, handover.receivingOfficeId);
            handover.inQueueOfStaffDetails = userUtils.getUserByStaffIdFromListOfUsers(users, handover.inQueueOfStaffId);
            handover.handoverDetails = handoverDetails;
            handover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised);
            handover.targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.targetDateAndTime);
            handover.dateRaised = (handover.dateAndTimeRaisedForDisplay.day + " " + handover.dateAndTimeRaisedForDisplay.month + " " + handover.dateAndTimeRaisedForDisplay.year);
            handover.timeRaised = (handover.dateAndTimeRaisedForDisplay.hours + ":" + handover.dateAndTimeRaisedForDisplay.mins);
            handover.targetDate = (handover.targetDateAndTimeForDisplay.day + " " + handover.targetDateAndTimeForDisplay.month + " " + handover.targetDateAndTimeForDisplay.year);
            handover.targetTime = (handover.targetDateAndTimeForDisplay.hours + ":" + handover.targetDateAndTimeForDisplay.mins);
            handover.timeLeftToTarget = dateUtils.calcTimeLeftOrTimeOverdue(handover.targetDateAndTime);
            handover.callbackStatusDescription = callbackStatusValues[handover.callbackStatus].callbackStatus;
            handoversList.push(handover);
        }
    }
    sortedHandoversList = _.sortBy(handoversList, ['timeLeftToTarget.timeToTarget']);
    customer.birthDay = customerDobForDisplay.day;
    customer.birthMonth = customerDobForDisplay.month;
    customer.birthYear = customerDobForDisplay.year;
    req.session.messages = [];
    req.session.customer = customer;
    res.render('customer-summary', {
        messages : messages,
        messagesLength : messagesLength,
        customer : customer,
        customerOfficeDetails : customerOfficeDetails,
        handoversList : sortedHandoversList,
        errors : errors,
        errorsLength : errors.length
    });
}

function customerCreatePage(req, res) {

    let editOrCreate = 'create';
    let errors = req.session.errors ? req.session.errors : [];
    let officesList = sIDU.setInitialOfficesData();
    let customer = {};
    if (errors.length !== 0) {
        customer = req.session.invalidCustomer;
    } else {
        customer.nino = req.query.nino ? req.query.nino : "AB987654C";
    }
    res.render('customer-edit', {customer : customer,
                                 officesList : officesList,
                                 editOrCreate : editOrCreate,
                                 errors : errors,
                                 errorsLength : errors.length
                                }
    );
}

function customerCreatePageAction(req, res) {

    let foundCustomer;
    if (req.body['nino'] === "") {
        errorsOut.push({
            message : "National insurance number must be entered",
            field : "nino"});
    } else {
        foundCustomer = findIfCustomerNinoAlreadyExists(req, req.body['nino']);
        if (foundCustomer.customerFound == 1) {
            errorsOut.push({
                message: "National insurance number already exists",
                field: "nino"
            });
        }
    }
    let customersList = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer;
    let newCustomer = {};
    let validatedCustomer;
    let messages = [];
    newCustomer.nino = req.body['nino'];
    newCustomer.postcode = req.body['postcode'];
    newCustomer.firstName = req.body['firstName'];
    newCustomer.lastName = req.body['lastName'];
    newCustomer.customerOfficeId = req.body['customer-office'];
    newCustomer.preferredContactNumber = req.body['prefContNum'];
    newCustomer.emailAddress = req.body['emailAddr'];
    newCustomer.welshSpeaker = req.body['welsh-speaker'];
    newCustomer.translator = req.body['translator'];
    newCustomer.language = req.body['language'];
    newCustomer.approvedRep = req.body['approved-rep'];
    newCustomer.approvedRepType = req.body['rep-type'];
    newCustomer.approvedRepName = req.body['rep-name'];
    newCustomer.approvedRepContact = req.body['rep-contact'];
    newCustomer.birthDay = parseInt(req.body['birthDay']);
    newCustomer.birthMonth = parseInt(req.body['birthMonth']);
    newCustomer.birthYear = parseInt(req.body['birthYear']);
    validatedCustomer = customerUtils.validateCustomer(newCustomer);
    if (validatedCustomer.errors.length === 0) {
        customer = new Customer(validatedCustomer.customer);
        req.session.customer = customer;
        customersList.push(customer);
        req.session.customers = customersList;
        req.session.invalidCustomer = {};
        req.session.errors = [];
        messages[0] = "Successfully saved details for : " + customer.nino;
        messages[1] = "Full name : " + customer.firstName + " " + customer.lastName;
        messages[2] = "More details below";
        req.session.messages = messages;
        res.redirect('/customer/summary');
    } else {
        req.session.invalidCustomer = validatedCustomer.customer;
        req.session.errors = validatedCustomer.errors;
        req.session.messages = [];
        res.redirect('/customer/create');
    }
}

function customerEditPage(req, res) {

    let editOrCreate = 'edit';
    let errors = req.session.errors ? req.session.errors : [];
    let officesList = sIDU.setInitialOfficesData();
    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer = {};
    if (errors.length === 0) {
        if(req.query.nino) {
            customer = customerUtils.getCustomerByNinoFromListOfCustomers(customers, req.query.nino);
        } else {
            customer = req.session.customer ? req.session.customer : customers[0];
        }
        let customerDobForDisplay = dateUtils.formatDateForDisplay(customer.dob);
        customer.birthDay = customerDobForDisplay.day;
        customer.birthMonth = customerDobForDisplay.numericMonth;
        customer.birthYear = customerDobForDisplay.year;
    } else {
        customer = req.session.invalidCustomer;
    }
    let customerOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, customer.customerOfficeId);
    res.render('customer-edit', { customer : customer,
                                  customerOfficeDetails : customerOfficeDetails,
                                  officesList : officesList,
                                  editOrCreate : editOrCreate,
                                  errors : errors,
                                  errorsLength : errors.length
        }
    );
}

function customerEditPageAction(req, res) {

    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer = req.session.customer ? req.session.customer : customers[0];
    let editedCustomer = req.session.editedCustomer ? req.session.editedCustomer : new Object();
    let year = req.body['birthYear'];
    let month = req.body['birthMonth'];
    let day = req.body['birthDay'];
    let errorsOut = [];
    let foundCustomer;

    // If there is already an edited customer in the session (i.e. this customer was previously edited with errors)
    //      - check if a nino has been entered - if not, push message that nino is required and move to next field
    //      - nino is not empty; check if nino entered already exists in database - if not, allow nino and move to next field
    //      - nino is not empty and is already in the database; check if nino has been altered back to the original nino
    //              - if has been altered to original value, allow nino and move to next field
    //              - if has not been altered to original value, output error about uniqueness of ninos and move to next field

    if (req.body['nino'] === "") {
        errorsOut.push({
            message : "National insurance number must be entered",
            field : "nino"});
    } else {
        foundCustomer = findIfCustomerNinoAlreadyExists(req, req.body['nino']);
        if (foundCustomer.customerFoundIndicator == 0) {
            // Do nothing
        } else {
            if (req.body['nino'] === customer.nino) {
                console.log("Nino is for customer being edited. No error");
            } else {
                errorsOut.push({
                    message: "National insurance number already exists",
                    field: "nino"
                });
            }
        }
    }

    editedCustomer.nino = req.body['nino'];
    let validatedCustomer;
    let messages = [];
    editedCustomer.customerOfficeId = req.body['customer-office'];
    editedCustomer.nino = req.body['nino'];
    editedCustomer.postcode = req.body['postcode'];
    editedCustomer.firstName = req.body['firstName'];
    editedCustomer.lastName = req.body['lastName'];
    editedCustomer.customerOfficeId = req.body['customer-office'];
    editedCustomer.preferredContactNumber = req.body['prefContNum'];
    editedCustomer.emailAddress = req.body['emailAddr'];
    editedCustomer.welshSpeaker = req.body['welsh-speaker'];
    editedCustomer.translator = req.body['translator'];
    editedCustomer.language = req.body['language'];
    editedCustomer.approvedRep = req.body['approved-rep'];
    editedCustomer.approvedRepType = req.body['rep-type'];
    editedCustomer.approvedRepName = req.body['rep-name'];
    editedCustomer.approvedRepContact = req.body['rep-contact'];
    editedCustomer.birthDay = parseInt(req.body['birthDay']);
    editedCustomer.birthMonth = parseInt(req.body['birthMonth']);
    editedCustomer.birthYear = parseInt(req.body['birthYear']);
    validatedCustomer = customerUtils.validateCustomer(editedCustomer);
    if (validatedCustomer.errors.length === 0) {
        customer = validatedCustomer.customer;
        req.session.customer = customer;
        customersList.push(customer);
        req.session.customers = customersList;
        req.session.invalidCustomer = {};
        req.session.errors = [];
        messages[0] = "Successfully amended details for : " + customer.nino;
        messages[1] = "Full name : " + customer.firstName + " " + customer.lastName;
        req.session.messages = messages;
        res.redirect('/customer/summary');
    } else {
        editedCustomer.birthDay = day;
        editedCustomer.birthMonth = month;
        editedCustomer.birthYear = year;
        req.session.editedCustomer = editedCustomer;
        req.session.customer = customer;
        req.session.errors = errorsOut;
        res.redirect('/customer/edit');
    }
}

function findIfCustomerNinoAlreadyExists (req, nino) {
    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let inputNino = nino;
    let foundCustomer = {};
    let customerFoundIndicator = 0;
    if (inputNino === '') {
        console.log('Nino not input');
    } else {
        for (let i=0; i < customers.length; i++) {
            if (customers[i].nino === inputNino) {
                foundCustomer = customers[i];
                customerFoundIndicator = 1;
            }
        }
    }

    return { customer : foundCustomer, customerFound : customerFoundIndicator};
}

module.exports.customerFindPage = customerFindPage;
module.exports.customerFindPageAction = customerFindPageAction;
module.exports.customerViewPage = customerViewPage;
module.exports.customerSummaryPage = customerSummaryPage;
module.exports.customerCreatePage = customerCreatePage;
module.exports.customerCreatePageAction = customerCreatePageAction;
module.exports.customerEditPage = customerEditPage;
module.exports.customerEditPageAction = customerEditPageAction;