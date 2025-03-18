import { renderNotes } from "../../lib/notes/noteRenderer";
import { useEffect } from "react";

const METRONOME_DUISPLAY_ID = "metronome_display"; 

interface MetronomeVisualProps {
    beatToRender: number;
} 

export default function MetronomeVisual(props : MetronomeVisualProps) {
    useEffect(() => {
        renderNotes(METRONOME_DUISPLAY_ID, "X:1 \nBzzz|Bzzz|Bzzz|Bzzz:|\n", props.beatToRender);
    }, [props.beatToRender]);

    return (
        <div id={METRONOME_DUISPLAY_ID}>
        </div>
    )
}