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

    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let messagesIn = req.session.messages ? req.session.messages : [];
    let claimant;
    let sessionClaimant;
    if (messagesIn.length === 0) {
        sessionClaimant = req.session.claimant ? req.session.claimant : claimants[0];
        let ninoOfClaimantToEdit = req.query.nino ? req.query.nino : sessionClaimant.nino;
        claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, ninoOfClaimantToEdit);
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

    let officesList = sIDU.setInitialOfficesData();
    let claimantOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, claimant.claimantOfficeId);
    res.render('claimant', {
        claimant : claimant,
        claimantOfficeDetails : claimantOfficeDetails,
        messages : messagesIn,
        messagesLength : messagesIn.length
    });
}

function claimantCreatePage(req, res) {

    let editOrCreate = 'create';
    let claimant = {};
    let messagesIn = req.session.messages ? req.session.messages : [];
    if (req.session.newClaimant) {
        claimant = req.session.newClaimant;
    } else {
        claimant.nino = req.query.nino ? req.query.nino : "AB987654C";
    }
    let officesList = sIDU.setInitialOfficesData();

    res.render('claimant-edit', { claimant : claimant,
                                  editOrCreate : editOrCreate,
                                  officesList : officesList,
                                  messages : messagesIn,
                                  messagesLength : messagesIn.length
        }
    );
}

function claimantCreatePageAction(req, res) {

    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let newClaimant = new Object();
    let year = req.body['birthYear'];
    let month = req.body['birthMonth'];
    let day = req.body['birthDay'];
    let messagesOut = [];
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();

    if (req.body['firstName'] === "") {
        messagesOut.push("First name must be entered");
    } else {
        newClaimant.firstName = req.body['firstName'];
    }

    if (req.body['lastName'] === "") {
        messagesOut.push("Last name must be entered");
    } else {
        newClaimant.lastName = req.body['lastName'];
    }

    if (!day || day < 1 || day > 31) {
        messagesOut.push("Day of birth must be from 1 to 31");
    }
    if (!month || month < 1 || month > 12) {
        messagesOut.push("Month of birth must be from 1 to 12");
    }
    if (!year || year < 1900 || year > currentYear) {
        messagesOut.push("Year of birth must be from 1900 to " + currentYear);
    }

    newClaimant.nino = req.body['nino'];
    newClaimant.preferredContactNumber = req.body['prefContNum'];
    if (req.body['claimant-office'] === ""){
        messagesOut.push("Home jobcentre must be selected from dropdown list");
    } else {
        newClaimant.claimantOfficeId = req.body['claimant-office'];
    }
    newClaimant.emailAddress = req.body['emailAddr'];
    newClaimant.postcode = req.body['postcode'];
    newClaimant.welshSpeaker = req.body['welsh-speaker'];
    newClaimant.translator = req.body['translator'];
    if (newClaimant.translator == 'No') {
        newClaimant.language = '';
    } else {
        newClaimant.language = req.body['language'];
    }
    newClaimant.approvedRep = req.body['approved-rep'];
    if (newClaimant.approvedRep === "Yes") {
        if (req.body['rep-name'] === "" || req.body['rep-contact'] === "") {
            messagesOut.push("Enter both name and contact details for approved representative, or select 'No'");
        } else {
            newClaimant.approvedRepName = req.body['rep-name'];
            newClaimant.approvedRepContact = req.body['rep-contact'];
        }
    } else {
        newClaimant.approvedRepName = "";
        newClaimant.approvedRepContact = "";
    }
    if (messagesOut.length === 0) {
        newClaimant.dob = new Date(year + '-' + month + '-' + day);
        req.session.claimant = newClaimant;
        claimants.push(newClaimant);
        req.session.claimants = claimants;
        req.session.messages = [];
        res.redirect('/claimant/view');
    } else {
        newClaimant.birthDay = day;
        newClaimant.birthMonth = month;
        newClaimant.birthYear = year;
        req.session.newClaimant = newClaimant;
        req.session.messages = messagesOut;
        res.redirect('/claimant/create');
    }
}

function claimantEditPage(req, res) {

    let editOrCreate = 'edit';
    let messagesIn = req.session.messages ? req.session.messages : [];
    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let sessionClaimant = {};
    let claimant;
    if (messagesIn.length === 0) {
        sessionClaimant = req.session.claimant ? req.session.claimant : claimants[0];
        let ninoOfClaimantToEdit = req.query.nino ? req.query.nino : sessionClaimant.nino;
        claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, ninoOfClaimantToEdit);
        let displayDate = dateUtils.formatDateAndTimeForDisplay(claimant.dob);
        claimant.birthDay = parseInt(displayDate.day);
        claimant.birthMonth = displayDate.numericMonth;
        claimant.birthYear = parseInt(displayDate.year);
    } else {
        claimant = req.session.editedClaimant;
    }
    let officesList = sIDU.setInitialOfficesData();
    let claimantOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, claimant.claimantOfficeId);

    req.session.claimant = claimant;

    res.render('claimant-edit', { claimant : claimant,
                                  claimantOfficeDetails : claimantOfficeDetails,
                                  editOrCreate : editOrCreate,
                                  messages : messagesIn,
                                  messagesLength : messagesIn.length

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
    let messagesOut = [];
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();

    if (req.body['firstName'] === "") {
        messagesOut.push("First name must be entered");
    } else {
        editedClaimant.firstName = req.body['firstName'];
    }

    if (req.body['lastName'] === "") {
        messagesOut.push("Last name must be entered");
    } else {
        editedClaimant.lastName = req.body['lastName'];
    }

    if (!day || day < 1 || day > 31) {
        messagesOut.push("Day of birth must be from 1 to 31");
    }
    if (!month || month < 1 || month > 12) {
        messagesOut.push("Month of birth must be from 1 to 12");
    }
    if (!year || year < 1900 || year > currentYear) {
        messagesOut.push("Year of birth must be from 1900 to " + currentYear);
    }

    editedClaimant.nino = claimant.nino;
    editedClaimant.claimantOfficeId = req.body['claimant-office'];
    editedClaimant.preferredContactNumber = req.body['prefContNum'];
    editedClaimant.emailAddress = req.body['emailAddr'];
    editedClaimant.postcode = req.body['postcode'];
    editedClaimant.welshSpeaker = req.body['welsh-speaker'];
    editedClaimant.translator = req.body['translator'];
    if (editedClaimant.translator == 'No') {
        editedClaimant.language = '';
    } else {
        editedClaimant.language = req.body['language'];
    }

    editedClaimant.approvedRep = req.body['approved-rep'];
    if (editedClaimant.approvedRep === "Yes") {
        if (req.body['rep-name'] === "" || req.body['rep-contact'] === "") {
            messagesOut.push("Enter both name and contact details for approved representative, or select 'No'");
        } else {
            editedClaimant.approvedRepName = req.body['rep-name'];
            editedClaimant.approvedRepContact = req.body['rep-contact'];
        }
    } else {
        editedClaimant.approvedRepName = "";
        editedClaimant.approvedRepContact = "";
    }
    req.session.claimants = claimants;

    if (messagesOut.length === 0) {
        editedClaimant.dob = new Date(year + '-' + month + '-' + day);
        req.session.claimant = editedClaimant;
        claimants.push(editedClaimant);
        req.session.claimants = claimants;
        req.session.messages = messagesOut;
        res.redirect('/claimant/view');
    } else {
        editedClaimant.birthDay = day;
        editedClaimant.birthMonth = month;
        editedClaimant.birthYear = year;
        req.session.editedClaimant = editedClaimant;
        req.session.messages = messagesOut;
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