import { renderNotes } from "../../lib/notes/noteRenderer";
import { useEffect } from "react";
import { BeatNotation, getNotationFromBeatNotation } from "../../lib/rhythm/beatNotation";

const METRONOME_DISPLAY_ID = "metronome_display"; 

interface MetronomeVisualProps {
    idAppend: string
    beatToRender: number;
    notesToDisplay: BeatNotation[];
} 

export default function MetronomeVisual(props : MetronomeVisualProps) {
    const targetNotation = props.notesToDisplay.sort(compareBeatNotations)
    const notation = getNotationFromBeatNotation(targetNotation); 
    const idName = METRONOME_DISPLAY_ID + props.idAppend;
    let activeBeatIndex = 0;

    for (let index = 0; index < targetNotation.length; index++) {
        if (targetNotation[index].startingBeatNumber > props.beatToRender) {
            break;
        }

        activeBeatIndex = index;
    }
    
    useEffect(() => {
        renderNotes(idName, notation, {
            activeNoteNumber: Math.floor(activeBeatIndex),
            isResponsive: true
        });
    }, [idName, props.beatToRender, props.notesToDisplay, notation, activeBeatIndex]);

    return (
        <div id={idName}>
        </div>
    )
}

function compareBeatNotations(a: BeatNotation, b :BeatNotation) {
    return a.startingBeatNumber - b.startingBeatNumber;
}