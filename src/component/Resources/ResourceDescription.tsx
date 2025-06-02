import styles from "./description.module.css";

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
        </>
    );
}