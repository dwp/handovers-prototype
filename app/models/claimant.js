class Claimant {
    constructor(firstName, lastName, dob, nino, telNum, mobile, postcode) {
        this.nino = nino;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.telNum = telNum;
        this.mobile = mobile;
        this.postcode = postcode;
    }
}

module.exports = Claimant;
