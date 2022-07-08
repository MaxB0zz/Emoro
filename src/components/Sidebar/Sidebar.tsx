import React, {FC} from 'react';
import styles from './Sidebar.module.sass';
import Explorer from "./Explorer/Explorer";
import Music from "./Music/Music";

interface SidebarProps {
}

const Sidebar: FC<SidebarProps> = () => (
    <div className={styles.Sidebar}>
        <Explorer/>
        <Music/>
    </div>
);

export default Sidebar;
