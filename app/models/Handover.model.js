class Handover {
    constructor(properties) {
        this.id = properties.id;
        this.nino = properties.nino;
        this.staffId = properties.staffId;
        this.owningOfficeId = properties.owningOfficeId;
        this.raisedByStaffId = properties.raisedByStaffId;
        this.inQueueOfStaffId = properties.inQueueOfStaffId;
        this.benefitId = properties.benefitId;
        this.typeId = properties.typeId;
        this.reasonId = properties.reasonId;
        this.dateAndTimeRaised = properties.dateAndTimeRaised;
        this.dateAndTimeRaisedForDisplay;
        this.targetDateAndTime = properties.targetDateAndTime;
        this.targetDateAndTimeForDisplay;
        this.callback = properties.callback;
        this.callbackStatus =  properties.callbackStatus;
        this.firstCallBackReason = properties.firstCallBackReason;
        this.secondCallBackReason = properties.secondCallBackReason;
        this.thirdCallBackReason= properties.thirdCallBackReason;
        this.status = properties.status;
        this.escalated = properties.escalated;
        this.attachments = properties.attachments;
        this.notes = properties.notes;
    }
}

module.exports = Handover;


