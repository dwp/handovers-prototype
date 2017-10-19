const Team = require('../models/team');
const teamUtils = require('../utils/teamUtils');
const userUtils = require('../utils/userUtils');
const skillUtils = require('../utils/skillUtils');
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Team Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

//function teamViewPage (req, res) {
//
//}
//
//function teamEditPage (req,res) {
//
//}
//
//function teamEditPageAction (req, res) {
//
//}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Team Member Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/


function teamUserAddPage (req, res) {

    var initialData = teamUtils.setInitialTeamsData();
    var team = req.session.team ? req.session.team : initialData.initialTeams[0];
    var fullUserList = initialData.initialUsers;
    // Get list of users not already members of this team, and so available to be selected
    var availableUsers = userUtils.getListOfAvailableUsers(team, fullUserList);
    var teamAndAvailableUsersList;

    teamAndAvailableUsersList = { team : team,
                                  availableUsers : availableUsers
                                };

    req.session.teamAndAvailableUsersList = teamAndAvailableUsersList;

    res.render('team-edit-users', teamAndAvailableUsersList);

}

function teamUserAddPageAction (req, res) {

    var oldTeamAndAvailableUsersList = req.session.teamAndAvailableUsersList ? req.session.teamAndAvailableUsersList : console.log("Nothing in teamAndAvailableUsersList session object");
    var team = oldTeamAndAvailableUsersList.team;
    var selectedUserStaffId = req.body['selected-user'];
    var availableUsersList = oldTeamAndAvailableUsersList.availableUsers;
    var userToAddToTeam = availableUsersList.find(findSelectedUserByStaffId);

    if(userToAddToTeam === false) {
        console.log('User not found in list');
    } else {
        var newTeam = new Team(team.teamName, team.startDate, team.endDate);
        newTeam.addUserList(team.userList);
        newTeam.addUser(userToAddToTeam);
    }
    req.session.team = newTeam;
    res.redirect('/team/user/add');

    function findSelectedUserByStaffId(listOfUsers) {
        return listOfUsers.staffId === selectedUserStaffId;
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Team Skill Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function teamSkillAddPage (req, res) {

    var initialData = teamUtils.setInitialTeamsData();
    var team = req.session.team ? req.session.team : initialData.initialTeams[0];
    var fullSkillList = initialData.initialSkills;
    // Get list of skills not already possessed by this team, and so available to be selected
    var availableSkills = skillUtils.getListOfAvailableSkills(team, fullSkillList);
    var teamAndAvailableSkillsList;

    teamAndAvailableSkillsList = { team : team,
        availableSkills : availableSkills
    };

    req.session.teamAndAvailableSkillsList = teamAndAvailableSkillsList;

    res.render('team-edit-skills', teamAndAvailableSkillsList);

}

function teamSkillAddPageAction (req, res) {

    var oldTeamAndAvailableSkillsList = req.session.teamAndAvailableSkillsList ? req.session.teamAndAvailableSkillsList : console.log("Nothing in teamAndAvailableSkillsList session object");
    var team = oldTeamAndAvailableSkillsList.team;
    var selectedSkillId = req.body['selected-skill'];
    var availableSkillsList = oldTeamAndAvailableSkillsList.availableSkills;
    var skillToAddToTeam = availableSkillsList.find(findSelectedSkillBySkillId);

    if(skillToAddToTeam === false) {
        console.log('Skill not found in list');
    } else {
        var newTeam = new Team(team.teamName, team.startDate, team.endDate);
        newTeam.addSkillList(team.skillList);
        newTeam.addSkill(skillToAddToTeam);
    }
    req.session.team = newTeam;
    res.redirect('/team/skill/add');

    function findSelectedSkillBySkillId(listOfSkills) {
        return listOfSkills.id === selectedSkillId;
    }
}


//module.exports.teamViewPage = teamViewPage;
//module.exports.teamEditPage = teamEditPage;
//module.exports.teamEditPageAction= teamEditPageAction;
module.exports.teamUserAddPage = teamUserAddPage;
module.exports.teamUserAddPageAction = teamUserAddPageAction;
module.exports.teamSkillAddPage = teamSkillAddPage;
module.exports.teamSkillAddPageAction = teamSkillAddPageAction;