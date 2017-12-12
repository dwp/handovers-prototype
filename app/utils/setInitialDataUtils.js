const benefitsData = require('../data/benefitsData.json');
const claimantData = require('../data/claimantData.json');
const handoverData = require('../data/handoverData.json');
const officeData = require('../data/officeData.json');
const teamData = require('../data/teamData.json');
const dateUtils = require('../utils/dateUtils');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Claimants Data Setup
/*
/*                Set up initial claimants data from json file, and return in an array
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/


function setInitialClaimantsData() {

    let claimantsList = claimantData['claimants'];
    let initialClaimants = [];
    for (let i=0; i < claimantsList.length; i++) {
        let claimant = new Object();
        let dob = new Date(claimantsList[i].dob);
        claimant.firstName = claimantsList[i].firstName;
        claimant.lastName = claimantsList[i].lastName;
        claimant.dob = dob;
        claimant.nino = claimantsList[i].nino;
        claimant.preferredContactNumber = claimantsList[i].preferredContactNumber;
        claimant.emailAddress = claimantsList[i].emailAddress;
        claimant.postcode = claimantsList[i].postcode;
        claimant.claimantOfficeId = claimantsList[i].claimantOfficeId;
        claimant.welshSpeaker = claimantsList[i].welshSpeaker;
        claimant.language = claimantsList[i].language;
        claimant.translator = claimantsList[i].translator;
        claimant.approvedRepName = claimantsList[i].approvedRepName;
        claimant.approvedRepContact = claimantsList[i].approvedRepContact;
        initialClaimants.push(claimant);
    }
    return initialClaimants;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Benefits & Handovers Data Setup
/*
/* Set up initial data for benefits, handover reasons, handover types, and handovers, and return in an object containing four arrays
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function setInitialBenefitsAndHandoversData() {

    let initialBenefitsAndHandoversData;
    let initialBenefits;
    let initialHandoverTypes;
    let initialHandoverReasons;
    let initialHandovers;
    initialBenefits = setInitialBenefitsData();
    initialHandoverTypes = setInitialHandoverTypesData();
    initialHandoverReasons = setInitialHandoverReasonsData();
    initialHandovers = setInitialHandoversData();
    initialBenefitsAndHandoversData = {
        "initialBenefits"       : initialBenefits,
        "initialHandoverTypes"  : initialHandoverTypes,
        "initialHandoverReasons": initialHandoverReasons,
        "initialHandovers"      : initialHandovers
    }
    return initialBenefitsAndHandoversData;
}

// Set up initial benefits data and return in an array
function setInitialBenefitsData() {

    let benefitsList = benefitsData['benefitTypes'];
    let initialBenefits = [];
    for (let i=0; i < benefitsList.length; i++) {
        let benefit = new Object();
        benefit.id = benefitsList[i].id;
        benefit.benefitName = benefitsList[i].benefitName;
        if (benefit.id === '5') {
            benefit.benefitSubTypes = benefitsList.benefitSubTypes;
        }
        initialBenefits.push(benefit);
    }
    return initialBenefits;
}

// Set up initial handover types data and return in an array
function setInitialHandoverTypesData() {

    let handoverTypesList = handoverData['handoverTypes'];
    let initialHandoverTypes = [];
    for (let i = 0; i < handoverTypesList.length; i++) {
        let handoverType = new Object();
        handoverType.id = handoverTypesList[i].id;
        handoverType.handoverType = handoverTypesList[i].handoverType;
        initialHandoverTypes.push(handoverType);
    }
    return initialHandoverTypes;
}
// Set up initial handover reasons data and return in an array
function setInitialHandoverReasonsData() {

    let handoverReasonsList = handoverData['handoverReasons'];
    let initialHandoverReasons = [];
    for (let i = 0; i < handoverReasonsList.length; i++) {
        let handoverReason = new Object();
        handoverReason.id = handoverReasonsList[i].id;
        handoverReason.handoverReason = handoverReasonsList[i].handoverReason;
        initialHandoverReasons.push(handoverReason);
    }
    return initialHandoverReasons;
}

// Set up initial handover data, including one handover containing handover notes
function setInitialHandoversData() {
    let handoversList = handoverData['handovers'];
    let initialHandovers = [];
    for (let i=0; i < handoversList.length; i++) {
        let handover = new Object();
        handover.id = handoversList[i].id;
        handover.nino = handoversList[i].nino;
        handover.staffId = handoversList[i].staffId;
        handover.raisedOnBehalfOfOfficeId = handoversList[i].raisedOnBehalfOfOfficeId;
        handover.benefitId = handoversList[i].benefitId;
        handover.benSubType = handoversList[i].benSubType;
        handover.typeId = handoversList[i].typeId;
        handover.reasonId = handoversList[i].reasonId;
        handover.callback = handoversList[i].callback;
        handover.priority = handoversList[i].priority;
        handover.status = handoversList[i].status;
        handover.dateAndTimeRaised = new Date();
        handover.targetDateAndTime = new Date();
        handover.notes = null;

        if (handover.callback === '1') {
            handover.targetDateAndTime.setHours(handover.targetDateAndTime.getHours() + 3);
        }

        handover.dateAndTimeRaisedForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.dateAndTimeRaised);
        handover.targetDateAndTimeForDisplay = dateUtils.formatDateAndTimeForDisplay(handover.targetDateAndTime);

        initialHandovers.push(handover);
    }

    // Add list of notes to first handover in initialHandovers
    initialHandovers[0].notes = setInitialHandoverNotesData();

    return initialHandovers;
}

// Set up initial handover notes data, and return in an array
function setInitialHandoverNotesData() {

    let handoverNotesList = handoverData['handoverNotes'];
    let initialHandoverNotes = [];
    for (let i = 0; i < handoverNotesList.length; i++) {
        let handoverNote = new Object();
        handoverNote.id = handoverNotesList[i].id;
        handoverNote.handoverId = handoverNotesList[i].handoverId;
        handoverNote.dateNoteAdded = new Date(handoverNotesList[i].dateNoteAdded);
        handoverNote.userWhoAddedNote = parseInt(handoverNotesList[i].userWhoAddedNote);
        handoverNote.updateResultedFromCustomerContactIndicator = handoverNotesList[i].updateResultedFromCustomerContactIndicator;
        handoverNote.noteContent = handoverNotesList[i].noteContent;
        initialHandoverNotes.unshift(handoverNote);
    }

    return initialHandoverNotes;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Office Types and Offices Data Setup
/*
/*         Set up initial data for office types and offices, and return in an object containing two arrays
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

function setInitialOfficeTypesAndOfficesData() {
    let initialOfficeTypesAndOfficesData;
    let initialOfficeTypes = setInitialOfficeTypesData();
    let initialOffices = setInitialOfficesData();

    initialOfficeTypesAndOfficesData = {
        "initialOfficeTypes": initialOfficeTypes,
        "initialOffices"    : initialOffices
    }

    return initialOfficeTypesAndOfficesData;
}

function setInitialOfficeTypesData() {

    let officeTypesList = officeData['officeTypes'];
    let initialOfficeTypes = [];
    for (let i = 0; i < officeTypesList.length; i++) {
        let officeType = new Object();
        officeType.id = parseInt(officeTypesList[i].id);
        officeType.officeType = officeTypesList[i].officeType;
        initialOfficeTypes.push(officeType);
    }
    return initialOfficeTypes;
}

function setInitialOfficesData() {

    let officesList = officeData['offices'];
    let initialOffices = [];
    for (let i = 0; i < officesList.length; i++) {
        let office = new Object();
        office.id = parseInt(officesList[i].id);
        office.officeName = officesList[i].officeName;
        office.officeTypeId = parseInt(officesList[i].officeTypeId);
        office.postcode = officesList[i].postcode;
        initialOffices.push(office);
    }
    return initialOffices;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Teams, Queues, and Users Data Setup
/*
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

// Set up initial teams data and return in an array
function setInitialTeamsData() {
    let initialTeams = [];
    let teamsList = teamData['teams'];

    for (let i=0; i < teamsList.length; i++) {
        let team = new Object();
        team.id = teamsList[i].id;
        team.teamName = teamsList[i].teamName;
        team.userList = teamsList[i].userList;
        team.queueList = teamsList[i].queueList;
        team.startDate = teamsList[i].startDate;
        team.endDate = teamsList[i].endDate;
        initialTeams.push(team);
    }

    return initialTeams;
}

// Set up initial queues data and return in an array
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

// Set up initial users data and return in an array
function setInitialUsersData() {
    let initialUsers = [];
    let usersList = teamData['users'];

    for (let i=0; i < usersList.length; i++) {
        let user = new Object();
        user.firstName = usersList[i].firstName;
        user.lastName = usersList[i].lastName;
        user.staffId = usersList[i].staffId;
        user.telNum = usersList[i].telNum;
        user.owningOfficeId = usersList[i].owningOfficeId;
        initialUsers.push(user);
    }
    return initialUsers;

}

module.exports.setInitialClaimantsData = setInitialClaimantsData;
module.exports.setInitialBenefitsData = setInitialBenefitsData;
module.exports.setInitialBenefitsAndHandoversData = setInitialBenefitsAndHandoversData;
module.exports.setInitialOfficeTypesAndOfficesData = setInitialOfficeTypesAndOfficesData;
//module.exports.setInitialTeamsQueuesAndUsersData = setInitialTeamsQueuesAndUsersData;
module.exports.setInitialOfficesData = setInitialOfficesData;
module.exports.setInitialOfficeTypesData = setInitialOfficeTypesData;
module.exports.setInitialTeamsData = setInitialTeamsData;
module.exports.setInitialQueuesData = setInitialQueuesData;
module.exports.setInitialUsersData = setInitialUsersData;