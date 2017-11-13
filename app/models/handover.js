/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Not currently used in prototype
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

const HandoverNote = require('../models/handover-note');
class Handover {
    constructor(id, nino, staffId, owningOfficeId, benefitId, typeId, reasonId, dateAndTimeRaised, targetDateAndTime, callback, priority) {
        this.id = id;
        this.nino = nino;
        this.staffId = staffId;
        this.owningOfficeId = owningOfficeId;
        this.benefitId = benefitId;
        this.typeId = typeId;
        this.reasonId = reasonId;
        this.dateAndTimeRaised = dateAndTimeRaised;
        this.dateAndTimeRaisedForDisplay;
        this.targetDateAndTime = targetDateAndTime;
        this.targetDateAndTimeForDisplay;
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
        this.notes.unshift(handoverNote);
    }

}

module.exports = Handover;


