/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Not currently used in prototype
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

class User {
    constructor(firstName, lastName, staffId, telNum) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.staffId = staffId;
        this.telNum = telNum;
        this.homeOfficeLocation = 'Barnsley Jobcentre';
    }

    setHomeOfficeLocation(newOfficeLocation) {
        this.homeOfficeLocation = newOfficeLocation;
    }

}

module.exports = User;
