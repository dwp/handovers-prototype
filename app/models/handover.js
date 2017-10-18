class Handover {
    constructor(id, claimantNino, staffId, owningOfficeId, benefitId, typeId, reasonId, callback, priority) {
        this.id = id;
        this.claimantNino = claimantNino;
        this.staffId = staffId;
        this.owningOfficeId = owningOfficeId;
        this.benefitId = benefitId;
        this.typeId = typeId;
        this.reasonId = reasonId;
        this.timeAndDateRaised = this.setTimeAndDateRaised();
        this.targetTime = this.calculateTargetTime();
        this.callback = callback;
        this.priority = priority;
    }

    // For now, this simply adds three hours if it is a callback type, or return null if not callback type.
    // Will need to be offset for service hours in real application if callback type.

    setTimeAndDateRaised() {
        this.timeAndDateRaised = new Date();

    }

    calculateTargetTime() {

        var targetTime = this.timeAndDateRaised;
        if (this.callback === 1) {
            targetTime.setHours(targetTime.getHours() + 3);
        }
        return targetTime;

    }
}

module.exports = Handover;