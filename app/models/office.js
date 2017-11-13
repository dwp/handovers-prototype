/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Not currently used in prototype
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

class Office {
    constructor(id, officeName, officePostcode) {
        this.id= id;
        this.officeName = officeName;
        this.officePostcode = officePostcode;
        this.officeQueuesList = [];
    }

    addQueue(queue) {
        this.officeQueuesList.push(queue);
    }

    addQueuesList(queueList) {
        this.officeQueuesList = queueList;
    }
}

module.exports = Office;