/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Not currently used
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

class Customer {
    constructor(properties) {
        this.nino = properties.nino;
        this.firstName = properties.firstName;
        this.lastName = properties.lastName;
        this.dob = properties.dob;
        this.birthDay = properties.birthDay;
        this.birthMonth = properties.birthMonth;
        this.birthYear = properties.birthYear;
        this.postcode = properties.postcode;
        this.customerOfficeId = properties.customerOfficeId;
        this.preferredContactNumber = properties.preferredContactNumber;
        this.emailAddress = properties.emailAddress;
        this.welshSpeaker = properties.translator;
        this.translator = properties.translator;
        this.language = properties.language;
        this.approvedRep = properties.approvedRep;
        this.approvedRepName = properties.approvedRepName;
        this.approvedRepContact = properties.approvedRepName;
    }
}

module.exports = Customer;
