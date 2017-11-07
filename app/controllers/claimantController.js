const Claimant = require('../models/claimant');
const claimantUtils = require('../utils/claimantUtils');
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Claimant Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function claimantPage(req, res) {

    var claimants = req.session.claimants ? req.session.claimants : claimantUtils.setInitialClaimantsData();
    var claimant = req.session.claimant ? req.session.claimant : claimants[0];

    res.render('claimant', claimant);
}

function claimantFindPage(req, res) {

    res.render('claimant-find');
}

function claimantFindPageAction(req, res) {

    var claimants = req.session.claimants ? req.session.claimants : claimantUtils.setInitialClaimantsData();
    var inputNino = req.body.nino;
    var claimant = {};
    var claimantFound = 0;

    if (inputNino === '') {
        console.log('Nino not input');
    } else {
        for (var i=0; i < claimants.length; i++) {
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

    var claimant = {};
    claimant.nino = req.query.nino ? req.query.nino : "AB987654C";
    res.render('claimant-edit', claimant)

}

function claimantEditPageAction(req, res) {

    var claimants = req.session.claimants ? req.session.claimants : claimantUtils.setInitialClaimantsData();
    var nino = req.body['nino'];
    var firstName = req.body['firstName'];
    var lastName = req.body['lastName'];
    var dob = req.body['dob'];
    var telNum = req.body['telNum'];
    var mobile = req.body['mobile'];
    var postcode = req.body['postcode'];
    var welshSpeaker = req.body['welsh-speaker'];
    var claimant = new Claimant(firstName, lastName, dob, nino, telNum, mobile, postcode, welshSpeaker);
    claimants.push(claimant);
    req.session.claimant = claimant;
    req.session.claimants = claimants;

    res.redirect('/claimant/view');

}

module.exports.claimantPage = claimantPage;
module.exports.claimantFindPage = claimantFindPage;
module.exports.claimantFindPageAction = claimantFindPageAction;
module.exports.claimantEditPage = claimantEditPage;
module.exports.claimantEditPageAction = claimantEditPageAction;