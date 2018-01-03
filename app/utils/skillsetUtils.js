function getListOfAvailableSkillsets(team, allSkillsetsList) {

    var availableSkillsets = [];
    var allSkillsets = allSkillsetsList;

    for (var i=0; i < allSkillsets.length; i++) {
        if (checkIfSkillsetAlreadyInTeam(allSkillsets[i], team) === false) {
            var availableSkillset = allSkillsets[i];
            availableSkillsets.push(availableSkillset);
        }
    }
    return availableSkillsets;
}

function checkIfSkillsetAlreadyInTeam(skillset, team) {
    var result = false;
    var inputTeamSkillsets = team.skillsetList;

    for (var j=0; j < inputTeamSkillsets.length; j++) {

        if (skillset.id === inputTeamSkillsets[j].id) {
            result = true;
        }
    }

    return result;
}

module.exports.getListOfAvailableSkillsets = getListOfAvailableSkillsets;