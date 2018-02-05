/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Not currently used
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

class User {
    constructor(firstName, lastName, staffId, telNum, role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.staffId = staffId;
        this.telNum = telNum;
        this.homeOfficeLocation = 'Barnsley Jobcentre';
        this.role = role;
    }

    setHomeOfficeLocation(newOfficeLocation) {
        this.homeOfficeLocation = newOfficeLocation;
    }

}

module.exports = User;
