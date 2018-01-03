/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Not currently used
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

class Office {
    constructor(id, officeName, officePostcode) {
        this.id= id;
        this.officeName = officeName;
        this.officePostcode = officePostcode;
        this.officeSkillsetsList = [];
    }

    addSkillset(skillset) {
        this.officeSkillsetList.push(skillset);
    }

    addSkillsetsList(skillsetsList) {
        this.officeSkillsetsList = skillsetsList;
    }
}

module.exports = Office;