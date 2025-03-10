import { ResourceData } from "../lib/definitions";

import styles from "./resource.module.css";

//this takes the resource data and provides the UI elements to display them in the dashboard
interface ResourceNodeProps {
    resourceData: ResourceData
}

export default function ResourceNode(props: ResourceNodeProps) {
    const info = props.resourceData.resource.resourceInfo;
    return (
        <div className={styles.holder}>
            <div className={styles.info}>
                <div className={styles.icon}>
                    <span>{info.displayIcon}</span>
                </div>
                <div className={styles.stats}>
                    <span>{props.resourceData.currentAmount} {info.resourceType}</span>
                    <span>{info.collectionRate} per second</span>
                </div>
            </div>
            <div className={styles.bar}>
                <span className={styles.label}>{`${props.resourceData.currentAmount} / ${info.maxCapacity}`}</span>
            </div>
        </div>
    )
}