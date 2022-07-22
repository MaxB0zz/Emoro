import React, {FC} from 'react';
import styles from './Explorer.module.sass';

interface ExplorerProps {
}

const Explorer: FC<ExplorerProps> = () => (<div className={styles.Explorer}>
    <div className={styles.Navigator} id="projectExplorer">
        <span className={styles.Project}></span>
    </div>
</div>);

export default Explorer;
