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
    var handoversList = initialData.initialHandovers;

    //console.log("LIST OF HANDOVERS AT TOP OF CREATE-HANDOVER-PAGE:-");
    //console.log(handoversList);

    var pageDisplayObject;
    var nino = req.query.nino ? req.query.nino : "AA123456B";
    var confirm = req.session.confirm ? req.session.confirm : 0;
    var claimant = claimantUtils.getClaimantByNino(nino);
    var handover = req.session.handover ? req.session.handover : null;

    pageDisplayObject = {
        "benList" : benefitsList,
        "handTypesList" : handoverTypesList,
        "handReasonsList" : handoverReasonsList,
        "claimant" : claimant,
        "confirm" : confirm,
        "handover" : handover
    }

    req.session.claimant = claimant;
    req.session.handovers = handoversList;

    //console.log("LIST OF HANDOVERS AT BOTTOM OF CREATE-HANDOVER-PAGE:-");
    //console.log(handoversList);

    res.render('handover-add', pageDisplayObject);
}

function createHandoverPageAction(req, res) {

    var handoversList = req.session.handovers;

    //console.log("LIST OF HANDOVERS AT TOP OF CREATE-HANDOVER-PAGE-ACTION:-");
    //console.log(handoversList);

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

    //console.log("LIST OF HANDOVERS AT BOTTOM OF CREATE-HANDOVER-PAGE-ACTION:-");
    //console.log(newHandoversList);

    req.session.claimant = claimant;
    req.session.confirm = 1;

    if (saveOrSubmit === '1') {
        res.redirect('/handover/edit');
    } else {
        res.redirect('/handover/create');
    }

}

function editHandoverPage(req, res) {

    var initialData = dataUtils.setInitialHandoversData();
    var benefitsList = initialData.initialBenefits;
    var handoverTypesList = initialData.initialHandoverTypes;
    var handoverReasonsList = initialData.initialHandoverReasons;
    var handoversList = initialData.initialHandovers;
    var pageDisplayObject;
    var nino = req.query.nino ? req.query.nino : "AA123456B";
    var confirm = req.session.confirm ? req.session.confirm : null;
    var claimant = claimantUtils.getClaimantByNino(nino);
    var handover = req.session.handover ? req.session.handover : null;

    req.session.claimant = claimant;

    pageDisplayObject = {
        "benList" : benefitsList,
        "handTypesList" : handoverTypesList,
        "handReasonsList" : handoverReasonsList,
        "claimant" : claimant,
        "confirm" : confirm,
        "handover" : handover
    }

    req.session.handovers = handoversList;

    res.render('handover-edit', pageDisplayObject);

}

function editHandoverPageAction(req, res) {

}

module.exports.createHandoverPage= createHandoverPage;
module.exports.createHandoverPageAction= createHandoverPageAction;
module.exports.editHandoverPage = editHandoverPage;
module.exports.editHandoverPageAction = editHandoverPageAction;