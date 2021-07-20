console.log("script.js loaded.");

addEventListener('DOMContentLoaded', main);


let currentId = -1;
let unsavedChanges = 0;


class Note {

    constructor(id) {
        this.id = parseInt(id);
    }

    setTitle(title) {
        this.title = title;
    }

    setContent(content) {
        this.content = content;
    }

    setTime(time) {
        this.time = time;
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    getContent() {
        return this.content;
    }

    getTime() {
        return this.time;
    }

    /**
     * Create desc from content.
     * @returns desc
     */
    getDesc() {
        content = this.content;
        let desc = content.toString().substring(0, 120);
        return desc;
    }

    /**
     * Return card html.
     * @returns note card html
     */
     getCardHtml() {
        console.log(`getting note#${this.id} card html`);
        return `<div class="noteCard mb-1 me-1" id="noteCard-${this.id}">
            <label class="noteCardTitle" id="noteCardTitle-${this.id}">${this.title}</label>
            <small class="cardId" id="noteCardId-${this.id}">#${this.id}</small>
            <br>
            <label class="noteCardDesc" id="noteCardDesc-${this.id}">${this.getDesc()}</label>
            <br>
            <div class="d-flex justify-content-between align-items-center">
                <label class="noteCardDate" id="noteCardDate-${this.id}">${this.time}</label>
                <button class="btn delete-button" id="noteCardDel-${this.id}">Delete</button>
            </div>
        </div>`;
    }

}


class NoteList {

    noteList = []

    constructor() {
        this.load();
    }

    /**
     * Return notes array.
     * @returns notes array
     */
    getNotesArray() {
        console.log(`Getting notes in array.`);
        return this.noteList;
    }

    /**
     * Find the note with given id.
     * return index position of it in array
     * return -1 if not found 
     * @param {*} id 
     * @returns index
     */
    findNote(id) {
        console.log(`Trying to find note#${id}...`);

        if(!this.noteList) {
            console.log(`noteList was empty.`);
            return -1;
        }

        let foundAtIndex = -1;
        this.noteList.forEach((note, index) => {
            if (note.id == parseInt(id)) {
                console.log(`note#${id} found at ${index} in noteList.`);
                foundAtIndex = index;
            }
        });

        if (parseInt(foundAtIndex) == -1) {
            console.log(`note#${id} not found in noteList.`);
        }
        return foundAtIndex;
    }

    /**
     * Add note to noteList.
     * @param {*} note 
     */
    addNote(note) {
        console.log(`Trying to add note#${note.id} to noteList...`);
        console.log(`Note#${note.id} pushed to noteList.`);
        this.noteList.push(note);
        this.save();
    }

    /**
     * Update the note in note list,
     * If note not present in the list then add it as new note.
     * @param {*} note 
     */
    updateNote(note) {
        console.log(`Trying to update note#${note.id}...`);
        let id = note.id;
        let index = parseInt(this.findNote(id));
        if (parseInt(index) == -1) {
            console.log(`Adding it as new note.`);
            this.addNote(note);
            return;
        }

        this.noteList.splice(index, 1, note);
        console.log(`Note#${id} updated.`);
        this.save();
    }

    /**
     * Returns note from note list.
     * returns null if not found. 
     * @param {*} id 
     * @returns note
     */
    getNote(id) {
        console.log(`Trying to get note#${id}...`);
        let index = this.findNote(id);

        if(parseInt(index) == -1) {
            console.log(`returning null`);
            return null;
        }

        console.log(`returning note#${id}`);
        return this.noteList[index];
    }

    /**
     * Delete note from note list
     * @param {*} note 
     * @returns 
     */
    deleteNote(note) {
        console.log(`Trying to delete note#${note.id}...`);
        let index = this.findNote(note.id);

        if(parseInt(index) == -1) {
            console.log(`returning`);
            return;
        }

        this.noteList.splice(index, 1);
        console.log(`note#${note.id} deleted.`);
        this.save();
    }

    /**
     * Save the note list to local storage.
     */
    save() {
        console.log(`Trying to save the notes list to storage...`);
        localStorage.setItem(`Notes`, JSON.stringify(this.noteList));
        console.log(`noteList saved to localStorage.`);
    }

    /**
     * Load the note list from storage.
     */
    load() {
        this.noteList = [];
        console.log(`Trying to load notes list from storage...`);
        let list = JSON.parse(localStorage.getItem(`Notes`));

        if(list) {
            list.forEach(element => {
                let note = new Note(element.id);
                note.setTitle(element.title);
                note.setContent(element.content);
                note.setTime(element.time);
    
                this.noteList.push(note);
            });
        }
        
        console.log(`noteList loaded from localStorage.`);
    }

    /**
     * Get last note id.
     * @returns id
     */
    getLastNoteId() {
        console.log(`Getting last note id...`);
        let id = -1;
        this.noteList.forEach(note => {
            id = note.id;
        });
        console.log(`last note id ${id}.`);
        return id;
    }

    /**
     * Get largest note id.
     * @returns id
     */
    getLargestNoteId() {
        console.log(`Getting largest note id...`);
        let id = -1;
        this.noteList.forEach(note => {
            if(id < note.id) {
                id = note.id;
            }
        });
        console.log(`Largest note id ${id}.`);
        return id;
    }

    getNewNoteId() {
        console.log(`Getting new note id...`);
        let id = this.getLastNoteId();
        id = id + 1;
        console.log(`New note id ${id}.`);
        return id;
    }

}

class Cards {

    /**
     * Add the card to card list in UI.
     */
     static add(note) {
        let card = note.getCardHtml();
        document.getElementById('noteListArea').insertAdjacentHTML('afterend', card);
        console.log(`note #${note.id} card added to HTML.`);
    }

    /**
     * Remove all the cards from cards area in UI.
     */
    static removeAll(noteList) {
        console.log(`Removing all the cards...`);
        let notes = noteList.getNotesArray();
        if (notes != []) {
            notes.forEach(note => {
                let card = document.getElementById(`noteCard-${note.id}`);
                if (card) {
                    card.remove();
                    console.log(`noteCard-${note.id} removed.`);
                }
            });
        } else {
            console.log(`Notes was empty.`);
            return;
        }
        
        console.log(`Cards removed from list`);
    }

    /**
     * Add all the cards from note list.
     * @param {*} noteList 
     */
    static addAll(noteList) {
        console.log(`Adding all the cards...`);
        let notes = noteList.noteList;
        notes.forEach(note => {
            this.add(note);
        });

        let cards = Array.from(document.getElementsByClassName(`noteCard`));
        cards.forEach(card => {
            card.addEventListener(`click`, function() {
                cardClick(card.id);
            });
        });
        let delButtons = Array.from(document.getElementsByClassName(`delete-button`));
        delButtons.forEach(button => {
            button.addEventListener(`click`, function(e) {
                e.stopPropagation();
                deleteButton(button.id);
            });
        }); 
    }

    /**
     * Refresh all the cards.
     * @param {*} noteList 
     */
    static refresh(noteList) {
        console.log(`Refreshing cards...`);
        this.removeAll(noteList);
        this.addAll(noteList);
    }


    static setActive(note, noteList) {
        let id = note.id;
        console.log(`Setting note#${id} card active...`);

        this.refresh(noteList);

        let cardId = `noteCard-${id}`;
        let card = document.getElementById(cardId);
        if (card) {
            card.setAttribute("class", "noteCardActive mb-1 me-1");
            card.removeEventListener(`click`, cardClick, false);
            console.log(`noteCard-${id} activated.`);
        } else {
            console.log(`noteCard-${id} not found.`);
            return;
        }
    }
}

class UiUtils {

    /**
     * Return the title from the field.
     * @returns title
     */
    static getTitle() {
        console.log(`Getting title field.`);
        let title = document.getElementById('noteTitleField').value.toString();
        return title;
    }

    /**
     * Set the title field.
     * @param {*} title 
     */
    static setTitle(title) {
        console.log(`Setting title field to ${title}.`);
        document.getElementById('noteTitleField').value = title;
    }

    /**
     * Get the note content from textarea.
     * @returns content
     */
    static getContent() {
        console.log(`Getting note content.`);
        let content = document.getElementById('noteTextArea').value.toString();
        return content;
    }

    /**
     * Set the textarea.
     * @param {*} content 
     */
    static setContent(content) {
        console.log(`Setting note content.`);
        document.getElementById('noteTextArea').value = content;
    }

    /**
     * Get note id from all other component id.
     * @param {*} componentId 
     * @returns note id 
     */
    static getIdFromComponentId(componentId) {
        console.log(`Getting note id from component id ${componentId}.`);
        let noteId = componentId.toString().substring(componentId.toString().indexOf('-')+1);
        console.log(`note id ${noteId} returning.`);
        return noteId;
    }

}


noteList = null;

function deleteButton(id) {
    console.log(`Delete button pressed ${id}.`);
    id = UiUtils.getIdFromComponentId(id);
    let note = noteList.getNote(id);
    if (note) {
        if (confirm(`Deleting ${note.title}. It will be unrecoverable. Are you sure?`)) {
            Cards.removeAll(noteList); // need to add because deleteNote remove it from noteList then refresh() doesn't find it there to remove it.
            noteList.deleteNote(note);
            if (currentId === parseInt(id)) {
                console.log(`Card deleted was active card. Selecting top card as active...`);
                let topNoteId = noteList.getLastNoteId();
                cardClick("Note-" + topNoteId);
            } else {
                console.log(`Trying to set current note as active again.`);
                cardClick("Note-" + currentId);
            }
        } else {
            console.log(`Delete operation declined by the user.`);
            return;
        }
    } else {
        console.log(`Note to delete was not found in the list.`);
        return;
    }

}

function cardClick(id) {
    if (unsavedChanges == 1) {
        console.log(`Unsaved changes found.`);
        if (confirm(`Unsaved changes will be lost. Do you want to proceed?`)) {
            console.log(`User allow to continue.`);
        } else {
            console.log(`User declined. Returning...`);
            return;
        }
    }
    unsavedChanges = 0;
    id = UiUtils.getIdFromComponentId(id);
    console.log(`Card for note#${id} clicked.`);
    currentId = parseInt(id);
    note = noteList.getNote(currentId);
    if (!note) {
        console.log(`returning.`);
        return;
    }
    UiUtils.setTitle(note.title);
    UiUtils.setContent(note.content);
    Cards.setActive(note, noteList);
}

function saveButton() {
    console.log(`Save Button clicked.`);
    console.log(`Trying to save note#${currentId}...`);

    let noteTitle = UiUtils.getTitle().toString();
    if (noteTitle.trim() === "" || noteTitle.length === 0) {
        console.log(`Empty title found.`);
        alert(`Title cannot be empty or spaces only`);
        return;
    }

    let noteContent = UiUtils.getContent();
    let noteTime = new Date().toLocaleString();

    note = new Note(currentId);
    note.setTitle(noteTitle);
    note.setContent(noteContent);
    note.setTime(noteTime);

    noteList.updateNote(note);
    unsavedChanges = 0;
    Cards.refresh(noteList);
    Cards.setActive(note, noteList);

}


function newNoteButton() {
    if (unsavedChanges == 1) {
        console.log(`Unsaved changes found.`);
        if (confirm(`Unsaved changes will be lost. Do you want to proceed?`)) {
            console.log(`User allow to continue.`);
        } else {
            console.log(`User declined. Returning...`);
            return;
        }
    }
    unsavedChanges = 0;
    console.log(`Creating new note.`);
    UiUtils.setTitle(``);
    UiUtils.setContent(``);
    Cards.refresh(noteList);
    currentId = noteList.getNewNoteId();
}

function main() {
    console.log(`Main...`);

    noteList = new NoteList();
    newNoteButton();
    
    document.getElementById(`save-button`).addEventListener(`click`, saveButton, false);
    document.getElementById(`newNoteButton`).addEventListener(`click`, newNoteButton, false);
    document.getElementById(`noteTextArea`).addEventListener(`keypress`, function() {
        unsavedChanges = 1;
    });
    document.getElementById(`noteTitleField`).addEventListener(`keypress`, function() {
        unsavedChanges = 1;
    });
}
