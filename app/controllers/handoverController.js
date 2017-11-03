const Handover = require('../models/handover');
const handoverUtils = require('../utils/handoverUtils');
const claimantUtils = require('../utils/claimantUtils');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Handover Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function viewHandoverPage(req, res) {

    var initialData = handoverUtils.setInitialHandoversData();
    var benefitsList = initialData.initialBenefits;
    var handoverTypesList = initialData.initialHandoverTypes;
    var handoverReasonsList = initialData.initialHandoverReasons;
    var handoversList = initialData.initialHandovers;
    var claimants = req.session.claimants ? req.session.claimants : claimantUtils.setInitialClaimantsData();
    var claimant = req.session.claimant ? claimantUtils.getClaimantByNino(claimants, req.session.claimant.nino) : claimantUtils.getClaimantByNino(claimants, req.query.nino);
    var handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverById(req.query.id);

    req.session.claimant = claimant;
    req.session.handovers = handoversList;

    res.render('handover', {
        "benList" : benefitsList,
        "handTypesList" : handoverTypesList,
        "handReasonsList" : handoverReasonsList,
        "claimant" : claimant,
        "handover" : handover
    });

}

function viewHandoverPageAction(req, res) {

    var handover = req.session.handover;
    var claimantNino = req.session.claimant && req.session.claimant.nino || console.log("No claimant in session, or not nino in claimant");
    var handoverClaimant = req.session.claimant;

    var redirectString = "/handover/edit?nino=" + claimantNino;

    req.session.claimant = handoverClaimant;

    res.redirect(redirectString);

}

function editHandoverPage(req, res) {

    var editOrCreate;
    var initialData = handoverUtils.setInitialHandoversData();
    var benefitsList = initialData.initialBenefits;
    var handoverTypesList = initialData.initialHandoverTypes;
    var handoverReasonsList = initialData.initialHandoverReasons;
    var handovers = initialData.initialHandovers;
    var handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverById(req.query.id);
    var claimants = req.session.claimants ? req.session.claimants : claimantUtils.setInitialClaimantsData();

    var claimant = claimantUtils.getClaimantByNino(claimants, req.query.nino);

    req.session.claimant = claimant;
    req.session.handover = handover;
    req.session.handovers = handovers;
    req.session.claimants = claimants;

    if (handover.timeAndDateRaised || handover.id === '1') {
        editOrCreate = 'edit';
    } else {
        editOrCreate = 'create';
    }

    res.render('handover-edit', {
        "benList" : benefitsList,
        "handTypesList" : handoverTypesList,
        "handReasonsList" : handoverReasonsList,
        "claimant" : claimant,
        "handover" : handover,
        "editOrCreate" : editOrCreate
    });
}

function editHandoverPageAction(req, res) {

    var newHandoversList;
    var newHandover;
    var handoversList = req.session.handovers ? req.session.handovers : handoverUtils.setInitialHandoversData();
    var benefitId = req.body['benefit'];
    var handoverTypeId = req.body['handover-type'];
    var handoverReasonId = req.body['handover-reason'];
    var handoverPriority = req.body['handover-priority'];
    var handoverNote = req.body['handover-note'];
    var handoverAttachment = req.body['handover-attachment'];
    var claimant = req.session.claimant;
    var newId = handoversList.length + 1;

    newHandover = new Handover(newId, claimant.nino, '40001001', '1', benefitId, handoverTypeId, handoverReasonId, '1', handoverPriority);
    newHandover.addNote(handoverNote);
    newHandover.addAttachment(handoverAttachment);
    newHandover.setTimeAndDateRaised();
    newHandover.calculateTargetTime();
    req.session.handover = newHandover;
    newHandoversList = handoversList;
    newHandoversList.push(newHandover);
    req.session.handovers = newHandoversList;

    req.session.claimant = claimant;

    res.redirect('/handover/view');

}


module.exports.viewHandoverPage = viewHandoverPage;
module.exports.viewHandoverPageAction = viewHandoverPageAction;
module.exports.editHandoverPage = editHandoverPage;
module.exports.editHandoverPageAction = editHandoverPageAction;