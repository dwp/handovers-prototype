/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Not currently used
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

class Team {
    constructor(id, teamName, teamStartDate, teamEndDate) {
        this.id = id;
        this.teamName = teamName;
        this.userList = [];
        this.skillsetsList = [];
        this.startDate = teamStartDate;
        this.endDate = teamEndDate;
    }

    addUser(user) {
        this.userList.push(user);
    }

    addUserList(userList) {
        this.userList = userList;
    }

    addSkillset(skillset) {
        this.skillsetsList.push(skillset);
    }

    addSkillsetList(skillsetList) {
        this.skillsetsList = skillsetList;
    }
}

module.exports = Team;
