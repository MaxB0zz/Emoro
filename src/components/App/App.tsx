import React, {FC} from 'react';
import Sidebar from "../Sidebar/Sidebar";
import Development from "../Development/Development";
import Header from "../Header/Header";
import styles from './App.module.sass';
import AddMusic from "../popups/addmusic";
interface AppProps {
}

const App: FC<AppProps> = () => (<>
    <Header/>
    <div className={styles.content}>
        <Sidebar/>
        <Development/>

        <AddMusic/>
    </div>
</>);

export default App;
