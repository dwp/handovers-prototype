const Claimant = require('../models/claimant');
const dataUtils = require('../utils/setInitialClaimantsData');
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Claimant Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function claimantPage(req, res) {

    var initialData = dataUtils.setInitialClaimantsData();
    var claimants = initialData.initialClaimants;

    var claimant = req.session.claimantForDisplay ? req.session.claimantForDisplay : claimants[0];

    req.session.claimants= claimants;

    res.render('claimant', claimant);
}

function claimantFindPage(req, res) {

    res.render('claimant-find');
}

function claimantFindPageAction(req, res) {

    var initialData = dataUtils.setInitialClaimantsData();
    var claimants = req.session.claimants ? req.session.claimants : initialData.initialClaimants;
    var inputNino = req.body.nino;

    var claimantForDisplay = {};

    if (inputNino === '') {
        console.log ('Nino: ', + inputNino + ' not input')
    } else {
        for (var i=0; i < claimants.length; i++) {
            if (claimants[i].nino === inputNino) {
                claimantForDisplay = claimants[i];
            }
        }
    }

    req.session.claimants = claimants;
    req.session.claimantForDisplay = claimantForDisplay;

    res.redirect('/claimant/view');
}

module.exports.claimantPage = claimantPage;
module.exports.claimantFindPage = claimantFindPage;
module.exports.claimantFindPageAction= claimantFindPageAction;