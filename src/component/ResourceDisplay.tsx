import { ResourceData, ResourceState } from "../lib/definitions";
import { getResourceDisplay } from "../data/resourceLibrary";
import { Tooltip } from "react-tooltip";
import ResourceDescription from "./Resources/ResourceDescription";
import { GameAction, ActionType } from "../lib/definitions";
import ProgressBar from "./ProgressBar/ProgressBar";

import styles from "./resourceDisplay.module.css";

//this takes the resource data and provides the UI elements to display them in the dashboard
interface ResourceDisplayProps {
    resourceData: ResourceData,    
    toggleCallback: () => void
}

export default function ResourceDisplay(props: ResourceDisplayProps) {
    const info = props.resourceData.resource.resourceInfo;
    const tooltipId = `tooltip-resource-display-${info.resourceType}`;                     
    
    return (
        <div 
            className={styles.holder}
            data-tooltip-id={tooltipId}
            data-tooltip-place="bottom"
            data-tooltip-delay-hide={100}     
            onMouseEnter={() => props.toggleCallback()}
            onMouseLeave={() => props.toggleCallback()}       
        >
            <div className={styles.info}>
                <div className={styles.icon}>                    
                    <span>{getResourceDisplay(info.resourceType)}</span>
                    <span>{props.resourceData.currentAmount}</span>
                    {props.resourceData.interactionState === ResourceState.Clickable &&
                        <ProgressBar currentValue={props.resourceData.successNotes.length}  maxValue={props.resourceData.resource.resourceInfo.pattern?.length ?? 0}/>
                    }                    
                </div>                
            </div>                        
            <Tooltip id={tooltipId} className={styles.tooltip}>
                <ResourceDescription 
                    resourceTitle={info.resourceType} 
                    resourceDescription={props.resourceData.resource.getFullDisplayDescription()} 
                    resourceNotation={info.patternNotation ?? ""} 
                    isResourceCollectable={props.resourceData.interactionState === ResourceState.Clickable} />
            </Tooltip>
        </div>
    )
}