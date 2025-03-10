import { Upgrade, ActionType, ResourceAction, ResourceType } from "../lib/definitions";
import styles from "./upgrade.module.css";

const TOOLTIP_SHOW_DELAY_IN_MS = 250;
const TOOLTIP_HIDE_DELAY_IN_MS = 400;

//this handles the rendering of each of the upgrade buttons, which is a button along with a tooltip to explain what the upgrade does
interface UpgradeNodeProps {
    upgrade: Upgrade,
    currentCurrency: number,
    dispatch: React.ActionDispatch<[action: ResourceAction]>
}

export default function UpgradeNode(props: UpgradeNodeProps) {
    const info = props.upgrade.upgradeInfo;
    const isDisabled = (props.currentCurrency < info.cost);

    return (
        <span>
            <button className={styles.button} disabled={isDisabled} aria-label={props.upgrade.displayInfo()} onClick={() => {
                props.dispatch({
                    type: ActionType.Upgrade,
                    payload: info.data
                });      
                props.dispatch({
                    type: ActionType.OnSpendResource,
                    payload: {
                        modifier: info.cost,
                        resourceType: ResourceType.Money
                    }
                });            
            }}>
                {info.displayIcon}
            </button>
        </span>            
    )
}