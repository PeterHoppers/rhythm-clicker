import styles from "./description.module.css";
import ResourceNotation from "../Notation/ResourceNotation";

interface RescourceDescriptionProps {
    resourceTitle: string;
    resourceDescription: string;
    resourceNotation: string;
    isResourceCollectable: boolean
}

export default function ResourceDescription(props: RescourceDescriptionProps) {
    return (
        <>
            <h3 className={styles.title}>{props.resourceTitle}</h3>         
            <p>{props.resourceDescription}</p>
            {props.resourceNotation && props.isResourceCollectable &&
                <>
                    <p className={styles.subtitle}>Collection Notation:</p>
                    <ResourceNotation notationName={props.resourceTitle} notationString={props.resourceNotation}/>
                </>
            }
        </>
    );
}