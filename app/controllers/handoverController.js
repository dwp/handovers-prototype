const Handover = require('../models/handover');
const handoverUtils = require('../utils/handoverUtils');
const claimantUtils = require('../utils/claimantUtils');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Handover Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function viewHandoverPage(req, res) {

    var initialHandoversData = handoverUtils.setInitialHandoversData();
    //var benefitsList = initialHandoversData.initialBenefits;
    //var handoverTypesList = initialHandoversData.initialHandoverTypes;
    //var handoverReasonsList = initialHandoversData.initialHandoverReasons;
    var handoversList = req.session.handovers ? req.session.handovers : initialHandoversData.initialHandovers;
    var claimants = req.session.claimants ? req.session.claimants : claimantUtils.setInitialClaimantsData();
    var claimant = req.session.claimant ? claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.session.claimant.nino) :
                                          claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);
    var handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverByIdFromListOfHandovers(handoversList, req.query.id);
    var textVersions = handoverUtils.getHandoverDetails(handover);

    req.session.claimant = claimant;
    req.session.handovers = handoversList;
    req.session.handover = handover;

    res.render('handover', {
        "benefitName" : textVersions.benefitName,
        "handoverType" : textVersions.handoverType,
        "handoverReason" : textVersions.handoverReason,
        "claimant" : claimant,
        "handover" : handover
    });

}

function viewHandoverPageAction(req, res) {

    var handover = req.session.handover;
    var claimantNino = req.session.claimant && req.session.claimant.nino || console.log("No claimant in session, or no nino in claimant");
    var handoverClaimant = req.session.claimant;

    req.session.claimant = handoverClaimant;
    req.session.handover = handover;

    res.redirect('/handover/edit?nino=' + claimantNino);

}

function createHandoverPage(req, res) {
    var editOrCreate = 'create';
    var initialData = handoverUtils.setInitialHandoversData();
    var benefitsList = initialData.initialBenefits;
    var handoverTypesList = initialData.initialHandoverTypes;
    var handoverReasonsList = initialData.initialHandoverReasons;
    var handovers = req.session.handovers ? req.session.handovers : initialData.initialHandovers;
    var handover = {};
    var claimants = req.session.claimants ? req.session.claimants : claimantUtils.setInitialClaimantsData();
    var claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);

    req.session.claimant = claimant;
    req.session.handovers = handovers;
    req.session.claimants = claimants;

    res.render('handover-edit', {
        "benList" : benefitsList,
        "handTypesList" : handoverTypesList,
        "handReasonsList" : handoverReasonsList,
        "claimant" : claimant,
        "handover" : handover,
        "editOrCreate" : editOrCreate
    });

}

function createHandoverPageAction(req, res) {

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
    newHandover.addNote(newHandover.notes.length, '40001001', handoverNote);
    newHandover.addAttachment(handoverAttachment);
    newHandover.setTimeAndDateRaised();
    newHandover.calculateTargetTime();
    req.session.handover = newHandover;
    newHandoversList = handoversList;
    newHandoversList.push(newHandover);
    req.session.handovers = newHandoversList;
    req.session.claimant = claimant;

    console.log("Leaving createHandoverPageAction, with newHandover : " + newId + " created and now in list: " + newHandoversList);
    res.redirect('/handover/view?id=' + newId);

}

function editHandoverPage(req, res) {

    var editOrCreate = 'edit';
    var initialData = handoverUtils.setInitialHandoversData();
    var benefitsList = initialData.initialBenefits;
    var handoverTypesList = initialData.initialHandoverTypes;
    var handoverReasonsList = initialData.initialHandoverReasons;
    var handovers = req.session.handovers ? req.session.handovers : initialData.initialHandovers;
    var handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverByIdFromListOfHandovers(handovers, req.query.id);
    var claimants = req.session.claimants ? req.session.claimants : claimantUtils.setInitialClaimantsData();
    var claimant = claimantUtils.getClaimantByNinoFromListOfClaimants(claimants, req.query.nino);

    req.session.claimant = claimant;
    req.session.handover = handover;
    req.session.handovers = handovers;
    req.session.claimants = claimants;

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

    var handoversList = req.session.handovers ? req.session.handovers : handoverUtils.setInitialHandoversData();
    var handover = req.session.handover ? req.session.handover : handoverUtils.getHandoverByIdFromListOfHandovers(handoversList, req.query.id);
    var benefitId = req.body['benefit'];
    var handoverTypeId = req.body['handover-type'];
    var handoverReasonId = req.body['handover-reason'];
    var handoverPriority = req.body['handover-priority'];
    var handoverNote = req.body['handover-note'];
    var handoverAttachment = req.body['handover-attachment'];
    var claimant = req.session.claimant;

    handover.benefitId = benefitId;
    handover.typeId = handoverTypeId;
    handover.reasonId = handoverReasonId;
    handover.priority = handoverPriority;
    handover.addNote(existingHandover.notes.length + 1, '40001001', handoverNote);
    //handover.addAttachment(handoverAttachment);
    handover.calculateTargetTime();

    req.session.handover = handover;

    var index = findPositionOfHandoverInArray(handover.id, handoversList);
    handoversList[index] = handover;

    req.session.handovers = handoversList;

    req.session.claimant = claimant;

    console.log('handoverNote got from page is : ', handoverNote);
    console.log('editedHandover.notes is : ', editedHandover.notes);

    res.redirect('/handover/view');

}

function findPositionOfHandoverInArray(inputQueryId, handoversList) {
    var positionOfApptInArray;
    var handoversArray = handoversList;
    var arrLength = handoversArray.length;
    var queryId = parseInt(inputQueryId);

    for (var i = 0; i < arrLength; i++) {

        if (handoversArray[i].id === queryId) {
            positionOfApptInArray = i;
        }
    }

    return positionOfApptInArray;
}

module.exports.viewHandoverPage = viewHandoverPage;
module.exports.viewHandoverPageAction = viewHandoverPageAction;
module.exports.createHandoverPage = createHandoverPage;
module.exports.createHandoverPageAction = createHandoverPageAction;
module.exports.editHandoverPage = editHandoverPage;
module.exports.editHandoverPageAction = editHandoverPageAction;
