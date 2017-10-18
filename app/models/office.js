class Office {
    constructor(id, officeName, officePostcode) {
        this.id= id;
        this.officeName = officeName;
        this.officePostcode = officePostcode;
        this.officeSkillsList = [];
    }

    addSkill(skill) {
        this.officeSkillsList.push(skill);
    }

    addSkillList(skillList) {
        this.officeSkillsList = skillList;
    }
}

module.exports = Office;