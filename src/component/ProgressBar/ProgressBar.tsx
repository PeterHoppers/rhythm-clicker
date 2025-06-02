import styles from "./progressBar.module.css";

interface ProgressBarProps {
    currentValue: number;
    maxValue: number;
} 

export default function ProgressBar(props : ProgressBarProps) {   
    let fill = props.currentValue / props.maxValue;
    if (fill > 1) {
        fill = 1;
    }

    const isDisplayed = (fill > 0);
    const fillStyle = `${fill * 100}%`;
    return (
        <div className={`${styles.meter} ${styles.nostripes} ${(fill === 1) ? styles.filled : styles.unfilled}`}>
            {isDisplayed &&
                <span style={{width: fillStyle}}></span>
            }            
        </div>
    )
}