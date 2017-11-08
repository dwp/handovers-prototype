const HandoverNote = require('../models/handover-note');
class Handover {
    constructor(id, nino, staffId, owningOfficeId, benefitId, typeId, reasonId, callback, priority) {
        this.id = id;
        this.nino = nino;
        this.staffId = staffId;
        this.owningOfficeId = owningOfficeId;
        this.benefitId = benefitId;
        this.typeId = typeId;
        this.reasonId = reasonId;
        this.timeAndDateRaised;
        this.targetTime;
        this.callback = callback;
        this.priority = priority;
        this.attachments = [];
        this.notes = [];
    }

    addAttachment(attachment) {
        this.attachments.push(attachment);
    }

    addNote(noteId, user, content) {
        var handoverId = this.id;
        var dateNoteAdded = new Date();
        var userWhoAddedNote = user;
        var noteContent = content;
        var handoverNote = new HandoverNote(noteId, handoverId, dateNoteAdded, userWhoAddedNote, noteContent)
        this.notes.push(handoverNote);
    }

    setTimeAndDateRaised() {
        this.timeAndDateRaised = new Date();
    }

    // For now, this simply adds three hours if it is a callback type, or return null if not callback type.
    // Will need to be offset for service hours in real application if callback type.

    calculateTargetTime() {

        var targetTime = this.timeAndDateRaised;
        if (this.callback === 1) {
            targetTime.setHours(targetTime.getHours() + 3);
        }
        this.targetTime = targetTime;
    }
}

module.exports = Handover;
