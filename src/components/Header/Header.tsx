import React, {FC} from 'react';
import styles from './Header.module.sass';
import Menu from "./Menu/Menu";
import Controllers from "./Controllers/Controllers";

interface HeaderProps {
}

const Header: FC<HeaderProps> = () => (
    <div id="header" className={styles.Header}>
        <Menu/>
        <div className={styles.Title}>
            <span>Emo</span>
            <span>Ro</span>
        </div>
        <Controllers/>
    </div>
);

export default Header;
