import React, {FC} from 'react';
import styles from './Music.module.sass';
import PlayButton from "./SVG/PlayButton";
import PauseButton from "./SVG/PauseButton";
import PreviousButton from "./SVG/PreviousButton";
import NextButton from "./SVG/NextButton";
import VolumeIcon from "./SVG/VolumeIcon";
interface MusicProps {
}

const Music: FC<MusicProps> = () => (
    <div className={styles.Music}>
        <div className={styles.MusicElements}>
            <div className={styles.MusicButtons}>
                <PreviousButton />
                <PlayButton />
                <PauseButton />
                <NextButton />
            </div>

        </div>
        <div className={styles.slidecontainer}>
            <VolumeIcon />
            <input type="range" min="1" max="100" defaultValue="Search..." className={styles.slider} id="myRange"/>
        </div>
    </div>
);

export default Music;
