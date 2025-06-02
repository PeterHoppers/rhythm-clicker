import { renderNotes } from "../../lib/notes/noteRenderer";
import { useEffect } from "react";
import { NOTES_PER_BAR } from "../../lib/definitions";

const METRONOME_DISPLAY_ID = "metronome_display"; 

interface MetronomeVisualProps {
    beatToRender: number;
    notesToDisplay?: string;
} 

export default function MetronomeVisual(props : MetronomeVisualProps) {
    const defaultNotes = "z z z z |z z z z :|\n";
    let notes = props.notesToDisplay ?? defaultNotes;  
    const barNumber = notes.match(/\|/g)?.length ?? 0;
    
    if (props.notesToDisplay && barNumber < 2) {
        const endingIndex = notes.indexOf(":");
        const noteString = notes.substring(0, endingIndex);
        if (barNumber === 1) {
           notes = `${noteString}|${props.notesToDisplay}`;
        }
    }

    let spaceNumber = notes.match(/\s/g)?.length ?? 0;
    spaceNumber--;
    const beatBreakdown = NOTES_PER_BAR / spaceNumber;
    const beatToDisplay = props.beatToRender / beatBreakdown;
    console.log(`${props.beatToRender} ${spaceNumber} ${beatBreakdown} ${beatToDisplay} ${Math.floor(beatToDisplay)}`);
    
    useEffect(() => {
        renderNotes(METRONOME_DISPLAY_ID, notes, {
            activeNoteNumber: Math.floor(beatToDisplay),
            isResponsive: true
        });
    }, [props.beatToRender, notes, beatToDisplay]);

    return (
        <div id={METRONOME_DISPLAY_ID}>
        </div>
    )
}