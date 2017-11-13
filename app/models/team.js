/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Not currently used in prototype
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

class Team {
    constructor(id, teamName, teamStartDate, teamEndDate) {
        this.id = id;
        this.teamName = teamName;
        this.userList = [];
        this.queueList = [];
        this.startDate = teamStartDate;
        this.endDate = teamEndDate;
    }

    addUser(user) {
        this.userList.push(user);
    }

    addUserList(userList) {
        this.userList = userList;
    }

    addQueue(queue) {
        this.queueList.push(queue);
    }

    addQueueList(queueList) {
        this.queueList = queueList;
    }
}

module.exports = Team;
