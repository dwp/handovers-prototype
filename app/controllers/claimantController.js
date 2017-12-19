const sIDU = require('../utils/setInitialDataUtils');
const officeUtils = require('../utils/officeUtils');
const claimantUtils = require('../utils/claimantUtils');
const dateUtils = require('../utils/dateUtils');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Claimant Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function claimantFindPage(req, res) {

    res.render('claimant-find');
}

function claimantFindPageAction(req, res) {

    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let inputNino = req.body.nino;
    let claimant = {};
    let claimantFound = 0;
    if (inputNino === '') {
        console.log('Nino not input');
    } else {
        for (let i=0; i < claimants.length; i++) {
            if (claimants[i].nino === inputNino) {
                claimant = claimants[i];
                claimantFound = 1;
            }
        }
    }
    if (claimantFound === 0) {
        claimant.nino = inputNino;
        res.render('claimant_search_results', claimant);
    } else {
        req.session.claimant = claimant;
        res.redirect('/claimant/view');
    }
}

function claimantViewPage(req, res) {

    let officesList = sIDU.setInitialOfficesData();
    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let errorsIn = req.session.errors ? req.session.errors : [];
    let claimant;
    if (errorsIn.length === 0) {
        if(req.query.nino) {
            claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);
        } else {
            claimant = req.session.claimant ? req.session.claimant : claimants[0];
        }
        let displayDate = dateUtils.formatDateAndTimeForDisplay(claimant.dob);
        claimant.birthDay = parseInt(displayDate.day);
        claimant.birthMonth = displayDate.month;
        claimant.birthYear = parseInt(displayDate.year);
    } else {
        if(req.session.editedClaimant) {
            claimant = req.session.editedClaimant;
        } else {
            claimant = req.session.newClaimant;
        }
    }
    let claimantOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, claimant.claimantOfficeId);
    res.render('claimant', {
        claimant : claimant,
        claimantOfficeDetails : claimantOfficeDetails,
        errors : errorsIn,
        errorsLength : errorsIn.length
    });
}

function claimantCreatePage(req, res) {

    let editOrCreate = 'create';
    let errorsIn = req.session.errors ? req.session.errors : [];
    let officesList = sIDU.setInitialOfficesData();
    let claimant = {};

    //   If there is a newClaimant session object it is because there were errors in data input previously during
    //   claimant create. It holds the previously-input data that has not been stored in the session claimant
    //   object because it contains errors, but is needed to be re-displayed in the claimant create page.
    //   If there is not a newClaimant session object, use the nino that was passed in with the url, or a default
    //   if no nino was passed in.

    if (req.session.newClaimant) {
        claimant = req.session.newClaimant;
    } else {
        claimant.nino = req.query.nino ? req.query.nino : "AB987654C";
    }
    res.render('claimant-edit', {claimant : claimant,
                                 officesList : officesList,
                                 editOrCreate : editOrCreate,
                                 errors : errorsIn,
                                 errorsLength : errorsIn.length
                                }
    );
}

function claimantCreatePageAction(req, res) {

    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let newClaimant = new Object();
    let year = req.body['birthYear'];
    let month = req.body['birthMonth'];
    let day = req.body['birthDay'];
    let currentYear = new Date().getFullYear();
    let errorsOut = [];
    newClaimant.nino = req.body['nino'];
    if (req.body['claimant-office'] === ""){
        errorsOut.push({
            message : "Home jobcentre must be selected from dropdown list",
            field : "claimant-office"});
    } else {
        newClaimant.claimantOfficeId = req.body['claimant-office'];
    }
    if (req.body['firstName'] === "") {
        errorsOut.push({
            message : "First name must be entered",
            field : "firstName"});
    } else {
        newClaimant.firstName = req.body['firstName'];
    }
    if (req.body['lastName'] === "") {
        errorsOut.push({
            message : "Last name must be entered",
            field : "lastName"});
    } else {
        newClaimant.lastName = req.body['lastName'];
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
        newClaimant.postcode = req.body['postcode'];
    }
    newClaimant.preferredContactNumber = req.body['prefContNum'];
    newClaimant.emailAddress = req.body['emailAddr'];
    newClaimant.welshSpeaker = req.body['welsh-speaker'];
    newClaimant.translator = req.body['translator'];
    if (newClaimant.translator === "No") {
            newClaimant.language = '';
        } else {
            newClaimant.language = req.body['language'];
            if (req.body['language'] === "") {
                errorsOut.push({
                    message : "Enter a language , or select No for Translator reqd",
                    field : 'language'});
            }
        }
    newClaimant.approvedRep = req.body['approved-rep'];
    if (newClaimant.approvedRep === "Yes") {
            newClaimant.approvedRepName = req.body['rep-name'];
            newClaimant.approvedRepContact = req.body['rep-contact'];
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
        newClaimant.approvedRepName = "";
        newClaimant.approvedRepContact = "";
    }
    if (errorsOut.length === 0) {
        newClaimant.dob = new Date(year + '-' + month + '-' + day);
        req.session.claimant = newClaimant;
        claimants.push(newClaimant);
        req.session.claimants = claimants;
        req.session.errors = [];
        res.redirect('/claimant/view');
    } else {
        newClaimant.birthDay = day;
        newClaimant.birthMonth = month;
        newClaimant.birthYear = year;
        req.session.newClaimant = newClaimant;
        req.session.errors = errorsOut;
        res.redirect('/claimant/create');
    }
}

function claimantEditPage(req, res) {

    let editOrCreate = 'edit';
    let errorsIn = req.session.errors ? req.session.errors : [];
    let officesList = sIDU.setInitialOfficesData();
    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant;
    if (errorsIn.length === 0) {
        if(req.query.nino) {
            claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);
        } else {
            claimant = req.session.claimant ? req.session.claimant : claimants[0];
        }
        let displayDate = dateUtils.formatDateAndTimeForDisplay(claimant.dob);
        claimant.birthDay = parseInt(displayDate.day);
        claimant.birthMonth = displayDate.numericMonth;
        claimant.birthYear = parseInt(displayDate.year);
    } else {
        claimant = req.session.editedClaimant;
    }
    let claimantOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, claimant.claimantOfficeId);
    req.session.claimant = claimant;
    res.render('claimant-edit', { claimant : claimant,
                                  claimantOfficeDetails : claimantOfficeDetails,
                                  editOrCreate : editOrCreate,
                                  errors : errorsIn,
                                  errorsLength : errorsIn.length
        }
    );
}

function claimantEditPageAction(req, res) {

    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant = req.session.claimant;
    let editedClaimant = new Object();
    let year = req.body['birthYear'];
    let month = req.body['birthMonth'];
    let day = req.body['birthDay'];
    let errorsOut = [];
    let currentYear = new Date().getFullYear();
    editedClaimant.nino = claimant.nino;
    editedClaimant.claimantOfficeId = req.body['claimant-office'];
    if (req.body['firstName'] === "") {
        errorsOut.push({
            message : "First name must be entered",
            field : "firstName"});
    } else {
        editedClaimant.firstName = req.body['firstName'];
    }
    if (req.body['lastName'] === "") {
        errorsOut.push({
            message : "Last name must be entered",
            field : "lastName"});
    } else {
        editedClaimant.lastName = req.body['lastName'];
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
        editedClaimant.postcode = req.body['postcode'];
    }
    editedClaimant.preferredContactNumber = req.body['prefContNum'];
    editedClaimant.emailAddress = req.body['emailAddr'];
    editedClaimant.welshSpeaker = req.body['welsh-speaker'];
    editedClaimant.translator = req.body['translator'];
    if (editedClaimant.translator === "No") {
        editedClaimant.language = '';
    } else {
        editedClaimant.language = req.body['language'];
        if (req.body['language'] === "") {
            errorsOut.push({
                message : "Enter a language , or select No for Translator reqd",
                field : 'language'});
        }
    }
    editedClaimant.approvedRep = req.body['approved-rep'];
    if (editedClaimant.approvedRep === "Yes") {
            editedClaimant.approvedRepName = req.body['rep-name'];
            editedClaimant.approvedRepContact = req.body['rep-contact'];
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
        editedClaimant.approvedRepName = "";
        editedClaimant.approvedRepContact = "";
    }
    if (errorsOut.length === 0) {
        editedClaimant.dob = new Date(year + '-' + month + '-' + day);
        req.session.claimant = editedClaimant;
        claimants.push(editedClaimant);
        req.session.claimants = claimants;
        req.session.errors = errorsOut;
        res.redirect('/claimant/view');
    } else {
        editedClaimant.birthDay = day;
        editedClaimant.birthMonth = month;
        editedClaimant.birthYear = year;
        req.session.editedClaimant = editedClaimant;
        req.session.errors = errorsOut;
        res.redirect('/claimant/edit');
    }
}

module.exports.claimantFindPage = claimantFindPage;
module.exports.claimantFindPageAction = claimantFindPageAction;
module.exports.claimantViewPage = claimantViewPage;
module.exports.claimantCreatePage = claimantCreatePage;
module.exports.claimantCreatePageAction = claimantCreatePageAction;
module.exports.claimantEditPage = claimantEditPage;
module.exports.claimantEditPageAction = claimantEditPageAction;