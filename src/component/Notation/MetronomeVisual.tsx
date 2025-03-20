import { renderNotes } from "../../lib/notes/noteRenderer";
import { useEffect } from "react";

const METRONOME_DISPLAY_ID = "metronome_display"; 

interface MetronomeVisualProps {
    beatToRender: number;
} 

export default function MetronomeVisual(props : MetronomeVisualProps) {
    useEffect(() => {
        renderNotes(METRONOME_DISPLAY_ID, "X:1 \nBzzz|Bzzz|Bzzz|Bzzz:|\n", {
            activeNoteNumber: props.beatToRender,
            isResponsive: true
        });
    }, [props.beatToRender]);

    return (
        <div id={METRONOME_DISPLAY_ID}>
        </div>
    )
}