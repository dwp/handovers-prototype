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

function getUserByStaffId(listOfUsers, staffId) {
    var user = {};
    var userList = listOfUsers;
    var listLength = userList.length;
    var userFound = false;

    for (var i=0; i < listLength; i++) {
        if (userList[i].staffId === staffId) {
            userFound = true;
            user.staffId = userList[i].staffId;
            user.firstName = userList[i].firstName;
            user.lastName = userList[i].lastName;
            user.telNum = userList[i].telNum;
        }
    }

    if (userFound === false) {
        console.log("User with staff id: " + staffId + " was not found in the provided list of users");
    } else {
        return user;
    }
}

module.exports.getListOfAvailableUsers = getListOfAvailableUsers;
module.exports.getUserByStaffId = getUserByStaffId;