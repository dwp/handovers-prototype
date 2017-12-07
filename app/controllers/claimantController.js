const sIDU = require('../utils/setInitialDataUtils');
const officeUtils = require('../utils/officeUtils');
const claimantUtils = require('../utils/claimantUtils');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Claimant Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function claimantFindPage(req, res) {

    res.render('claimant-find');
}

function claimantViewPage(req, res) {

    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant = req.session.claimant ? req.session.claimant : claimants[0];
    let officesList = sIDU.setInitialOfficesData();
    let claimantOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, claimant.claimantOfficeId);

    res.render('claimant', {
        claimant : claimant,
        claimantOfficeDetails : claimantOfficeDetails
    });
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

function claimantCreatePage(req, res) {

    let editOrCreate = 'create';
    let claimant = {};
    claimant.nino = req.query.nino ? req.query.nino : "AB987654C";
    res.render('claimant-edit', { claimant : claimant,
                                  editOrCreate : editOrCreate}
    );
}

function claimantCreatePageAction(req, res) {

    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let newClaimant = new Object();

    newClaimant.firstName = req.body['firstName'];
    newClaimant.lastName = req.body['lastName'];
    newClaimant.dob = req.body['dob'];
    newClaimant.nino = req.body['nino'];
    newClaimant.preferredContactNumber = req.body['prefContNum'];
    newClaimant.emailAddress = req.body['emailAddr'];
    newClaimant.postcode = req.body['postcode'];
    newClaimant.welshSpeaker = req.body['welsh-speaker'];
    newClaimant.translator = req.body['translator'];
    if (newClaimant.translator == 'No') {
        newClaimant.language = '';
    } else {
        newClaimant.language = req.body['language'];
    }
    newClaimant.approvedRepName = req.body['rep-name'];
    newClaimant.approvedRepContact = req.body['rep-contact'];
    claimants.push(newClaimant);
    req.session.claimant = newClaimant;
    req.session.claimants = claimants;

    res.redirect('/claimant/view');

}

function claimantEditPage(req, res) {

    let editOrCreate = 'edit';
    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let ninoOfClaimantToEdit = req.query.nino ? req.query.nino : claimants[0].nino;
    let claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, ninoOfClaimantToEdit);
    let officesList = sIDU.setInitialOfficesData();
    let claimantOfficeDetails = officeUtils.getOfficeByIdFromListOfOffices(officesList, claimant.claimantOfficeId);
    let approvedRep;
    if (claimant.approvedRepName === "" || claimant.approvedRepName === null || !claimant.approvedRepName) {
        approvedRep = 0;
    } else {
        approvedRep = 1;
    }

    req.session.claimant = claimant;

    res.render('claimant-edit', { claimant : claimant,
                                  claimantOfficeDetails : claimantOfficeDetails,
                                  editOrCreate : editOrCreate,
                                  approvedRep : approvedRep }
    );

}

function claimantEditPageAction(req, res) {

    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant = req.session.claimant;
    let editedClaimant = new Object();

    editedClaimant.firstName = req.body['firstName'];
    editedClaimant.lastName = req.body['lastName'];
    editedClaimant.dob = req.body['dob'];
    editedClaimant.nino = claimant.nino;
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
    editedClaimant.approvedRepName = req.body['rep-name'];
    editedClaimant.approvedRepContact = req.body['rep-contact'];
    claimants.push(editedClaimant);
    req.session.claimant = editedClaimant;
    req.session.claimants = claimants;

    res.redirect('/claimant/view');


}

module.exports.claimantFindPage = claimantFindPage;
module.exports.claimantViewPage = claimantViewPage;
module.exports.claimantFindPageAction = claimantFindPageAction;
module.exports.claimantCreatePage = claimantCreatePage;
module.exports.claimantCreatePageAction = claimantCreatePageAction;
module.exports.claimantEditPage = claimantEditPage;
module.exports.claimantEditPageAction = claimantEditPageAction;