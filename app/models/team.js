class Team {
    constructor(teamName, teamStartDate, teamEndDate) {
        this.teamName = teamName;
        this.userList = [];
        this.skillList = [];
        this.startDate = teamStartDate;
        this.endDate = teamEndDate;
    }

    addUser(user) {
        this.userList.push(user);
    }

    addUserList(userList) {
        this.userList = userList;
    }

    addSkill(skill) {
        this.skillList.push(skill);
    }

    addSkillList(skillList) {
        this.skillList = skillList;
    }
}

module.exports = Team;
