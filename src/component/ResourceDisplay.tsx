import { ResourceData } from "../lib/definitions";

import styles from "./resourceDisplay.module.css";

//this takes the resource data and provides the UI elements to display them in the dashboard
interface ResourceDisplayProps {
    resourceData: ResourceData
}

export default function ResourceDisplay(props: ResourceDisplayProps) {
    const info = props.resourceData.resource.resourceInfo;
    return (
        <div className={styles.holder}>
            <div className={styles.info}>
                <div className={styles.icon}>
                    <span>{props.resourceData.currentAmount}</span>
                    <span>{info.displayIcon}</span>
                </div>                
            </div>
        </div>
    )
}