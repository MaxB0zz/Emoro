import React, {FC} from 'react';
//import styles from '../Console.module.sass';
import styles from "../Music.module.sass";

interface VolumeIconProps {
}

const VolumeIcon: FC<VolumeIconProps> = () => (
    <svg className={styles.volumelogo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" /></svg>
);

export default VolumeIcon;