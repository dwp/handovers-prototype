class User {
    constructor(firstName, lastName, staffId, telNum) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.staffId = staffId;
        this.telNum = telNum;
        this.homeOfficeLocation = 'Barnsley Jobcentre';
        //this.skillsList =[];
        //this.handlesHandoversForOfficesList = [];
    }

    addSkillToSkillsList(skill) {
        this.skillsList.push(skill);
    }

    setHomeOfficeLocation(newOfficeLocation) {
        this.homeOfficeLocation = newOfficeLocation;
    }

}

module.exports = User;
