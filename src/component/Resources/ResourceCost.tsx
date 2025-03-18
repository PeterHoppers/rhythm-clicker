import { ResourceTransaction } from "../../lib/definitions";
import { getResourceDisplay } from "../../data/resourceLibrary";

import styles from "./Cost.module.css";

interface UpgradeNodeProps {
    upgradeTitle: string;
    upgradeEffect: string;
    upgradeCosts: ResourceTransaction[]
}

export default function ResourceCost(props: UpgradeNodeProps) {
    return (
        <>
            <h3 className={styles.title}>{props.upgradeTitle}</h3>
            <p>Cost:</p>
            <ul  className={styles.holder}>
                {props.upgradeCosts.map(cost => {
                    return <li key={cost.resourceType}>{getResourceDisplay(cost.resourceType)} : {cost.resourceAmount}</li>
                })}
            </ul>
            <span>{props.upgradeEffect}</span>
        </>
    );
}