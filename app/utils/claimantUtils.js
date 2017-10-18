const Claimant = require('../models/claimant');
const dataUtils = require('../utils/setInitialClaimantsData')

function getClaimantByNino(nino) {

    var initialData = dataUtils.setInitialClaimantsData();
    var claimants = initialData.initialClaimants;
    var inputNino = nino;
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

module.exports.getClaimantByNino = getClaimantByNino;