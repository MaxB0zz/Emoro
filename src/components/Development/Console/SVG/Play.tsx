import React, {FC} from 'react';
import styles from '../Console.module.sass';

interface PlayProps {
}

const Play: FC<PlayProps> = () => (
    <svg version="1.1" className={styles.ConsolePlayButton} xmlns="http://www.w3.org/2000/svg"
         xmlnsXlink="http://www.w3.org/1999/xlink" x="0px"
         y="0px" viewBox="0 0 20 20" enableBackground="new 0 0 20 20" xmlSpace="preserve">
        <path fill="white" d="M15,10l-9,5V5L15,10z"/>
    </svg>
);

export default Play;
