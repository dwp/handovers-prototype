const sIDU = require('../utils/setInitialDataUtils');
const officeUtils = require('../utils/officeUtils');
const customerUtils = require('../utils/customerUtils');
const dateUtils = require('../utils/dateUtils');
const handoverUtils = require('../utils/handoverUtils');
const Customer = require('../models/Customer.model');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Customer Controllers
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
    let errorsIn = req.session.errors ? req.session.errors : [];
    let handovers = req.session.handovers ? req.session.handovers : sIDU.setInitialHandoversData();
    let customer;
    let handoversList = [];
    if (errorsIn.length === 0) {
        if(req.query.nino) {
            customer = customerUtils.getCustomerByNinoFromListOfCustomers(customersList, req.query.nino);
        } else {
            customer = req.session.customer ? req.session.customer : customersList[0];
        }

    } else {
        customer = req.session.invalidCustomer;
    }
    for (let i=0; i < handovers.length; i++) {
        let handover = handovers[i];
        if (handover.nino === customer.nino) {
            let handoverTextDetails = handoverUtils.getHandoverDetails(handover);;
            handover.handoverTextDetails = handoverTextDetails;
            handover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised);
            handoversList.push(handover);
        }
    }
    let customerOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, customer.customerOfficeId);
    let customerDobForDisplay = dateUtils.formatDateForDisplay(customer.dob);
    customer.birthDay = customerDobForDisplay.day;
    customer.birthMonth = customerDobForDisplay.month;
    customer.birthYear = customerDobForDisplay.year;
    res.render('customer-summary', {
        customer : customer,
        customerOfficeDetails : customerOfficeDetails,
        handoversList : handoversList,
        errors : errorsIn,
        errorsLength : errorsIn.length
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

    let customersList = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer;
    let newCustomer = {};
    let validatedCustomer;
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
    newCustomer.approvedRepName = req.body['rep-name'];
    newCustomer.approvedRepContact = req.body['rep-contact'];
    validatedCustomer = customerUtils.validateCustomer(req, newCustomer);
    if (validatedCustomer.errors.length === 0) {
        customer = new Customer(validatedCustomer.customer);
        req.session.customer = customer;
        customersList.push(customer);
        req.session.customers = customersList;
        req.session.invalidCustomer = {};
        req.session.errors = [];
        res.redirect('/customer/summary');
    } else {
        req.session.invalidCustomer = validatedCustomer.customer;
        req.session.errors = validatedCustomer.errors;
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
                                  editOrCreate : editOrCreate,
                                  errors : errors,
                                  errorsLength : errors.length
        }
    );
}

function customerEditPageAction(req, res) {

    let customersList = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer;
    let editedCustomer = {};
    let validatedCustomer;
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
    editedCustomer.approvedRepName = req.body['rep-name'];
    editedCustomer.approvedRepContact = req.body['rep-contact'];
    validatedCustomer = customerUtils.validateCustomer(req, editedCustomer);
    if (validatedCustomer.errors.length === 0) {
        customer = new Customer(validatedCustomer.customer);
        req.session.customer = customer;
        customersList.push(customer);
        req.session.customers = customersList;
        req.session.invalidCustomer = {};
        req.session.errors = [];
        res.redirect('/customer/summary');
    } else {
        req.session.invalidCustomer = validatedCustomer.customer;
        req.session.errors = validatedCustomer.errors;
        res.redirect('/customer/edit');
    }
}

module.exports.customerFindPage = customerFindPage;
module.exports.customerFindPageAction = customerFindPageAction;
module.exports.customerViewPage = customerViewPage;
module.exports.customerSummaryPage = customerSummaryPage;
module.exports.customerCreatePage = customerCreatePage;
module.exports.customerCreatePageAction = customerCreatePageAction;
module.exports.customerEditPage = customerEditPage;
module.exports.customerEditPageAction = customerEditPageAction;