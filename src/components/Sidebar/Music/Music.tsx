import React, {FC} from 'react';
import styles from './Music.module.sass';

interface MusicProps {
}

const Music: FC<MusicProps> = () => (
    <div className={styles.Music}>
        Music Component
    </div>
);

export default Music;
