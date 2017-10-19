const Team = require('../models/team');
const User = require('../models/user');
const Skill = require('../models/skill');
const teamData = require('../data/teamData.json');

function setInitialTeamsData() {

    var initialTeamsData;
    var initialTeams = [];
    var initialUsers = [];
    var initialSkills = [];

    // Get teams, users, and skills, from json file data
    var teamsList = teamData['teams'];
    var usersList = teamData['users'];
    var skillsList = teamData['skills'];

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

    // Set up list of skill objects from json file data
    for (var i=0; i < skillsList.length; i++) {
        var id = skillsList[i].id;
        var name = skillsList[i].name;
        var description = skillsList[i].description;
        var skill = new Skill(id, name, description);
        initialSkills.push(skill);
    }

    // Set up one team with users and skills
    initialTeams[0].addUser(initialUsers[0]);
    initialTeams[0].addUser(usersList[1]);
    initialTeams[0].addSkill(skillsList[0]);
    initialTeams[0].addSkill(skillsList[1]);

    initialTeamsData = {
        "initialTeams" : initialTeams,
        "initialUsers" : initialUsers,
        "initialSkills" : initialSkills
    }

    return initialTeamsData;
}

module.exports.setInitialTeamsData = setInitialTeamsData;
