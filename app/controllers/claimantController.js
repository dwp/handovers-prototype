const Claimant = require('../models/claimant');
const claimantUtils = require('../utils/claimantUtils');
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Claimant Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function claimantPage(req, res) {

    var claimants = claimantUtils.setInitialClaimantsData();
    var claimant = req.session.claimant ? req.session.claimant : claimants[0];

    res.render('claimant', claimant);
}

function claimantFindPage(req, res) {

    res.render('claimant-find');
}

function claimantFindPageAction(req, res) {

    var claimants = claimantUtils.setInitialClaimantsData();
    var inputNino = req.body.nino;

    var claimant = {};

    if (inputNino === '') {
        console.log ('Nino: ', + inputNino + ' not input')
    } else {
        for (var i=0; i < claimants.length; i++) {
            if (claimants[i].nino === inputNino) {
                claimant = claimants[i];
            }
        }
    }

    req.session.claimant = claimant;

    res.redirect('/claimant/view');
}

module.exports.claimantPage = claimantPage;
module.exports.claimantFindPage = claimantFindPage;
module.exports.claimantFindPageAction= claimantFindPageAction;