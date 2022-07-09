import React, {FC} from 'react';
import styles from './Controllers.module.sass';

interface ControllersProps {
}

const Controllers: FC<ControllersProps> = () => (
    <div className={styles.Controllers}>
        <div className={styles.DragButton}></div>
        <div id="hideButton" className={styles.HideButton}>&#822;</div>
        <div id="closeButton" className={styles.CloseButton}>&#x2715;</div>
    </div>
);

export default Controllers;
