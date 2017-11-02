const Claimant = require('../models/claimant');
const claimantData = require('../data/claimantData.json');

function setInitialClaimantsData(){

    var initialClaimants = [];

    // Get claimants from json file data
    var claimantsList = claimantData['claimants'];

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

    return initialClaimants;

}

function getClaimantByNino(claimantsList, nino) {

    var claimants = claimantsList ? claimantsList : this.setInitialClaimantsData();
    var inputNino = nino || "AA123456B";
    var foundClaimant = {};

    for (var i=0; i < claimants.length; i++) {
        if (claimants[i].nino === inputNino) {
            var claimant = claimants[i];
              foundClaimant = {
                "nino" : claimant.nino,
                "firstName" : claimant.firstName,
                "lastName" : claimant.lastName,
                "dob" : claimant.dob,
                "telNum" : claimant.telNum,
                "postcode" : claimant.postcode,
                "mobile" : claimant.mobile
              }
        }
    }

    return foundClaimant;

}

module.exports.setInitialClaimantsData = setInitialClaimantsData;
module.exports.getClaimantByNino = getClaimantByNino;