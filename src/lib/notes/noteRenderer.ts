import abcjs from "abcjs";
import "./noteRenderer.css";

export interface NoteRendererSettings {
    activeNoteNumber?: number,
    isResponsive? : boolean,  
    width? : number  
} 

export function renderNotes(elementID: string, noteString : string, settings : NoteRendererSettings) {
    const responsive = (settings.isResponsive) ? "resize" : undefined;
    const width = (settings.width) ? settings.width : 350; //default from plugin
    abcjs.renderAbc(elementID, "K:style=rhythm clef=perc stafflines=1 \nL:1/4 \n " + noteString + ":|", {
        add_classes: true,
        responsive: responsive,
        staffwidth: width,
        expandToWidest: true,
        paddingbottom: 0,
        timeBasedLayout: {
            minPadding: 0,
            minWidth: width,
            align: 'left'
        }
    });

    if (settings.activeNoteNumber === undefined) {
        return;
    }

    const notes = document.getElementById(elementID)?.querySelectorAll("[data-index]");
    if (!notes || notes.length - 1 < settings.activeNoteNumber) {
        return;
    }

    const activeNote = notes.item(settings.activeNoteNumber);
    activeNote.classList.add("abcjs-active-note");    
}