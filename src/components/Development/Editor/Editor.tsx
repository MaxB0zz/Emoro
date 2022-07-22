import React, {FC} from 'react';
import styles from './Editor.module.sass';
import Code from "./Code";

const Prism = require('prismjs');

interface EditorProps {
}

const Editor: FC<EditorProps> = () => {

    function handleInputEvent(event: any) {
        event.cancelable = false
        const textEditor = document.getElementById('textEditor')
        const highlighted = document.getElementById("highlighted")
        // @ts-ignore
        let text = textEditor.value
        if (text[text.length - 1] === "\n") {
            text += " ";
        }
        // Update code
        if (highlighted) {
            highlighted.innerHTML = text.replace(/&/g, "&amp;").replace(/</g, "&lt;"); /* Global RegExp */
            // Syntax Highlight
            Prism.highlightElement(highlighted);
        }
    }

    function handleScrollEvent(event: any) {
        event.cancelable = false
        const lineCounter = document.getElementById('lineCounter')
        if (lineCounter) lineCounter.style.transform = `translateY(-${event.target.scrollTop}px)`
        // @ts-ignore
        let highlighted = document.getElementById("highlighted")

        if (highlighted) {
            highlighted = highlighted.parentElement
            if (highlighted) highlighted.style.transform = `translate(-${event.target.scrollLeft}px, -${event.target.scrollTop}px)`
        }
    }

    function handleKeyDownEvent(event: any) {
        event.cancelable = false
        lineCounting(event)
        completeBrackets(event)
    }

    function handleKeyUpEvent(event: any) {
        // Line counting
        event.cancelable = false
        lineCounting(event)
    }

    const lineCounting = (event: any) => {
        // @ts-ignore
        document.getElementById('lineCounter').innerHTML = Array(event.target.value.split("\n").length).fill('<span></span>').join('')
    }

    const completeBrackets = (event: any) => {
        return;
        //TODO not operational: autocompletion only works on the last line.
        let textArea = event.target
        switch (event.key) {
            case "{":
                event.preventDefault()
                textArea.value += "{}" // <- problem
                handleInputEvent(event)
                textArea.selectionEnd = textArea.value.length - 1
                break;
            case "(":
                event.preventDefault()
                textArea.value += "()"
                handleInputEvent(event)
                textArea.selectionEnd = textArea.value.length - 1
                break;
            case "[":
                event.preventDefault()
                textArea.value += "[]"
                handleInputEvent(event)
                textArea.selectionEnd = textArea.value.length - 1
                break;
            case "\"":
                event.preventDefault()
                textArea.value += "\"\""
                handleInputEvent(event)
                textArea.selectionEnd = textArea.value.length - 1
                break;
            case "'":
                event.preventDefault()
                textArea.value += "''"
                handleInputEvent(event)
                textArea.selectionEnd = textArea.value.length - 1
                break;
            case "`":
                event.preventDefault()
                textArea.value += "``"
                handleInputEvent(event)
                textArea.selectionEnd = textArea.value.length - 1
                break;
        }
    }

    return (<div className={styles.Editor} id="editor">
        <div className={styles.LineCounterBack}/>
        <div className={styles.LineCounter} id="lineCounter"><span/></div>
        <textarea onInput={handleInputEvent} onScroll={handleScrollEvent} onKeyDown={handleKeyDownEvent}
                  onKeyUp={handleKeyUpEvent} className={styles.TextEditor} id="textEditor" spellCheck="false"/>
        <div id="codeDisplay" className={styles.CodeDisplay}>
            <Code code=" " language="javascript"/>
        </div>
    </div>)
};

export default Editor;
