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
        newTeam.queueList = team.queueList;
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

function teamQueueAddPage (req, res) {

    let teamAndAvailableQueuesList;
    let initialTeams = sIDU.setInitialTeamsData();
    let initialQueues = sIDU.setInitialQueuesData();
    let initialTeam = initialTeams[0];
    let team = req.session.team ? req.session.team : initialTeam;

    // Get list of users not already members of this team, and so available to be selected
    let availableQueuesList = queueUtils.getListOfAvailableQueues(team, initialQueues);

    teamAndAvailableQueuesList = {
        team : team,
        availableQueues : availableQueuesList
    };

    req.session.team = team;
    res.render('team-edit-queues', teamAndAvailableQueuesList);

}

function teamQueueAddPageAction (req, res) {

    let team = req.session.team;
    let selectedQueueId = req.body['selected-queue'];
    let initialQueues = sIDU.setInitialQueuesData();
    let availableQueuesList = queueUtils.getListOfAvailableQueues(team, initialQueues);
    let queueToAddToTeam = availableQueuesList.find(findSelectedQueueByQueueId);
    let newTeam = {}

    if(queueToAddToTeam === false) {
        console.log('Queue not found in list');
    } else {
        newTeam.id = team.id;
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