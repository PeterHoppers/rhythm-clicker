import { renderNotes } from "../../lib/notes/noteRenderer";
import { useEffect } from "react";
import { BeatNotation, getNotationFromBeatNotation } from "../../lib/rhythm/beatNotation";
import { METRONOME_NOTATION } from "../../data/patternLibrary";

const METRONOME_DISPLAY_ID = "metronome_display"; 

interface MetronomeVisualProps {
    beatToRender: number;
    notesToDisplay?: BeatNotation[];
} 

export default function MetronomeVisual(props : MetronomeVisualProps) {
    const targetNotation = (props.notesToDisplay) ? props.notesToDisplay.sort(compareBeatNotations) : METRONOME_NOTATION;
    const notation = getNotationFromBeatNotation(targetNotation); 
    let activeBeatIndex = 0;

    for (let index = 0; index < targetNotation.length; index++) {
        if (targetNotation[index].startingBeatNumber > props.beatToRender) {
            break;
        }

        activeBeatIndex = index;
    }
    
    useEffect(() => {
        renderNotes(METRONOME_DISPLAY_ID, notation, {
            activeNoteNumber: Math.floor(activeBeatIndex),
            isResponsive: true
        });
    }, [props.beatToRender, props.notesToDisplay, notation, activeBeatIndex]);

    return (
        <div id={METRONOME_DISPLAY_ID}>
        </div>
    )
}

function compareBeatNotations(a: BeatNotation, b :BeatNotation) {
    return a.startingBeatNumber - b.startingBeatNumber;
}