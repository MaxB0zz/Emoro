import React, {FC, useEffect} from 'react';
import './highlights.css';
import styles from './Editor.module.sass';

const Prism = require("prismjs");

interface CodeProps {
    code: string;
    language: string;
}

const Code: FC<CodeProps> = ({code, language}) => {

    useEffect(() => Prism.highlightAll(), [])
    return <div className={styles.Code}>
        <pre><code id="highlighted" className={`language-${language}`}>{code}</code></pre>
    </div>
};

export default Code;
