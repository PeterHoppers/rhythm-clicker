import { renderNotes } from "../../lib/notes/noteRenderer";
import { useEffect } from "react";


interface MetronomeVisualProps {
    beatToRender: number;
} 

export default function MetronomeVisual(props : MetronomeVisualProps) {
    useEffect(() => {
        renderNotes("test", "X:1 \nBzzz|Bzzz|Bzzz|Bzzz:|\n", props.beatToRender);
    }, [props.beatToRender]);

    return (
        <div id="test">
        </div>
    )
}