const sIDU = require('../utils/setInitialDataUtils');
const officeUtils = require('../utils/officeUtils');
const customerUtils = require('../utils/customerUtils');
const dateUtils = require('../utils/dateUtils');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Customer Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function customerFindPage(req, res) {

    res.render('customer-find');
}

function customerFindPageAction(req, res) {

    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let inputNino = req.body.nino;
    let customer = {};
    let customerFound = 0;
    if (inputNino === '') {
        console.log('Nino not input');
    } else {
        for (let i=0; i < customers.length; i++) {
            if (customers[i].nino === inputNino) {
                customer = customers[i];
                customerFound = 1;
            }
        }
    }
    if (customerFound === 0) {
        customer.nino = inputNino;
        res.render('customer_search_results', customer);
    } else {
        req.session.customer = customer;
        res.redirect('/customer/view');
    }
}

function customerViewPage(req, res) {

    let officesList = sIDU.setInitialOfficesData();
    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let errorsIn = req.session.errors ? req.session.errors : [];
    let customer;
    if (errorsIn.length === 0) {
        if(req.query.nino) {
            customer = customerUtils.getCustomerByNinoFromListOfCustomers(customers, req.query.nino);
        } else {
            customer = req.session.customer ? req.session.customer : customers[0];
        }
        let displayDate = dateUtils.formatDateAndTimeForDisplay(customer.dob);
        customer.birthDay = parseInt(displayDate.day);
        customer.birthMonth = displayDate.month;
        customer.birthYear = parseInt(displayDate.year);
    } else {
        if(req.session.editedCustomer) {
            customer = req.session.editedCustomer;
        } else {
            customer = req.session.newCustomer;
        }
    }
    let customerOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, customer.customerOfficeId);
    res.render('customer', {
        customer : customer,
        customerOfficeDetails : customerOfficeDetails,
        errors : errorsIn,
        errorsLength : errorsIn.length
    });
}

function customerCreatePage(req, res) {

    let editOrCreate = 'create';
    let errorsIn = req.session.errors ? req.session.errors : [];
    let officesList = sIDU.setInitialOfficesData();
    let customer = {};

    //   If there is a newCustomer session object it is because there were errors in data input previously during
    //   customer create. It holds the previously-input data that has not been stored in the session customer
    //   object because it contains errors, but is needed to be re-displayed in the customer create page.
    //   If there is not a newCustomer session object, use the nino that was passed in with the url, or a default
    //   if no nino was passed in.

    if (req.session.newCustomer) {
        customer = req.session.newCustomer;
    } else {
        customer.nino = req.query.nino ? req.query.nino : "AB987654C";
    }
    res.render('customer-edit', {customer : customer,
                                 officesList : officesList,
                                 editOrCreate : editOrCreate,
                                 errors : errorsIn,
                                 errorsLength : errorsIn.length
                                }
    );
}

function customerCreatePageAction(req, res) {

    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let newCustomer = new Object();
    let year = req.body['birthYear'];
    let month = req.body['birthMonth'];
    let day = req.body['birthDay'];
    let currentYear = new Date().getFullYear();
    let errorsOut = [];
    newCustomer.nino = req.body['nino'];
    if (req.body['customer-office'] === ""){
        errorsOut.push({
            message : "Home jobcentre must be selected from dropdown list",
            field : "customer-office"});
    } else {
        newCustomer.customerOfficeId = req.body['customer-office'];
    }
    if (req.body['firstName'] === "") {
        errorsOut.push({
            message : "First name must be entered",
            field : "firstName"});
    } else {
        newCustomer.firstName = req.body['firstName'];
    }
    if (req.body['lastName'] === "") {
        errorsOut.push({
            message : "Last name must be entered",
            field : "lastName"});
    } else {
        newCustomer.lastName = req.body['lastName'];
    }
    if (!day || day < 1 || day > 31 || !month || month < 1 || month > 12 || !year || year < 1900 || year > currentYear) {
        errorsOut.push({
            message : "Date of birth must be in valid format and within valid range",
            field : "birth-date-group"});
        if (!day || day < 1 || day > 31) {
            errorsOut.push({
                message : "......day of birth must be from 1 to 31",
                field : "birthDay"});
        }
        if (!month || month < 1 || month > 12) {
            errorsOut.push({
                message : "......month of birth must be from 1 to 12",
                field : "birthMonth"});
        }
        if (!year || year < 1900 || year > currentYear) {
            errorsOut.push({
                message : ("......year of birth must be between 1900 and " + currentYear),
                field : "birthYear"});
        }
    }
    if (req.body['postcode'] === "") {
        errorsOut.push({
            message : "Postcode must be entered",
            field : "postcode"});
    } else {
        newCustomer.postcode = req.body['postcode'];
    }
    newCustomer.preferredContactNumber = req.body['prefContNum'];
    newCustomer.emailAddress = req.body['emailAddr'];
    newCustomer.welshSpeaker = req.body['welsh-speaker'];
    newCustomer.translator = req.body['translator'];
    if (newCustomer.translator === "No") {
            newCustomer.language = '';
        } else {
            newCustomer.language = req.body['language'];
            if (req.body['language'] === "") {
                errorsOut.push({
                    message : "Enter a language , or select No for Translator reqd",
                    field : 'language'});
            }
        }
    newCustomer.approvedRep = req.body['approved-rep'];
    if (newCustomer.approvedRep === "Yes") {
            newCustomer.approvedRepName = req.body['rep-name'];
            newCustomer.approvedRepContact = req.body['rep-contact'];
            if (req.body['rep-name'] === "" || req.body['rep-contact'] === "") {
                errorsOut.push({
                    message : "Enter both name and contact details for approved representative, or select No",
                    field : ""});
                if (req.body['rep-name'] === "") {
                    errorsOut.push({
                        message : "         .....name must be entered",
                        field : "rep-name"});
                }
                if (req.body['rep-contact'] === "") {
                    errorsOut.push({
                        message : "         .....contact details must be entered",
                        field : "rep-contact"});
                }
            }
    } else {
        newCustomer.approvedRepName = "";
        newCustomer.approvedRepContact = "";
    }
    if (errorsOut.length === 0) {
        newCustomer.dob = new Date(year + '-' + month + '-' + day);
        req.session.customer = newCustomer;
        customers.push(newCustomer);
        req.session.customers = customers;
        req.session.errors = [];
        res.redirect('/customer/view');
    } else {
        newCustomer.birthDay = day;
        newCustomer.birthMonth = month;
        newCustomer.birthYear = year;
        req.session.newCustomer = newCustomer;
        req.session.errors = errorsOut;
        res.redirect('/customer/create');
    }
}

function customerEditPage(req, res) {

    let editOrCreate = 'edit';
    let errorsIn = req.session.errors ? req.session.errors : [];
    let officesList = sIDU.setInitialOfficesData();
    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer;
    if (errorsIn.length === 0) {
        if(req.query.nino) {
            customer = customerUtils.getCustomerByNinoFromListOfCustomers(customers, req.query.nino);
        } else {
            customer = req.session.customer ? req.session.customer : customers[0];
        }
        let displayDate = dateUtils.formatDateAndTimeForDisplay(customer.dob);
        customer.birthDay = parseInt(displayDate.day);
        customer.birthMonth = displayDate.numericMonth;
        customer.birthYear = parseInt(displayDate.year);
    } else {
        customer = req.session.editedCustomer;
    }
    let customerOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, customer.customerOfficeId);
    req.session.customer = customer;
    res.render('customer-edit', { customer : customer,
                                  customerOfficeDetails : customerOfficeDetails,
                                  editOrCreate : editOrCreate,
                                  errors : errorsIn,
                                  errorsLength : errorsIn.length
        }
    );
}

function customerEditPageAction(req, res) {

    let customers = req.session.customers ? req.session.customers : sIDU.setInitialCustomersData();
    let customer = req.session.customer;
    let editedCustomer = new Object();
    let year = req.body['birthYear'];
    let month = req.body['birthMonth'];
    let day = req.body['birthDay'];
    let errorsOut = [];
    let currentYear = new Date().getFullYear();
    editedCustomer.nino = customer.nino;
    editedCustomer.customerOfficeId = req.body['customer-office'];
    if (req.body['firstName'] === "") {
        errorsOut.push({
            message : "First name must be entered",
            field : "firstName"});
    } else {
        editedCustomer.firstName = req.body['firstName'];
    }
    if (req.body['lastName'] === "") {
        errorsOut.push({
            message : "Last name must be entered",
            field : "lastName"});
    } else {
        editedCustomer.lastName = req.body['lastName'];
    }
    if (!day || day < 1 || day > 31 || !month || month < 1 || month > 12 || !year || year < 1900 || year > currentYear) {
        errorsOut.push({
            message : "Date of birth must be in a valid format and within valid range",
            field : "birth-date-group"});
        if (!day || day < 1 || day > 31) {
            errorsOut.push({
                message : "......day of birth must be from 1 to 31",
                field : "birthDay"});
        }
        if (!month || month < 1 || month > 12) {
            errorsOut.push({
                message : "......month of birth must be from 1 to 12",
                field : "birthMonth"});
        }
        if (!year || year < 1900 || year > currentYear) {
            errorsOut.push({
                message : ("......year of birth must be between 1900 and " + currentYear),
                field : "birthYear"});
        }
    }
    if (req.body['postcode'] === "") {
        errorsOut.push({
            message : "Postcode must be entered",
            field : "postcode"});
    } else {
        editedCustomer.postcode = req.body['postcode'];
    }
    editedCustomer.preferredContactNumber = req.body['prefContNum'];
    editedCustomer.emailAddress = req.body['emailAddr'];
    editedCustomer.welshSpeaker = req.body['welsh-speaker'];
    editedCustomer.translator = req.body['translator'];
    if (editedCustomer.translator === "No") {
        editedCustomer.language = '';
    } else {
        editedCustomer.language = req.body['language'];
        if (req.body['language'] === "") {
            errorsOut.push({
                message : "Enter a language , or select No for Translator reqd",
                field : 'language'});
        }
    }
    editedCustomer.approvedRep = req.body['approved-rep'];
    if (editedCustomer.approvedRep === "Yes") {
            editedCustomer.approvedRepName = req.body['rep-name'];
            editedCustomer.approvedRepContact = req.body['rep-contact'];
            if (req.body['rep-name'] === "" || req.body['rep-contact'] === "") {
                errorsOut.push({
                    message : "Enter both name and contact details for approved representative, or select No",
                    field : ""});
                if (req.body['rep-name'] === "") {
                    errorsOut.push({
                        message : "......name must be entered",
                        field : "rep-name"});
                }
                if (req.body['rep-contact'] === "") {
                    errorsOut.push({
                        message : "......contact details must be entered",
                        field : "rep-contact"});
                }
            }
    } else {
        editedCustomer.approvedRepName = "";
        editedCustomer.approvedRepContact = "";
    }
    if (errorsOut.length === 0) {
        editedCustomer.dob = new Date(year + '-' + month + '-' + day);
        req.session.customer = editedCustomer;
        customers.push(editedCustomer);
        req.session.customers = customers;
        req.session.errors = errorsOut;
        res.redirect('/customer/view');
    } else {
        editedCustomer.birthDay = day;
        editedCustomer.birthMonth = month;
        editedCustomer.birthYear = year;
        req.session.editedCustomer = editedCustomer;
        req.session.errors = errorsOut;
        res.redirect('/customer/edit');
    }
}

module.exports.customerFindPage = customerFindPage;
module.exports.customerFindPageAction = customerFindPageAction;
module.exports.customerViewPage = customerViewPage;
module.exports.customerCreatePage = customerCreatePage;
module.exports.customerCreatePageAction = customerCreatePageAction;
module.exports.customerEditPage = customerEditPage;
module.exports.customerEditPageAction = customerEditPageAction;