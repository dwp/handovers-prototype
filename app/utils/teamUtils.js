const Team = require('../models/team');
const User = require('../models/user');
const Queue = require('../models/queue');
const teamData = require('../data/teamData.json');

function setInitialTeamsData() {

    var initialTeamsData;
    var initialTeams = [];
    var initialUsers = [];
    var initialQueues = [];

    // Get teams, users, and skills, from json file data
    var teamsList = teamData['teams'];
    var usersList = teamData['users'];
    var queuesList = teamData['queues'];

    // Set up list of team objects from json file data
    for (var i=0; i < teamsList.length; i++) {
        var teamName = teamsList[i].teamName;
        var startDate = teamsList[i].startDate;
        var endDate = teamsList[i].endDate;
        var team = new Team(teamName, startDate, endDate);
        initialTeams.push(team);
    }

    // Set up list of user objects from json file data
    for (var i=0; i < usersList.length; i++) {
        var firstName = usersList[i].firstName;
        var lastName = usersList[i].lastName;
        var staffId = usersList[i].staffId;
        var telNum = usersList[i].telNum;
        var user = new User(firstName, lastName, staffId, telNum);
        initialUsers.push(user);
    }

    // Set up list of queue objects from json file data
    for (var i=0; i < queuesList.length; i++) {
        var id = queuesList[i].id;
        var name = queuesList[i].name;
        var description = queuesList[i].description;
        var queue= new Queue(id, name, description);
        initialQueues.push(queue);
    }

    // Set up one team with users and skills
    initialTeams[0].addUser(initialUsers[0]);
    initialTeams[0].addUser(usersList[1]);
    initialTeams[0].addQueue(queuesList[0]);
    initialTeams[0].addQueue(queuesList[1]);

    initialTeamsData = {
        "initialTeams" : initialTeams,
        "initialUsers" : initialUsers,
        "initialQueues" : initialQueues
    }

    return initialTeamsData;
}

module.exports.setInitialTeamsData = setInitialTeamsData;
