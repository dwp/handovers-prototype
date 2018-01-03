/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Not currently used
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

class Customer {
    constructor(firstName, lastName, dob, nino, telNum, mobile, postcode, welshSpeaker) {
        this.nino = nino;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.telNum = telNum;
        this.mobile = mobile;
        this.postcode = postcode;
        this.welshSpeaker = welshSpeaker;
    }
}

module.exports = Customer;
