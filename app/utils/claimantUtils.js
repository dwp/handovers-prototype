function getClaimantByNinoFromListOfClaimants(claimantsList, nino) {

    var claimants = claimantsList;
    var inputNino = nino || "AA123456B";
    var foundClaimant = {};

    for (var i=0; i < claimants.length; i++) {
        if (claimants[i].nino == inputNino) {
            var claimant = claimants[i];
              foundClaimant = {
                "nino" : claimant.nino,
                "firstName" : claimant.firstName,
                "lastName" : claimant.lastName,
                "dob" : claimant.dob,
                "preferredContactNumber" : claimant.preferredContactNumber,
                "emailAddress" : claimant.emailAddress,
                "postcode" : claimant.postcode,
                "claimantOfficeId" : claimant.claimantOfficeId,
                "welshSpeaker" : claimant.welshSpeaker,
                "translator" : claimant.translator,
                "language" : claimant.language,
                "approvedRepName" : claimant.approvedRepName,
                "approvedRepContact" : claimant.approvedRepContact
              }
        }
    }

    return foundClaimant;

}

module.exports.getClaimantByNinoFromListOfClaimants = getClaimantByNinoFromListOfClaimants;