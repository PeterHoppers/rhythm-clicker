import { renderNotes } from "../../lib/notes/noteRenderer";
import { useEffect } from "react";

const METRONOME_DISPLAY_ID = "metronome_display"; 

interface MetronomeVisualProps {
    beatToRender: number;
    notesToDisplay?: string;
} 

export default function MetronomeVisual(props : MetronomeVisualProps) {
    const defaultNotes = "zzzz|zzzz|zzzz|zzzz:|\n";
    let notes = props.notesToDisplay ?? defaultNotes;  
    const barNumber = notes.match(/\|/g)?.length ?? 0;
    if (props.notesToDisplay && barNumber < 3) {
        const endingIndex = notes.indexOf(":");
        const noteString = notes.substring(0, endingIndex);
        if (barNumber === 1) {
            notes = `${noteString}|${noteString}|${noteString}|${props.notesToDisplay}`;
        } else if (barNumber === 2) {
            notes = `${noteString}|${props.notesToDisplay}`;
        }
    }
    
    useEffect(() => {
        renderNotes(METRONOME_DISPLAY_ID, notes, {
            activeNoteNumber: props.beatToRender,
            isResponsive: true
        });
    }, [props.beatToRender, notes]);

    return (
        <div id={METRONOME_DISPLAY_ID}>
        </div>
    )
}