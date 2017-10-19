const Handover = require('../models/handover');
const handoverUtils = require('../utils/handoverUtils');
const claimantUtils = require('../utils/claimantUtils');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Claimant Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function createHandoverPage(req, res) {

    var initialData = handoverUtils.setInitialHandoversData();
    var benefitsList = initialData.initialBenefits;
    var handoverTypesList = initialData.initialHandoverTypes;
    var handoverReasonsList = initialData.initialHandoverReasons;
    var handoversList = initialData.initialHandovers;

    var confirm = req.session.confirm ? req.session.confirm : 0;
    var claimant = claimantUtils.getClaimantByNino(req.query.nino);
    var handover = req.session.handover ? req.session.handover : null;

    req.session.claimant = claimant;
    req.session.handovers = handoversList;

    res.render('handover-add', {
        "benList" : benefitsList,
        "handTypesList" : handoverTypesList,
        "handReasonsList" : handoverReasonsList,
        "claimant" : claimant,
        "confirm" : confirm,
        "handover" : handover
    });
}

function createHandoverPageAction(req, res) {

    var handoversList = req.session.handovers;

    var newHandoversList;
    var handover = req.session.handover;
    var newHandover;
    var benefitId = req.body['benefit'];
    var handoverTypeId = req.body['handover-type'];
    var handoverReasonId = req.body['handover-reason'];
    var handoverPriority = req.body['handover-priority'];
    var handoverNote = req.body['handover-note'];
    var handoverAttachment = req.body['handover-attachment'];
    var claimant = req.session.claimant;
    var newId = handoversList.length + 1;
    var saveOrSubmit = req.body['save-or-submit'];

    newHandover = new Handover(newId, claimant.id, '40001001', '1', benefitId, handoverTypeId, handoverReasonId, '1', handoverPriority);
    newHandover.addNote(handoverNote);
    newHandover.addAttachment(handoverAttachment);
    req.session.handover = newHandover;
    newHandoversList = handoversList;
    newHandoversList.push(newHandover);
    req.session.handovers = newHandoversList;

    req.session.claimant = claimant;
    req.session.confirm = 1;

    if (saveOrSubmit === '1') {
        res.redirect('/handover/edit');
    } else {
        res.redirect('/handover/create');
    }

}

function editHandoverPage(req, res) {

    var initialData = handoverUtils.setInitialHandoversData();
    var benefitsList = initialData.initialBenefits;
    var handoverTypesList = initialData.initialHandoverTypes;
    var handoverReasonsList = initialData.initialHandoverReasons;
    var handoversList = initialData.initialHandovers;
    var confirm = req.session.confirm ? req.session.confirm : null;
    var claimant = claimantUtils.getClaimantByNino(req.query.nino);
    var handover = req.session.handover ? req.session.handover : null;

    req.session.claimant = claimant;
    req.session.handovers = handoversList;

    res.render('handover-edit', {
        "benList" : benefitsList,
        "handTypesList" : handoverTypesList,
        "handReasonsList" : handoverReasonsList,
        "claimant" : claimant,
        "confirm" : confirm,
        "handover" : handover
    });

}

function editHandoverPageAction(req, res) {

}

module.exports.createHandoverPage= createHandoverPage;
module.exports.createHandoverPageAction= createHandoverPageAction;
module.exports.editHandoverPage = editHandoverPage;
module.exports.editHandoverPageAction = editHandoverPageAction;