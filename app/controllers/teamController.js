const sIDU = require('../utils/setInitialDataUtils');
const userUtils = require('../utils/userUtils');
const queueUtils = require('../utils/queueUtils');
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
    let initialTeamsQueuesAndUsersData = sIDU.setInitialTeamsQueuesAndUsersData();
    let initialTeams = initialTeamsQueuesAndUsersData.initialTeams;
    let fullUsersList = sIDU.setInitialUsersData();
    let team = req.session.team ? req.session.team : initialTeams[0];

    // Get list of users not already members of this team, and so available to be selected
    let availableUsersList = userUtils.getListOfAvailableUsers(team, fullUsersList);

    teamAndAvailableUsersList = {
        team : team,
        availableUsers : availableUsersList
    };

    req.session.teamAndAvailableUsersList = teamAndAvailableUsersList;

    res.render('team-edit-users', teamAndAvailableUsersList);

}

function teamUserAddPageAction (req, res) {

    let teamAndAvailableUsersList = req.session.teamAndAvailableUsersList ? req.session.teamAndAvailableUsersList : console.log("Nothing in teamAndAvailableUsersList session object");
    let team = teamAndAvailableUsersList.team;
    let newTeam = new Object();
    let selectedUserStaffId = req.body['selected-user'];
    let availableUsersList = teamAndAvailableUsersList.availableUsers;
    let userToAddToTeam = availableUsersList.find(findSelectedUserByStaffId);

    if(userToAddToTeam === false) {
        console.log('User not found in list');
    } else {
        newTeam.id = team.id
        newTeam.teamName = team.teamName;
        newTeam.userList = team.userList;
        newTeam.queueList = team.queueList;
        newTeam.startDate = team.startDate;
        newTeam.endDate = team.endDate;
        newTeam.userList.push(userToAddToTeam);
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

    let teamAndAvailableQueuesList;
    let initialData = sIDU.setInitialTeamsQueuesAndUsersData();
    let fullQueuesList = initialData.initialQueues;
    let team = req.session.team ? req.session.team : initialData.initialTeams[0];

    // Get list of queues not already possessed by this team, and so available to be selected
    let availableQueuesList = queueUtils.getListOfAvailableQueues(team, fullQueuesList);


    teamAndAvailableQueuesList = {
        team : team,
        availableQueues : availableQueuesList
    };

    req.session.teamAndAvailableQueuesList = teamAndAvailableQueuesList;

    res.render('team-edit-queues', teamAndAvailableQueuesList);

}

function teamQueueAddPageAction (req, res) {

    let teamAndAvailableQueuesList = req.session.teamAndAvailableQueuesList ? req.session.teamAndAvailableQueuesList : console.log("Nothing in teamAndAvailableQueuesList session object");
    let team = teamAndAvailableQueuesList.team;
    let newTeam = new Object();
    let selectedQueueId = req.body['selected-queue'];
    let availableQueuesList = teamAndAvailableQueuesList.availableQueues;
    let queueToAddToTeam = availableQueuesList.find(findSelectedQueueByQueueId);


    if(queueToAddToTeam === false) {
        console.log('User not found in list');
    } else {
        newTeam.id = team.id
        newTeam.teamName = team.teamName;
        newTeam.userList = team.userList;
        newTeam.queueList = team.queueList;
        newTeam.startDate = team.startDate;
        newTeam.endDate = team.endDate;
        newTeam.queueList.push(queueToAddToTeam);
    }

    req.session.team = newTeam;
    res.redirect('/team/queue/add');

    function findSelectedQueueByQueueId(listOfQueues) {
        return listOfQueues.id === selectedQueueId;
    }
}

module.exports.teamUserAddPage = teamUserAddPage;
module.exports.teamUserAddPageAction = teamUserAddPageAction;
module.exports.teamQueueAddPage = teamQueueAddPage;
module.exports.teamQueueAddPageAction = teamQueueAddPageAction;