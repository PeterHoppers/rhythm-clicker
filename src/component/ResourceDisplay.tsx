import { ResourceData, ResourceState } from "../lib/definitions";
import { getResourceDisplay } from "../data/resourceLibrary";
import { Tooltip } from "react-tooltip";
import ResourceDescription from "./Resources/ResourceDescription";
import { GameAction, ActionType } from "../lib/definitions";

import styles from "./resourceDisplay.module.css";

//this takes the resource data and provides the UI elements to display them in the dashboard
interface ResourceDisplayProps {
    resourceData: ResourceData,    
    dispatch: React.ActionDispatch<[action: GameAction]>
}

export default function ResourceDisplay(props: ResourceDisplayProps) {
    const info = props.resourceData.resource.resourceInfo;
    const tooltipId = `tooltip-resource-display-${info.resourceType}`;
    const isPreviewing = props.resourceData.isPreviewed;

    const toggleCallback = () => {
        props.dispatch({
            type: ActionType.OnPreviewResource,
            effect: {
                resourceType: info.resourceType,
                modifier: (isPreviewing) ? 0 : 1
            }                   
        });
    }                        
    
    return (
        <div 
            className={styles.holder}
            data-tooltip-id={tooltipId}
            data-tooltip-place="bottom"
            data-tooltip-delay-hide={100}     
            onClick={() => toggleCallback()} 
            onMouseEnter={() => toggleCallback()}
            onMouseLeave={() => toggleCallback()}       
        >
            <div className={styles.info}>
                <div className={styles.icon}>                    
                    <span>{getResourceDisplay(info.resourceType)}</span>
                    <span>{props.resourceData.currentAmount}</span>
                    <span>{props.resourceData.successNotes.length} / {props.resourceData.resource.resourceInfo.pattern?.length}</span>
                </div>                
            </div>                        
            <Tooltip id={tooltipId} className={styles.tooltip}>
                <ResourceDescription 
                    resourceTitle={info.resourceType} 
                    resourceDescription={info.description ?? ""} 
                    resourceNotation={info.patternNotation ?? ""} 
                    isResourceCollectable={props.resourceData.interactionState === ResourceState.Clickable} />
            </Tooltip>
        </div>
    )
}