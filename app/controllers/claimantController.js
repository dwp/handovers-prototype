const Claimant = require('../models/claimant');
const claimantUtils = require('../utils/claimantUtils');
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Claimant Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function claimantPage(req, res) {

    var claimant = req.session.claimant ? req.session.claimant : claimants[0];
    var claimants = claimantUtils.setInitialClaimantsData();


    res.render('claimant', claimant);
}

function claimantFindPage(req, res) {

    res.render('claimant-find');
}

function claimantFindPageAction(req, res) {

    var claimant = {};
    var inputNino = req.body.nino;
    var claimants = claimantUtils.setInitialClaimantsData();


    if (inputNino === '') {
        console.log ('Nino not input');
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