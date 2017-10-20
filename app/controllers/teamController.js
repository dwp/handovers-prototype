const Team = require('../models/team');
const teamUtils = require('../utils/teamUtils');
const userUtils = require('../utils/userUtils');
const queueUtils = require('../utils/queueUtils');
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

    var teamAndAvailableUsersList;
    var initialData = teamUtils.setInitialTeamsData();
    var fullUsersList = initialData.initialUsers;
    var team = req.session.team ? req.session.team : initialData.initialTeams[0];

    // Get list of users not already members of this team, and so available to be selected
    var availableUsersList = userUtils.getListOfAvailableUsers(team, fullUsersList);

    teamAndAvailableUsersList = {
        team : team,
        availableUsers : availableUsersList
    };

    req.session.teamAndAvailableUsersList = teamAndAvailableUsersList;

    res.render('team-edit-users', teamAndAvailableUsersList);

}

function teamUserAddPageAction (req, res) {

    var teamAndAvailableUsersList = req.session.teamAndAvailableUsersList ? req.session.teamAndAvailableUsersList : console.log("Nothing in teamAndAvailableUsersList session object");
    var team = teamAndAvailableUsersList.team;
    var selectedUserStaffId = req.body['selected-user'];
    var availableUsersList = teamAndAvailableUsersList.availableUsers;
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
/*                                        Team Queue Controllers
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function teamQueueAddPage (req, res) {

    var teamAndAvailableQueuesList;
    var initialData = teamUtils.setInitialTeamsData();
    var fullQueuesList = initialData.initialQueues;
    var team = req.session.team ? req.session.team : initialData.initialTeams[0];

    // Get list of queues not already possessed by this team, and so available to be selected
    var availableQueuesList = queueUtils.getListOfAvailableQueues(team, fullQueuesList);


    teamAndAvailableQueuesList = {
        team : team,
        availableQueues : availableQueuesList
    };

    req.session.teamAndAvailableQueuesList = teamAndAvailableQueuesList;

    res.render('team-edit-queues', teamAndAvailableQueuesList);

}

function teamQueueAddPageAction (req, res) {

    var teamAndAvailableQueuesList = req.session.teamAndAvailableQueuesList ? req.session.teamAndAvailableQueuesList : console.log("Nothing in teamAndAvailableQueuesList session object");
    var team = teamAndAvailableQueuesList.team;
    var selectedQueueId = req.body['selected-queue'];
    var availableQueuesList = teamAndAvailableQueuesList.availableQueues;
    var queueToAddToTeam = availableQueuesList.find(findSelectedQueueByQueueId);

    if(queueToAddToTeam === false) {
        console.log('Queue not found in list');
    } else {
        var newTeam = new Team(team.teamName, team.startDate, team.endDate);
        newTeam.addQueueList(team.queueList);
        newTeam.addQueue(queueToAddToTeam);
    }
    req.session.team = newTeam;
    res.redirect('/team/queue/add');

    function findSelectedQueueByQueueId(listOfQueues) {
        return listOfQueues.id === selectedQueueId;
    }
}


//module.exports.teamViewPage = teamViewPage;
//module.exports.teamEditPage = teamEditPage;
//module.exports.teamEditPageAction= teamEditPageAction;
module.exports.teamUserAddPage = teamUserAddPage;
module.exports.teamUserAddPageAction = teamUserAddPageAction;
module.exports.teamQueueAddPage = teamQueueAddPage;
module.exports.teamQueueAddPageAction = teamQueueAddPageAction;