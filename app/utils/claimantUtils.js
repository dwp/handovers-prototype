function getClaimantByNinoFromListOfClaimants(claimantsList, nino) {

    var claimants = claimantsList;
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
                "mobile" : claimant.mobile,
                "welshSpeaker": claimant.welshSpeaker
              }
        }
    }

    return foundClaimant;

}

module.exports.getClaimantByNinoFromListOfClaimants = getClaimantByNinoFromListOfClaimants;