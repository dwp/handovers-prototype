/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
/*                                        Not currently used
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

class HandoverNote {
    constructor(id, handoverId, dateNoteAdded, userWhoAddedNote, noteContent) {
        this.id = id;
        this.handoverId = handoverId;
        this.dateNoteAdded = dateNoteAdded;
        this.userWhoAddedNote = userWhoAddedNote;
        this.noteContent = noteContent;
    }
}

module.exports = HandoverNote;