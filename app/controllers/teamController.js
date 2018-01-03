const sIDU = require('../utils/setInitialDataUtils');
const userUtils = require('../utils/userUtils');
const skillsetUtils = require('../utils/skillsetUtils');
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Team Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Team Member Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function teamUserAddPage (req, res) {

    let teamAndAvailableUsersList;
    let initialTeams = sIDU.setInitialTeamsData();
    let initialUsers = sIDU.setInitialUsersData();
    let initialTeam = initialTeams[0];
    let team = req.session.team ? req.session.team : initialTeam;
    // Get list of users not already members of this team, and so available to be selected
    let availableUsersList = userUtils.getListOfAvailableUsers(team, initialUsers);
    teamAndAvailableUsersList = {
        team : team,
        availableUsers : availableUsersList
    };
    req.session.team = team;
    res.render('team-edit-users', teamAndAvailableUsersList);
}

function teamUserAddPageAction (req, res) {

    let team = req.session.team;
    let selectedUserStaffId = req.body['selected-user'];
    let initialUsers = sIDU.setInitialUsersData();
    let availableUsersList = userUtils.getListOfAvailableUsers(team, initialUsers);
    let userToAddToTeam = availableUsersList.find(findSelectedUserByStaffId);
    let newTeam = {}
    if(userToAddToTeam === false) {
        console.log('User not found in list');
    } else {
        newTeam.id = team.id;
        newTeam.teamName = team.teamName;
        newTeam.userList = team.userList;
        newTeam.skillsetList = team.skillsetList;
        newTeam.startDate = team.startDate;
        newTeam.endDate = team.endDate;
        newTeam.userList.push(userToAddToTeam);
    }
    req.session.team = newTeam;
    res.redirect('/team/user/add');

    function findSelectedUserByStaffId(availableUsersList) {
        return availableUsersList.staffId === selectedUserStaffId;
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Team Queue Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function teamSkillsetAddPage (req, res) {

    let teamAndAvailableSkillsetsList;
    let initialTeams = sIDU.setInitialTeamsData();
    let initialSkillsets = sIDU.setInitialSkillsetsData();
    let initialTeam = initialTeams[0];
    let team = req.session.team ? req.session.team : initialTeam;
    // Get list of skillsets not already assigned to this team, and so available to be selected
    let availableSkillsetsList = skillsetUtils.getListOfAvailableSkillsets(team, initialSkillsets);
    teamAndAvailableSkillsetsList = {
        team : team,
        availableSkillsets : availableSkillsetsList
    };
    req.session.team = team;
    res.render('team-edit-skillsets', teamAndAvailableSkillsetsList);
}

function teamSkillsetAddPageAction (req, res) {

    let team = req.session.team;
    let selectedSkillsetId = req.body['selected-skillset'];
    let initialSkillsets = sIDU.setInitialSkillsetsData();
    let availableSkillsetsList = skillsetUtils.getListOfAvailableSkillsets(team, initialSkillsets);
    let skillsetToAddToTeam = availableSkillsetsList.find(findSelectedSkillsetBySkillsetId);
    let newTeam = {}
    if(skillsetToAddToTeam === false) {
        console.log('Skillset not found in list');
    } else {
        newTeam.id = team.id;
        newTeam.teamName = team.teamName;
        newTeam.userList = team.userList;
        newTeam.skillsetList = team.skillsetList;
        newTeam.startDate = team.startDate;
        newTeam.endDate = team.endDate;
        newTeam.skillsetList.push(skillsetToAddToTeam);
    }
    req.session.team = newTeam;
    res.redirect('/team/skillset/add');

    function findSelectedSkillsetBySkillsetId(listOfSkillsets) {
        return listOfSkillsets.id === selectedSkillsetId;
    }
}

module.exports.teamUserAddPage = teamUserAddPage;
module.exports.teamUserAddPageAction = teamUserAddPageAction;
module.exports.teamSkillsetAddPage = teamSkillsetAddPage;
module.exports.teamSkillsetAddPageAction = teamSkillsetAddPageAction;