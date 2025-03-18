import abcjs from "abcjs";
import "./noteRenderer.css";

export function renderNotes(elementID: string, noteString : string, activeNoteNumber: number) {
    abcjs.renderAbc(elementID, noteString, {
        clickListener: () => {

        }
    });

    const notes = document.getElementById(elementID)?.querySelectorAll("[data-index]");
    if (!notes || notes.length - 1 < activeNoteNumber) {
        return;
    }

    const activeNote = notes.item(activeNoteNumber);
    activeNote.classList.add("abcjs-active-note");    
}