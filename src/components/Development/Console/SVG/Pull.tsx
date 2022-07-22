import React, {FC} from 'react';
import styles from '../Console.module.sass';

interface PullProps {
}

const Pull: FC<PullProps> = () => (
    <svg version="1.1" className={styles.ConsolePullButton} id="gitpull" xmlns="http://www.w3.org/2000/svg"
         xmlnsXlink="http://www.w3.org/1999/xlink" x="0px"
         y="0px" viewBox="0 0 20 20" enableBackground="new 0 0 20 20" xmlSpace="preserve">
        <path fill="#FFFFFF" d="M13,11h-2V3H9v8H7l3,3L13,11z M17.4,15H2.6C2.048,15,2,15.447,2,16c0,0.553,0.048,1,0.6,1h14.8
	c0.552,0,0.6-0.447,0.6-1C18,15.447,17.952,15,17.4,15z"/>
    </svg>
);

export default Pull;
