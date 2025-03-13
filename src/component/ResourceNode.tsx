import { ResourceData } from "../lib/definitions";
import styles from "./resourceNode.module.css";
import { useEffect, useState } from "react";

//this takes the current information about the currency and displays the basic information, along with a button that can trigger the gain money call back

interface ResourceNodeProps {
    resourceData: ResourceData,
    keyCode: string,
    onClickCallback: () => void
}

export default function ResourceNode(props: ResourceNodeProps) {
    const [isPressed, setPressed] = useState<boolean>(false);
    const info = props.resourceData.resource.resourceInfo;

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

            props.onClickCallback();
            return true;
        });
        
    }

    const onReleaseButton = () => {
        setPressed(false);
    }

    const classNames = `${styles.button} ${(isPressed) ? styles.pressed : styles.unpressed} ${(props.resourceData.shouldPress) ? styles.preview : styles.default}`;

    return (
        <>
            <button className={classNames} onMouseDown={onPressedButton} onMouseLeave={onReleaseButton} onMouseUp={onReleaseButton} onTouchStart={onPressedButton} onTouchEnd={onReleaseButton} onTouchCancel={onReleaseButton}>
                {info.displayIcon}
            </button>         
        </>
    )
}