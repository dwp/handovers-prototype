function getListOfAvailableSkills(team, fullSkillList) {

    var availableSkills = [];
    var allSkills = fullSkillList;

    for (var i=0; i < allSkills.length; i++) {
        if (checkIfSkillAlreadyInTeam(allSkills[i], team) === false) {
            var availableSkill = allSkills[i];
            availableSkills.push(availableSkill);
        }
    }
    return availableSkills;
}

function checkIfSkillAlreadyInTeam(skill, team) {
    var result = false;
    var inputTeamSkills = team.skillList;

    for (var j=0; j < inputTeamSkills.length; j++) {
        //console.log('team.skillList: ', team.skillList);
        //console.log('skill.id: ', skill.id);
        //console.log('inputTeamsSkills.id: ', inputTeamSkills[j].id);

        if (skill.id === inputTeamSkills[j].id) {
            result = true;
        }
    }

    return result;
}

module.exports.getListOfAvailableSkills = getListOfAvailableSkills;