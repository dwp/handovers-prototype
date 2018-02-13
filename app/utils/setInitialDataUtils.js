const Customer = require('../models/Customer.model');
const Handover = require('../models/Handover.model');
const HandoverNote = require('../models/HandoverNote.model');
const HandoverType = require('../models/HandoverType.model');
const HandoverReason = require('../models/HandoverReason.model');
const Benefit = require('../models/Benefit.model');
const BenefitSubType = require('../models/BenefitSubType.model');
const benefitsData = require('../data/benefitsData.json');
const customerData = require('../data/customerData.json');
const handoverData = require('../data/handoverData.json');
const officeData = require('../data/officeData.json');
const teamData = require('../data/teamData.json');
const dateUtils = require('../utils/dateUtils');


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Customers Data Setup
/*
/*                Set up initial customers data from json file, and return in an array of Customer objects
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/


function setInitialCustomersData() {

    let customersList = customerData['customers'];
    let initialCustomers = [];
    for (let i=0; i < customersList.length; i++) {
        let dob = new Date(customersList[i].dob);
        let customer = customersList[i];
        customer.dob = dob;
        let initialCustomer = new Customer(customer)
        initialCustomers.push(initialCustomer);
    }
    return initialCustomers;
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
    let initialBenefitSubTypes;
    let initialHandoverTypes;
    let initialHandoverReasons;
    let initialHandovers;
    initialBenefits = setInitialBenefitsData();
    initialBenefitSubTypes = setInitialBenefitSubTypesData();
    initialHandoverTypes = setInitialHandoverTypesData();
    initialHandoverReasons = setInitialHandoverReasonsData();
    initialHandovers = setInitialHandoversData();
    initialBenefitsAndHandoversData = {
        "initialBenefits"       : initialBenefits,
        "initialBenefitSubTypes": initialBenefitSubTypes,
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
        let benefit = new Benefit(benefitsList[i]);
        initialBenefits.push(benefit);
    }
    return initialBenefits;
}

function setInitialBenefitSubTypesData() {

    let benefitSubTypesList = benefitsData['benefitSubTypes'];
    let initialBenefitSubTypes = [];
    for (let i=0; i < benefitSubTypesList.length; i++) {
        let benefitSubType = new BenefitSubType(benefitSubTypesList[i]);
        initialBenefitSubTypes.push(benefitSubType);
    }
    return initialBenefitSubTypes;
}

// Set up initial handover types data and return in an array
function setInitialHandoverTypesData() {

    let handoverTypesList = benefitsData['handoverTypes'];
    let initialHandoverTypes = [];
    for (let i = 0; i < handoverTypesList.length; i++) {
        let handoverType = new HandoverType(handoverTypesList[i]);
        initialHandoverTypes.push(handoverType);
    }
    return initialHandoverTypes;
}
// Set up initial handover reasons data and return in an array
function setInitialHandoverReasonsData() {

    let handoverReasonsList = benefitsData['handoverReasons'];
    let initialHandoverReasons = [];
    for (let i = 0; i < handoverReasonsList.length; i++) {
        let handoverReason = new HandoverReason(handoverReasonsList[i]);
        initialHandoverReasons.push(handoverReason);
    }
    return initialHandoverReasons;
}

// Set up initial handover data, including one handover containing handover notes
function setInitialHandoversData() {
    let handoversList = handoverData['handovers'];
    let initialHandovers = [];
    for (let i=0; i < handoversList.length; i++) {
        let handover = handoversList[i];
        handover.dateAndTimeRaised = new Date(handoversList[i].dateAndTimeRaised);
        handover.targetDateAndTime = new Date(handoversList[i].dateAndTimeRaised);
        handover.targetDateAndTime.setHours(handover.targetDateAndTime.getHours() + 3);
        handover.notes = null;
        let initialHandover = new Handover(handover);
        initialHandovers.push(initialHandover);
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
        let handoverNote = handoverNotesList[i];
        handoverNote.dateNoteAdded = new Date(handoverNotesList[i].dateNoteAdded);
        handoverNote.userWhoAddedNote = parseInt(handoverNotesList[i].userWhoAddedNote);
        let initialHandoverNote = new HandoverNote(handoverNote);
        initialHandoverNotes.unshift(initialHandoverNote);
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
        team.skillsetList = teamsList[i].skillsetList;
        team.startDate = teamsList[i].startDate;
        team.endDate = teamsList[i].endDate;
        initialTeams.push(team);
    }

    return initialTeams;
}

// Set up initial skillsets data and return in an array
function setInitialSkillsetsData() {
    let initialSkillsets = [];
    let skillsetsList = teamData['skillsets'];

    for (let i=0; i < skillsetsList.length; i++) {
        let skillset = new Object();
        skillset.id = skillsetsList[i].id;
        skillset.name = skillsetsList[i].name;
        skillset.description = skillsetsList[i].description;
        initialSkillsets.push(skillset);
    }

    return initialSkillsets;
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
        user.role = usersList[i].role;
        initialUsers.push(user);
    }
    return initialUsers;

}

module.exports.setInitialCustomersData = setInitialCustomersData;
module.exports.setInitialBenefitsData = setInitialBenefitsData;
module.exports.setInitialBenefitsAndHandoversData = setInitialBenefitsAndHandoversData;
module.exports.setInitialHandoversData = setInitialHandoversData;
module.exports.setInitialOfficeTypesAndOfficesData = setInitialOfficeTypesAndOfficesData;
module.exports.setInitialOfficesData = setInitialOfficesData;
module.exports.setInitialOfficeTypesData = setInitialOfficeTypesData;
module.exports.setInitialTeamsData = setInitialTeamsData;
module.exports.setInitialSkillsetsData = setInitialSkillsetsData;
module.exports.setInitialUsersData = setInitialUsersData;