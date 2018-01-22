class HandoverNote {
    constructor(properties) {
        this.id = properties.id;
        this.handoverId = properties.handoverId;
        this.dateNoteAdded = properties.dateNoteAdded;
        this.userWhoAddedNote = properties.userWhoAddedNote;
        this.noteContent = properties.noteContent;
    }
}

module.exports = HandoverNote;