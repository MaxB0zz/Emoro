import React, {FC} from 'react';
import styles from './Console.module.sass';
import Play from "./SVG/Play";
import Stop from "./SVG/Stop";
import Add from "./SVG/Add";
import Push from "./SVG/Push";
import Commit from "./SVG/Commit";
import Pull from "./SVG/Pull";
interface ConsoleProps {
}

const Console: FC<ConsoleProps> = () => (<div className={styles.Console} id="console">
    <div className={styles.Resizer} id="resizer"></div>
    <div className={styles.HeadBar}>
        <div className={styles.Compiling}>
            <Play/>
            <Stop/>
        </div>
        <div className={styles.Title}>
            Compil<span>e</span>r 2000
        </div>
        <div className={styles.GitControl}>
            <Add/>
            <Pull/>
            <Commit/>
            <Push/>
        </div>

    </div>
    <div className={styles.Term}>
        <p id="consoleResults" className={styles.consoleResults}/>
    </div>
    <div className={styles.ConsoleTextAreaContainer} >
        <input type="text" className={styles.ConsoleTextArea} spellCheck="false" id="enter"/>
        <div className={styles.footer}>
            <p className={styles.Terminal}>terminal</p>
            <span id="currentOpenedFile" className={styles.openedfile}/>
            <span id="datetime" className={styles.datetime}>test</span>
        </div>
    </div>
</div>);

export default Console;
