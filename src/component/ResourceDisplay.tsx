import { ResourceData, ResourceState } from "../lib/definitions";
import { getResourceDisplay } from "../data/resourceLibrary";
import { Tooltip } from "react-tooltip";
import ResourceDescription from "./Resources/ResourceDescription";
import ProgressBar from "./ProgressBar/ProgressBar";

const TOOLTIP_HIDE_DELAY_IN_MS = 100;

import styles from "./resourceDisplay.module.css";

//this takes the resource data and provides the UI elements to display them in the dashboard
interface ResourceDisplayProps {
    resourceData: ResourceData,
    isPreviewing: boolean
    onClickCallback: () => void,
}

export default function ResourceDisplay(props: ResourceDisplayProps) {
    const info = props.resourceData.resource.resourceInfo;
    const tooltipId = `tooltip-resource-display-${info.resourceType}`;                     
    
    return (
        <div 
            className={styles.holder}
            data-tooltip-id={tooltipId}
            data-tooltip-place="bottom"
            data-tooltip-delay-hide={TOOLTIP_HIDE_DELAY_IN_MS}    
        >
            <div className={styles.info}>
                <div className={styles.icon}>                    
                    <span>{getResourceDisplay(info.resourceType)}</span>
                    <span>{props.resourceData.currentAmount}</span>
                    {props.resourceData.interactionState === ResourceState.Clickable &&
                        <>
                            <ProgressBar currentValue={props.resourceData.successNotes.length}  maxValue={props.resourceData.resource.getPatternNotes().length}/>
                            <button onClick={props.onClickCallback}>{!props.isPreviewing ? "Preview" : "Stop"}</button> 
                        </>                        
                    }                    
                </div>                
            </div>                        
            <Tooltip id={tooltipId} className={styles.tooltip}>
                <ResourceDescription 
                    resourceTitle={info.resourceType} 
                    resourceDescription={props.resourceData.resource.getFullDisplayDescription()}
                    isResourceCollectable={props.resourceData.interactionState === ResourceState.Clickable} />
            </Tooltip>
        </div>
    )
}