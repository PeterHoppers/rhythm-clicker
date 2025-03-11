import { ResourceData } from "../lib/definitions";
import styles from "./resourceNode.module.css";

//this takes the current information about the currency and displays the basic information, along with a button that can trigger the gain money call back

interface ResourceNodeProps {
    resourceData: ResourceData,
    onClickCallback: () => void
}

export default function ResourceNode(props: ResourceNodeProps) {
    const info = props.resourceData.resource.resourceInfo;
    return (
        <>
            <button className={styles.button} onClick={props.onClickCallback}>
                {info.displayIcon}
            </button>         
        </>
    )
}