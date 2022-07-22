import React, {FC} from 'react';
import {inspect} from "util";
import styles from './AddMusic.module.sass';


interface AddMusicProps {
}

const AddMusic: FC<AddMusicProps> = () => (
    <dialog id="favDialog" data-toggle="modal" data-backdrop="static" data-keyboard="false" >
        <form method="dialog">
            <span>Add Music:</span>
            <input type="text" className={styles.musicinput}/>
            <div>
                <button value="cancel">Cancel</button>
                <button id="confirmBtn" value="default">Confirm</button>
            </div>
        </form>
    </dialog>
);

export default AddMusic;