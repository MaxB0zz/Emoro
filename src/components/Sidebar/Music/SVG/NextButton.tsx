import React, {FC} from 'react';
//import styles from '../Console.module.sass';
import styles from "../Music.module.sass";

interface NextButtonProps {
}

const NextButton: FC<NextButtonProps> = () => (
    <svg id="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" /></svg>
);

export default NextButton;