import React, {FC} from 'react';
import styles from './Development.module.sass';
import Editor from "./Editor/Editor";
import Console from "./Console/Console";

interface DevelopmentProps {
}

const Development: FC<DevelopmentProps> = () => (
    <div className={styles.Development}>
        <Editor/>
        <Console/>
    </div>
);

export default Development;
