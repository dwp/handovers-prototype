const Claimant = require('../models/claimant');
const controllerData = require('../data/claimantData.json');

function setInitialClaimantsData(){

    var initialClaimantsData;
    var initialClaimants = [];

    // Get claimants from json file data
    var claimantsList = controllerData['claimants'];

    // Set up list of claimant objects from json file data
    for (var i=0; i < claimantsList.length; i++) {
        var firstName = claimantsList[i].firstName;
        var lastName = claimantsList[i].lastName;
        var dob = claimantsList[i].dob;
        var nino = claimantsList[i].nino;
        var telNum = claimantsList[i].telNum;
        var mobile = claimantsList[i].mobile;
        var postcode = claimantsList[i].postcode;

        var claimant = new Claimant(firstName, lastName, dob, nino, telNum, mobile, postcode);
        initialClaimants.push(claimant);
    }

    initialClaimantsData = {
        "initialClaimants" : initialClaimants
    }

    return initialClaimantsData;
}

module.exports.setInitialClaimantsData = setInitialClaimantsData;