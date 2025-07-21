import { PressPreviewType, ResourceData, ResourceState } from "../lib/definitions";
import styles from "./resourceNode.module.css";
import { useEffect, useState } from "react";
import { getHTMLForResourceDisplay } from "../data/resourceLibrary";

//this takes the current information about the currency and displays the basic information, along with a button that can trigger the gain money call back

interface ResourceNodeProps {
    resourceData: ResourceData,
    keyCode: string,
    onClickCallback: () => void,
    onHoverCallback: (isHover: boolean) => void,
}

export default function ResourceNode(props: ResourceNodeProps) {
    const [isPressed, setPressed] = useState<boolean>(false);
    const info = props.resourceData.resource.resourceInfo;
    const isEnabled = (props.resourceData.interactionState === ResourceState.Clickable);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDownEvent);
        return window.addEventListener('keydown', handleKeyDownEvent);
    }, []);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyUpEvent);
        return window.addEventListener('keyup', handleKeyUpEvent);
    }, [])

    const handleKeyDownEvent = (event: KeyboardEvent) => {
        if (event.key === props.keyCode && !event.repeat) {
            onPressedButton();
        }
    };

    const handleKeyUpEvent = (event: KeyboardEvent) => {
        if (event.key === props.keyCode) {
            onReleaseButton();
        }
    }

    const onPressedButton = () => {
        setPressed((isPressed) => {
            if (isPressed) {
                return isPressed;
            }

            if (props.resourceData.interactionState !== ResourceState.Clickable) {
                return false;
            }            

            props.onClickCallback();
            return true;
        });        
    }

    const onButtonHover = (isHover: boolean) => {
        if (!isEnabled) {
            return;
        }

        props.onHoverCallback(isHover);
    }

    const onReleaseButton = () => {
        setPressed(false);
    }

    let previewClassName : string = "";
    switch(props.resourceData.pressPreviewState) {
        case PressPreviewType.None:
            previewClassName = styles.default;
            break;
        case PressPreviewType.NoteBefore:
            previewClassName = styles.upcoming;
            break;
        case PressPreviewType.NoteIncluded:
            previewClassName = styles.preview;
            break;
    }

    const classNames = `${styles.button} ${(isPressed || props.resourceData.isPlayed) ? styles.pressed : styles.unpressed} ${previewClassName}`;

    return (
        <>
            <button className={classNames} onPointerDown={onPressedButton} onPointerUp={onReleaseButton} onPointerCancel={onReleaseButton} disabled={!isEnabled} onMouseEnter={() => onButtonHover(true)} onMouseOut={() => onButtonHover(false)}>
                {getHTMLForResourceDisplay(info.resourceType, styles.image)}
                <span className={styles.text}>{props.keyCode}</span>
            </button>         
        </>
    )
}