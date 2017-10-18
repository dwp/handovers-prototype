function getListOfAvailableUsers(team, fullUserList) {

    var availableUsers = [];
    var allUsers = fullUserList;

    for (var i=0; i < allUsers.length; i++) {
        if (checkIfUserAlreadyInTeam(allUsers[i], team) === false) {
            var availableUser = allUsers[i];
            availableUsers.push(availableUser);
        }
    }
    return availableUsers;
}

function checkIfUserAlreadyInTeam(user, team) {
    var result = false;
    var inputTeamUsers = team.userList;

    for (var j=0; j < inputTeamUsers.length; j++) {
        if (user.staffId === inputTeamUsers[j].staffId) {
            result = true;
        }
    }

    return result;
}

module.exports.getListOfAvailableUsers = getListOfAvailableUsers;