import React, {FC} from 'react';
//import styles from '../Console.module.sass';
import styles from "../Music.module.sass";

interface PlayButtonProps {
}

const PlayButton: FC<PlayButtonProps> = () => (
    <svg className={styles.PlayButton} id="PlayMusic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>
);

export default PlayButton;