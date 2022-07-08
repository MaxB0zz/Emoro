import React, {FC} from 'react';
import Sidebar from "../Sidebar/Sidebar";
import Development from "../Development/Development";
import Header from "../Header/Header";
import styles from './App.module.sass';

interface AppProps {
}

const App: FC<AppProps> = () => (<>
    <Header/>
    <div className={styles.content}>
        <Sidebar/>
        <Development/>
    </div>
</>);

export default App;
