const Customer = require('../models/Customer.model');

function getCustomerByNinoFromListOfCustomers(customersList, nino) {

    let customer = {};
    let customerFound = 0;
    for (let i=0; i < customersList.length; i++) {
        if (customersList[i].nino == nino) {
            customer = customersList[i];
            customerFound = 1;
        }
    }
    if (customerFound === 0) {
        customer.nino = nino;
    }
    return new Customer(customer);

}

function validateCustomer(inputCustomer) {

    let day = inputCustomer.birthDay;
    let month = inputCustomer.birthMonth;
    let year = inputCustomer.birthYear;
    let currentYear = new Date().getFullYear();
    let customer = {};
    let validatedCustomer;
    let errors = [];
    customer.nino = inputCustomer.nino;
    if (inputCustomer.postcode === "") {
        errors.push({
            message: "Postcode must be entered",
            field: "postcode"
        });
    } else {
        customer.postcode = inputCustomer.postcode;
    }
    if (inputCustomer.firstName === "") {
        errors.push({
            message : "First name must be entered",
            field : "firstName"});
    } else {
        customer.firstName = inputCustomer.firstName;
    }
    if (inputCustomer.lastName === "") {
        errors.push({
            message : "Last name must be entered",
            field : "lastName"});
    } else {
        customer.lastName = inputCustomer.lastName;
    }
    if (inputCustomer.customerOfficeId === "") {
        errors.push({
            message : "Home jobcentre must be selected from dropdown list",
            field : "customer-office"});
    } else {
        customer.customerOfficeId = inputCustomer.customerOfficeId;
    }
    customer.birthDay = day;
    customer.birthMonth = month;
    customer.birthYear= year;
    if (!day || day < 1 || day > 31 || !month || month < 1 || month > 12 || !year || year < 1900 || year > currentYear) {
        errors.push({
            message : "Date of birth must be in valid format and within valid range",
            field : "birth-date-group"});
        if (!day || day < 1 || day > 31) {
            errors.push({
                message : "......day of birth must be from 1 to 31",
                field : "birthDay"});
        }
        if (!month || month < 1 || month > 12) {
            errors.push({
                message : "......month of birth must be from 1 to 12",
                field : "birthMonth"});
        }
        if (!year || year < 1900 || year > currentYear) {
            errors.push({
                message : ("......year of birth must be between 1900 and " + currentYear),
                field : "birthYear"});
        }
    } else {
        customer.dob = new Date(year + '-' + month + '-' + day);
    }
    customer.translator = inputCustomer.translator;
    if (inputCustomer.translator === "No") {
        customer.language = "";
    } else {
        if (inputCustomer.language === "") {
            errors.push({
                message: "Enter a language , or select No for Translator reqd",
                field: 'language'
            });
        } else {
            customer.language = inputCustomer.language;
        }
    }
    customer.approvedRep = inputCustomer.approvedRep;
    if (inputCustomer.approvedRep === "Yes") {
        if (inputCustomer.approvedRepType == 0 || inputCustomer.approvedRepName === "" || inputCustomer.approvedRepContact === "") {
            errors.push({
                message : "Enter type, name, and contact details for customer representative, or select No",
                field : ""});
            if (inputCustomer.approvedRepType == 0) {
                errors.push({
                    message : "         .....type must be entered",
                    field : "rep-type"});
            } else {
                customer.approvedRepType = inputCustomer.approvedRepType;
            }
            if (inputCustomer.approvedRepName === "") {
                errors.push({
                    message : "         .....name must be entered",
                    field : "rep-name"});
            } else {
                customer.approvedRepName = inputCustomer.approvedRepName;
            }
            if (inputCustomer.approvedRepContact === "") {
                errors.push({
                    message : "         .....contact details must be entered",
                    field : "rep-contact"});
            } else {
                customer.approvedRepContact= inputCustomer.approvedRepContact;
            }
        } else {
            customer.approvedRepType = inputCustomer.approvedRepType;
            customer.approvedRepName = inputCustomer.approvedRepName;
            customer.approvedRepContact= inputCustomer.approvedRepContact;
        }
    } else {
        customer.approvedRepType = "";
        customer.approvedRepName = "";
        customer.approvedRepContact = "";
    }

    customer.preferredContactNumber = inputCustomer.preferredContactNumber;
    customer.emailAddress = inputCustomer.emailAddress;
    customer.welshSpeaker = inputCustomer.welshSpeaker;

    validatedCustomer = {
        "customer" : customer,
        "errors" : errors
    };

    return validatedCustomer;

}

module.exports.getCustomerByNinoFromListOfCustomers = getCustomerByNinoFromListOfCustomers;
module.exports.validateCustomer = validateCustomer;