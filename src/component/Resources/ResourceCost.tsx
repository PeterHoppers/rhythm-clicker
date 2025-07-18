import { ResourceTransaction, ResourceType } from "../../lib/definitions";
import { getHTMLForResourceDisplay, createHTMLForString } from "../../data/resourceLibrary";

import styles from "./cost.module.css";
import { ReactElement } from "react";

interface UpgradeNodeProps {
    upgradeId: string;
    upgradeTitle: string;
    upgradeEffect: string;
    upgradeCosts: ResourceTransaction[]
}

export default function ResourceCost(props: UpgradeNodeProps) {   
    const id = props.upgradeId; 
    let upgradeDisplay : ReactElement;
    const upgradeDisplayClass = styles.titleDisplay;

    if (Object.values<string>(ResourceType).includes(id)) {
        upgradeDisplay = getHTMLForResourceDisplay(ResourceType[id as keyof typeof ResourceType], upgradeDisplayClass);
    } else {
        upgradeDisplay = createHTMLForString(id, upgradeDisplayClass);
    }

    return (
        <>
            <div className={styles.body}>
                <aside className={styles.displayHolder}>
                    {upgradeDisplay}
                </aside>
                <section className={styles.content}>
                    <h3 className={styles.title}>{props.upgradeTitle}</h3>
                    <ul className={styles.holder}>
                        {props.upgradeCosts.map(cost => {
                            return <li className={styles.costItem} key={cost.resourceType}>{getHTMLForResourceDisplay(cost.resourceType, styles.costResource)} : {cost.resourceAmount}</li>
                        })}
                    </ul>
                </section>        
            </div>
            <span>{props.upgradeEffect}</span>
        </>
    );
}