import { ResourceData } from "../lib/definitions";
import styles from "./currency.module.css";

//this takes the current information about the currency and displays the basic information, along with a button that can trigger the gain money call back

interface CurrencyNodeProps {
    moneyData: ResourceData,
    onClickCallback: () => void
}

export default function CurrencyNode(props: CurrencyNodeProps) {
    const info = props.moneyData.resource.resourceInfo;
    return (
        <div className={styles.holder}>
            <div className={styles.info}>
                <span>{props.moneyData.currentAmount} {info.resourceType}</span>
                <span>{info.collectionRate} per click</span>
            </div>   
            <button className={styles.button} onClick={props.onClickCallback}>
                {info.displayIcon}
            </button>         
        </div>
    )
}