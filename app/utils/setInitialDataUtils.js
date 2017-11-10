const claimantData = require('../data/claimantData.json');
const benefitsData = require('../data/benefitsData.json');
const teamData = require('../data/teamData.json');
const officeData = require('../data/officeData.json');
const handoverData = require('../data/handoverData.json');

function setInitialClaimantsData() {

    let initialClaimants = [];
    let claimantsList = claimantData['claimants'];

    for (let i=0; i < claimantsList.length; i++) {
        let claimant = new Object();
        claimant.firstName = claimantsList[i].firstName;
        claimant.lastName = claimantsList[i].lastName;
        claimant.dob = claimantsList[i].dob;
        claimant.nino = claimantsList[i].nino;
        claimant.telNum = claimantsList[i].telNum;
        claimant.mobile = claimantsList[i].mobile;
        claimant.postcode = claimantsList[i].postcode;
        claimant.welshSpeaker = claimantsList[i].welshSpeaker;

        initialClaimants.push(claimant);
    }

    return initialClaimants;

}

function setInitialBenefitsData() {

    let initialBenefits = [];
    let benefitsList = benefitsData['benefitTypes'];

    for (let i=0; i < benefitsList.length; i++) {
        let benefit = new Object();
        benefit.id= benefitsList[i].id;
        benefit.benefitName = benefitsList[i].benefitName;
        if (benefit.id === 5) {
            benefit.benefitSubTypes = benefitsList.benefitSubTypes;
        }
        initialBenefits.push(benefit);
    }

    return initialBenefits;

}

function setInitialTeamsQueuesAndUsersData() {
    let initialTeamsData;
    let initialTeams = setInitialTeamsData();
    let initialQueues = setInitialQueuesData();
    let initialUsers = setInitialUsersData();
    initialTeams[0].userList.push(initialUsers[0]);
    initialTeams[0].userList.push(initialUsers[1]);
    initialTeams[0].queueList.push(initialQueues[0]);
    initialTeams[0].queueList.push(initialQueues[1]);

    initialTeamsData = {
        "initialTeams" : initialTeams,
        "initialUsers" : initialUsers,
        "initialQueues" : initialQueues
    }

    return initialTeamsData;

}

function setInitialOfficeTypesAndOfficesData() {
    let initialOfficesData;
    let initialOfficeTypes = [];
    let initialOffices = [];
    let officeTypesList = officeData['officeTypes'];
    let officesList = officeData['offices'];

    for (let i=0; i < officeTypesList.length; i++) {
        let officeType = new Object();
        officeType.id = officeTypesList[i].id;
        officeType.officeType = officeTypesList[i].officeType;
        initialOfficeTypes.push(officeType);

    for (let i=0; i < officesList.length; i++) {
        let office = new Object();
        office.id = officesList[i].id;
        office.officeName = officesList[i].officeName;
        office.officeType = officesList[i].officeType:
        office.postcode = officesList[i].postcode;
        initialOffices.push(office);

    initialOfficesData = {
        "initialOfficeTypes" : initialOfficeTypes,
        "initialOffices" : initialOffices
    }

    return initialOfficesData;

}

function setInitialTeamsData() {
    let initialTeams = [];
    let teamsList = teamData['teams'];

    for (let i=0; i < teamsList.length; i++) {
        let team = new Object();
        team.id= teamsList[i].id;
        team.teamName = teamsList[i].teamName;
        team.userList = teamsList[i].userList;
        team.queueList = teamsList[i].queueList;
        team.startDate = teamsList[i].startDate;
        team.endDate = teamsList[i].endDate;
        initialTeams.push(team);
    }

    return initialTeams;
}

function setInitialQueuesData() {
    let initialQueues = [];
    let queuesList = teamData['queues'];

    for (let i=0; i < queuesList.length; i++) {
        let queue = new Object();
        queue.id = queuesList[i].id;
        queue.name = queuesList[i].name;
        queue.description = queuesList[i].description;
        initialQueues.push(queue);
    }

    return initialQueues;
}

function setInitialUsersData() {
    let initialUsers = [];
    let usersList = teamData['users'];

    for (let i=0; i < usersList.length; i++) {
        let user = new Object();
        user.firstName = usersList[i].firstName;
        user.lastName = usersList[i].lastName;
        user.staffId = usersList[i].staffId;
        user.telNum = usersList[i].telNum;
        user.officeId = usersList[i].officeId;
        initialUsers.push(user);
    }
    return initialUsers;

}



module.exports.setInitialClaimantsData = setInitialClaimantsData;
module.exports.setInitialBenefitsData = setInitialBenefitsData;
module.exports.setInitialTeamsQueuesAndUsersData = setInitialTeamsQueuesAndUsersData;
module.exports.setInitialOfficeTypesAndOfficesData = setInitialOfficeTypesAndOfficesData;
module.exports.setInitialTeamsData = setInitialTeamsData;
module.exports.setInitialQueuesData = setInitialQueuesData;
module.exports.setInitialUsersData = setInitialUsersData;