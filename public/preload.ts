// @ts-ignore
const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
const remote = require('@electron/remote');
const {dialog} = remote;
const slugger = require('slugger');


window.onload = function () {
    lo()


    resizerHandler()
    musicHandler()
    controllingHandler()
    editorHandler()
}

function lo() {
    //localStorage.setItem("currentFile", null)
    const maxSizeForEditorToOpenAFile = 500000;

    fillEditor(localStorage.getItem("currentFile"));
    fillExplorer(localStorage.getItem("currentProject"));

    const openFile = document.getElementById("openFile");
    const openProject = document.getElementById("openProject");
    const addMusic = document.getElementById("addMusic");
    const textEditor = document.getElementById("textEditor");


    if(openFile) {
        openFile.addEventListener("click", function () {
            dialog.showOpenDialog({
                properties: ['openFile']
            }).then(r => {
                if (r.filePaths[0]) {
                    fillEditor(r.filePaths[0]);
                } else console.log("[Open a file] Closed without selection");
            });
        })
    }

    if(addMusic) {
        addMusic.addEventListener("click", function () {
            window.open("index.html", "Ratting", "width=550,height=170,left=150,top=200,toolbar=0,status=0,")
        })
    }

    function fillEditor(path) {
        if (path !== "null") {
            localStorage.setItem("currentFile", path);
            if (fs.statSync(path).size <= maxSizeForEditorToOpenAFile) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        // @ts-ignore
                        textEditor.value = data;
                        textEditor.focus();
                        textEditor.dispatchEvent(new Event('input', {
                            bubbles: true
                        }));
                        textEditor.dispatchEvent(new Event('keydown', {
                            bubbles: true
                        }));
                    }
                });

            } else {
                alert("The file size should be less than " + maxSizeForEditorToOpenAFile + " bytes");
            }
        }
    }

    if(openProject) {
        openProject.addEventListener("click", function () {
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }).then(r => {
                if (r.filePaths[0]) {
                    fillExplorer(r.filePaths[0]);
                } else console.log("[Open a file] Closed without selection");
            });
        });
    }


    document.querySelector("*").addEventListener("click", function (event) {
        // @ts-ignore
        if (event.target.classList.contains("explorer-file")) {
            // @ts-ignore
            fillEditor(event.target.dataset.path);
        }
    })

    function fillExplorer(path) {
        if (path !== "null") {
            localStorage.setItem("currentProject", path);
            aFillExplorer(path).then(function (data) {
                document.getElementById("projectExplorer").innerHTML = data;
            });
        }
    }

    async function aFillExplorer(path) {
        let html = "";
        html += "<span class=\"Project\">"
        html += path.split("\\").pop()
        html += "</span>";
        html += "<ul>";
        html += await openDir(path);
        html += "</ul>";
        return html;
    }

    async function openDir(path) {
        let html = "";
        let files = await fs.promises.readdir(path);
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let filePath = path + "\\" + file;
            let stats = await fs.promises.stat(filePath);
            if (stats.isDirectory()) {
                html += "<li>"
                html += "<input type=\"checkbox\" id=\"" + slugger(file) + "\"/>"
                html += "<label for=\"" + slugger(file) + "\">"
                html += "<span> " + file + " </span>"
                html += "</label>"
                html += "</span>";
                html += "<ul>" + await openDir(filePath) + "</ul>"
                html += "</li>";
            } else {
                html += "<li class='explorer-file' data-path='" + filePath + "'>" + file + "</li>";
            }
        }
        return html;
    }
}

const editorHandler = () => {
    const textEditor = document.getElementById("textEditor");
    textEditor.addEventListener("input", function (event) {
        // @ts-ignore
        localStorage.setItem("openedFile", textEditor.value);
    })
    const saveFile = () => {
        // @ts-ignore
        fs.writeFile(localStorage.getItem("currentFile"), textEditor.value, function (err) {
            if (err) alert("An error occurred writing the file " + err.message);
        });
    };
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveFile();
        }
    });
}

const musicHandler = () => {
    function playMusic(path) {
        const audio = new Audio(path);
        audio.volume = 0;
        audio.play().then(() => {
        }).catch(e => console.log(e));
    }

    playMusic('../music/FX/intro.mp3');
};

const resizerHandler = () => {
    let pageY, consoleHeight, editorHeight
    const resizerElement = document.getElementById("resizer");
    const consoleEditor = document.getElementById("console")
    const editorElement = document.getElementById("editor")
    if(resizerElement) {
        resizerElement.addEventListener("mousedown", function (e) {
            pageY = e.pageY
            consoleHeight = consoleEditor.offsetHeight
            if (editorElement) editorHeight = editorElement.offsetHeight
        })
    }
    document.addEventListener("mousemove", function (e) {
        if (consoleEditor) {
            let diffY = e.pageY - pageY + document.getElementById("header").offsetHeight
            if (editorElement) {
                let newHeight = ((editorHeight + diffY) / window.screen.height) * 100
                editorElement.style.height = (newHeight) + '%'
                consoleEditor.style.height = (100 - newHeight) + '%'
            }
        }
    })
    document.addEventListener("mouseup", function (e) {
        pageY = undefined
        editorHeight = undefined
        consoleHeight = undefined
    })
};

const controllingHandler = () => {
    document.getElementById("closeButton").addEventListener("click", function () {
        ipcRenderer.send("close-application");
    });

    document.getElementById("hideButton").addEventListener("click", function () {
        ipcRenderer.send("hide-application");
    });
}