

function getOfficeByIdFromListOfOffices(officesList, id) {

    let offices = officesList;
    let inputId = id || 1;
    let foundOffice = {};
    for (let i=0; i < offices.length; i++) {
        let officeId = offices[i].id;
        if (officeId == inputId) {
            let office = offices[i];

            foundOffice = {
                "id": office.id,
                "officeName": office.officeName,
                "officeTypeId" : office.officeTypeId,
                "postcode": office.postcode
            };

        }
    }
    return foundOffice;
}

function findPositionOfOfficeTypeInArray(officeTypeId, officeTypesList) {

        let positionInArray;
        let officeTypes = officeTypesList;
        let arrLength = officeTypes.length;
        let queryId = parseInt(officeTypeId);


        for (let i = 0; i < arrLength; i++) {
            if (parseInt(officeTypes[i].id) === queryId) {
                positionInArray = i;
            }
        }

        return positionInArray;
    }

module.exports.getOfficeByIdFromListOfOffices = getOfficeByIdFromListOfOffices;
module.exports.findPositionOfOfficeTypeInArray = findPositionOfOfficeTypeInArray;