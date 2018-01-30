class Handover {
    constructor(properties) {
        this.id = properties.id;
        this.nino = properties.nino;
        this.staffId = properties.staffId;
        this.owningOfficeId = properties.owningOfficeId;
        this.raisedByStaffId = properties.raisedByStaffId;
        this.inQueueOfStaffId = properties.inQueueOfStaffId;
        this.receivingOfficeId = properties.receivingOfficeId;
        this.benefitId = properties.benefitId;
        this.benSubType = properties.benSubType;
        this.typeId = properties.typeId;
        this.reasonId = properties.reasonId;
        this.dateAndTimeRaised = properties.dateAndTimeRaised;
        this.dateAndTimeRaisedForDisplay;
        this.targetDateAndTime = properties.targetDateAndTime;
        this.targetDateAndTimeForDisplay;
        this.callback = properties.callback;
        this.callbackStatus =  properties.callbackStatus;
        this.firstCallBackResult = properties.firstCallBackResult;
        this.secondCallBackResult = properties.secondCallBackResult;
        this.thirdCallBackResult= properties.thirdCallBackResult;
        this.status = properties.status;
        this.escalated = properties.escalated;
        this.attachments = properties.attachments;
        this.notes = properties.notes;
    }
}

module.exports = Handover;


