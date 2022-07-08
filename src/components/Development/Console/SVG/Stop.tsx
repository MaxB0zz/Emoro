import React, {FC} from 'react';
import styles from '../Console.module.sass';

interface StopProps {
}

const Stop: FC<StopProps> = () => (

    <svg version="1.1" className={styles.ConsoleStopButton} xmlns="http://www.w3.org/2000/svg"
         xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 20 20" enableBackground="new 0 0 20 20" xmlSpace="preserve">
        <path fill="white" d="M15,3h-2c-0.553,0-1,0.048-1,0.6v12.8c0,0.552,0.447,0.6,1,0.6h2c0.553,0,1-0.048,1-0.6V3.6
                        C16,3.048,15.553,3,15,3z M7,3H5C4.447,3,4,3.048,4,3.6v12.8C4,16.952,4.447,17,5,17h2c0.553,0,1-0.048,1-0.6V3.6
                        C8,3.048,7.553,3,7,3z"/>
    </svg>
);

export default Stop;
