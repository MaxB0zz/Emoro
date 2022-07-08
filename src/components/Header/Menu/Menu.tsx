import React, {FC} from 'react';
import styles from './Menu.module.sass';

interface MenuProps {
}

const Menu: FC<MenuProps> = () => (
    <ul className={styles.Menu}>
        <li className={styles.DropDown}>
            <span>File</span>
            <ul className={styles.DropDownContent}>
                <li id="openFile">Open a file</li>
                <li id="openProject">Open a project</li>
                <li className={styles.Separator}></li>
                <li>Close</li>
            </ul>
        </li>
        <li>Run</li>
        <li className={styles.DropDown}>
            <span>Music</span>
            <ul className={styles.DropDownContent}>
                <li id="addMusic">add</li>
            </ul>
        </li>
    </ul>
);

export default Menu;
