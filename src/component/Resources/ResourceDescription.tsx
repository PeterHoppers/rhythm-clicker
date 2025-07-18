import { ReactElement } from "react";
import styles from "./description.module.css";

interface RescourceDescriptionProps {
    resourceTitle: string;
    resourceDescription: ReactElement;
    isResourceCollectable: boolean
}

export default function ResourceDescription(props: RescourceDescriptionProps) {
    return (
        <>
            <h3 className={styles.title}>{props.resourceTitle}</h3>         
            <p>{props.resourceDescription}</p>            
        </>
    );
}