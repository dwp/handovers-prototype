class Customer {
    constructor(properties) {
        this.nino = properties.nino;
        this.firstName = properties.firstName;
        this.lastName = properties.lastName;
        this.dob = properties.dob;
        this.postcode = properties.postcode;
        this.customerOfficeId = properties.customerOfficeId;
        this.preferredContactNumber = properties.preferredContactNumber;
        this.emailAddress = properties.emailAddress;
        this.welshSpeaker = properties.translator;
        this.translator = properties.translator;
        this.language = properties.language;
        this.approvedRep = properties.approvedRep;
        this.approvedRepName = properties.approvedRepName;
        this.approvedRepContact = properties.approvedRepContact;
    }
}

module.exports = Customer;
