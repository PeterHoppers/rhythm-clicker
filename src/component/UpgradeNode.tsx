import { Upgrade, ActionType, ResourceAction, ResourceTransaction } from "../lib/definitions";
import styles from "./upgrade.module.css";

const TOOLTIP_SHOW_DELAY_IN_MS = 250;
const TOOLTIP_HIDE_DELAY_IN_MS = 400;

//this handles the rendering of each of the upgrade buttons, which is a button along with a tooltip to explain what the upgrade does
interface UpgradeNodeProps {
    upgrade: Upgrade,
    currentResources: ResourceTransaction[],
    dispatch: React.ActionDispatch<[action: ResourceAction]>
}

export default function UpgradeNode(props: UpgradeNodeProps) {
    const info = props.upgrade.upgradeInfo;
    let isDisabled = false;

    info.cost.forEach(cost => {
        const currentResource = props.currentResources.find(x => x.resourceType === cost.resourceType);

        if (currentResource) {
            if (currentResource.resourceAmount < cost.resourceAmount) {
                isDisabled = true;
                return;
            }
        }
    });    

    return (
        <span>
            <button className={styles.button} disabled={isDisabled} aria-label={props.upgrade.displayInfo()} onClick={() => {
                props.dispatch({
                    type: ActionType.Upgrade,
                    upgradeAction: info.data
                });      
                props.upgrade.upgradeInfo.cost.forEach(cost => {
                    props.dispatch({
                        type: ActionType.OnSpendResource,
                        upgradeAction: {
                            modifier: cost.resourceAmount,
                            resourceType: cost.resourceType
                        }
                    });     
                });                       
            }}>
                {info.displayIcon}
            </button>
        </span>            
    )
}