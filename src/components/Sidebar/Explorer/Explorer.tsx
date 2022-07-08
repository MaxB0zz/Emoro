import React, {FC} from 'react';
import styles from './Explorer.module.sass';

interface ExplorerProps {
}

const Explorer: FC<ExplorerProps> = () => (<div className={styles.Explorer}>
    <div className={styles.Navigator} id="projectExplorer">
        <span className={styles.Project}>Project</span>
        <ul>
            <li>
                <input type="checkbox" id="folder1"/>
                <label htmlFor="folder1"><span className="Folder">folder1</span></label>
                <ul>
                    <li><span>file1</span></li>
                    <li>
                        <input type="checkbox" id="folder11"/>
                        <label htmlFor="folder11"><span className="Folder">folder11</span></label>
                        <ul>
                            <li><span>file111</span></li>
                            <li><span>file112</span></li>
                        </ul>
                    </li>
                    <li>
                        <input type="checkbox" id="folder12"/>
                        <label htmlFor="folder12">
                            <span className="Folder">this is a long folder namerrgergergrega</span>

                        </label>
                        <ul>
                            <li><span>this is a long file name</span></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li><span>file1</span></li>
            <li><span>file2</span></li>
            <li><span>file3</span></li>
        </ul>
    </div>
</div>);

export default Explorer;
