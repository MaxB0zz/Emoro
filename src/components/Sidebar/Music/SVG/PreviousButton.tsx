import React, {FC} from 'react';
//import styles from '../Console.module.sass';
import styles from "../Music.module.sass";

interface PreviousButtonProps {
}

const PreviousButton: FC<PreviousButtonProps> = () => (
    <svg id="previous" className={styles.OtherButtons} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" /></svg>
);

export default PreviousButton;