import styles from "./sidebar.module.css";
import { useState } from "react";

interface SidebarProps {
    children: React.ReactNode
}

export default function Sidebar(props: SidebarProps) {   
    const [isSidebarOpen, setOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setOpen(!isSidebarOpen);
    }

    const stateClassName = (isSidebarOpen) ? styles.open : styles.close;
    const toggleEmoji = (isSidebarOpen) ? "➡️" : "⬅️";
    
    return (
        <div 
            className={`${styles.holder} ${stateClassName}`}            
        >
            <button className={styles.toggler} onClick={toggleSidebar}>{toggleEmoji}</button>
            {props.children}
        </div>
    )
}