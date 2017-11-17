const sIDU = require('../utils/setInitialDataUtils');
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Claimant Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function claimantPage(req, res) {

    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let claimant = req.session.claimant ? req.session.claimant : claimants[0];

    res.render('claimant', claimant);
}

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

function claimantEditPage(req, res) {

    let claimant = {};
    claimant.nino = req.query.nino ? req.query.nino : "AB987654C";
    res.render('claimant-edit', claimant)

}

function claimantEditPageAction(req, res) {

    let claimants = req.session.claimants ? req.session.claimants : sIDU.setInitialClaimantsData();
    let newClaimant = new Object();

    newClaimant.firstName = req.body['firstName'];
    newClaimant.lastName = req.body['lastName'];
    newClaimant.dob = req.body['dob'];
    newClaimant.nino = req.body['nino'];
    newClaimant.telNum = req.body['telNum'];
    newClaimant.mobile = req.body['mobile'];
    newClaimant.postcode = req.body['postcode'];
    newClaimant.welshSpeaker = req.body['welsh-speaker'];
    newClaimant.language = req.body['language'];
    newClaimant.approvedRepName = req.body['rep-name'];
    newClaimant.approvedRepContact = req.body['rep-contact'];
    claimants.push(newClaimant);
    req.session.claimant = newClaimant;
    req.session.claimants = claimants;

    res.redirect('/claimant/view');

}

module.exports.claimantPage = claimantPage;
module.exports.claimantFindPage = claimantFindPage;
module.exports.claimantFindPageAction = claimantFindPageAction;
module.exports.claimantEditPage = claimantEditPage;
module.exports.claimantEditPageAction = claimantEditPageAction;