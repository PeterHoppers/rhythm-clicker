import { renderNotes } from "../../lib/notes/noteRenderer";
import { useEffect } from "react";

import styles from "./resourceNotation.module.css";

const NOTATION_WIDTH = 250;

interface ResourceNotationProps {
    notationName: string;
    notationString : string;
} 

export default function ResourceNotation(props : ResourceNotationProps) {
    useEffect(() => {
        renderNotes(props.notationName, props.notationString, {width: NOTATION_WIDTH});
    }, [props.notationName, props.notationString]);

    return (
        <div className={styles.notation}>
            <div id={props.notationName}/>
        </div>
    )
}