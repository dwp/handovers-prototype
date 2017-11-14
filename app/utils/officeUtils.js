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


module.exports.getOfficeByIdFromListOfOffices = getOfficeByIdFromListOfOffices;
