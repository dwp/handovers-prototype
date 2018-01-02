function getCustomerByNinoFromListOfCustomers(customersList, nino) {

    var customers = customersList;
    var inputNino = nino || "AA123456B";
    var foundCustomer = {};

    for (var i=0; i < customers.length; i++) {
        if (customers[i].nino == inputNino) {
            var customer = customers[i];
              foundCustomer = {
                "nino" : customer.nino,
                "firstName" : customer.firstName,
                "lastName" : customer.lastName,
                "dob" : customer.dob,
                "preferredContactNumber" : customer.preferredContactNumber,
                "emailAddress" : customer.emailAddress,
                "postcode" : customer.postcode,
                "customerOfficeId" : customer.customerOfficeId,
                "welshSpeaker" : customer.welshSpeaker,
                "translator" : customer.translator,
                "language" : customer.language,
                "approvedRep" : customer.approvedRep,
                "approvedRepName" : customer.approvedRepName,
                "approvedRepContact" : customer.approvedRepContact
              }
        }
    }

    return foundCustomer;

}

module.exports.getCustomerByNinoFromListOfCustomers = getCustomerByNinoFromListOfCustomers;