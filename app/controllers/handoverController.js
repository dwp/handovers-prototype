const Handover = require('../models/handover');
const dataUtils = require('../utils/setInitialHandoversData');
const claimantUtils = require('../utils/claimantUtils');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Claimant Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function createHandoverPage(req, res) {

    var initialData = dataUtils.setInitialHandoversData();
    var benefitsList = initialData.initialBenefits;
    var handoverTypesList = initialData.initialHandoverTypes;
    var handoverReasonsList = initialData.initialHandoverReasons;
    var pageDisplayObject;
    var nino = req.query.nino ? req.query.nino : "AA123456B";
    var confirm = req.session.confirm ? req.session.confirm : null;
    var claimant = claimantUtils.getClaimantByNino(nino);
    var newHandover = req.session.newHandover ? req.session.newHandover : null;

    req.session.claimant = claimant;

    pageDisplayObject = {
        "benList" : benefitsList,
        "handTypesList" : handoverTypesList,
        "handReasonsList" : handoverReasonsList,
        "claimant" : claimant,
        "confirm" : confirm,
        "handover" : newHandover
    }

    res.render('handover-add', pageDisplayObject);
}

function createHandoverPageAction(req, res) {

    req.session.confirm = 1;

    var handover;
    var benefitId = req.body['benefit'];
    var handoverTypeId = req.body['handover-type'];
    var handoverReasonId = req.body['handover-reason'];
    var handoverPriority = req.body['handover-priority'];
    var claimant = req.session.claimant;

    handover = {
        "handoverBen" : benefitId,
        "handoverType" : handoverTypeId,
        "handoverReason" : handoverReasonId,
        "handoverPriority" : handoverPriority
    }

    req.session.newHandover = handover;

    res.redirect('/handover/create');
}

module.exports.createHandoverPage= createHandoverPage;
module.exports.createHandoverPageAction= createHandoverPageAction;