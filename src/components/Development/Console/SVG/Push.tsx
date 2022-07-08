import React, {FC} from 'react';
import styles from '../Console.module.sass';

interface PushProps {
}

const Push: FC<PushProps> = () => (
    <svg version="1.1" className={styles.ConsolePushButton} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         width="24" height="24">
        <path fillRule="evenodd"
              d="M4.75 22a.75.75 0 010-1.5h14.5a.75.75 0 010 1.5H4.75zm.22-13.53a.75.75 0 001.06 1.06L11 4.56v12.19a.75.75 0 001.5 0V4.56l4.97 4.97a.75.75 0 101.06-1.06l-6.25-6.25a.75.75 0 00-1.06 0L4.97 8.47z"/>
    </svg>
);

export default Push;
