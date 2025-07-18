import { Upgrade, ActionType, GameAction, ResourceTransaction} from "../lib/definitions";
import styles from "./upgrade.module.css";
import ResourceCost from "./Resources/ResourceCost";

//this handles the rendering of each of the upgrade buttons, which is a button along with a tooltip to explain what the upgrade does
interface UpgradeNodeProps {
    upgrade: Upgrade,
    currentResources: ResourceTransaction[],
    dispatch: React.ActionDispatch<[action: GameAction]>
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

    const tooltipId = `tooltip-${props.upgrade.upgradeInfo.displayName}`;

    return (
        <>
            <button 
                data-tooltip-id={tooltipId}
                data-tooltip-place="top"
                className={styles.button} disabled={isDisabled} 
                aria-label={props.upgrade.displayInfo()} 
                onClick={() => {
                props.dispatch({
                    type: ActionType.Upgrade,
                    effect: info.effect,                    
                });      
                props.upgrade.upgradeInfo.cost.forEach(cost => {
                    props.dispatch({
                        type: ActionType.OnSpendResource,
                        effect: {
                            modifier: cost.resourceAmount,
                            resourceType: cost.resourceType
                        }
                    });     
                });                       
            }}>
                <ResourceCost upgradeId={info.id} upgradeTitle={info.displayName} upgradeEffect={props.upgrade.displayInfo()} upgradeCosts={info.cost}/>
            </button>
        </>            
    )
}