// @ts-ignore
window.onload = function () {
    localStorage.setItem("currentFile", null)
    const ipcRenderer = require('electron').ipcRenderer;
    const fs = require('fs');
    const remote = require('@electron/remote');
    const {dialog} = remote;
    const slugger = require('slugger');

    const maxSizeForEditorToOpenAFile = 1000000;

    function playMusic(path) {
        const audio = new Audio(path);
        audio.volume = 0.05;
        audio.play().then(() => {
        }).catch(e => {
            console.log(e);
        });

    }

    playMusic('../music/FX/intro.mp3');


    let pageY, currentRow, nextRow, currentRowHeight, nextRowHeight

    document.getElementById("resizer").addEventListener("mousedown", function (e) {
        currentRow = document.getElementById("console")
        nextRow = document.getElementById("editor")
        pageY = e.pageY
        currentRowHeight = currentRow.offsetHeight
        if (nextRow) {
            nextRowHeight = nextRow.offsetHeight
        }
    })

    document.addEventListener("mousemove", function (e) {
        if (currentRow) {
            let diffY = e.pageY - pageY

            if (nextRow) {
                nextRow.style.height = (nextRowHeight + diffY) + 'px'
                currentRow.style.height = (currentRowHeight - diffY) + 'px'
            }
        }
    })

    document.addEventListener("mouseup", function (e) {
        currentRow = undefined
        nextRow = undefined
        pageY = undefined
        nextRowHeight = undefined
        currentRowHeight = undefined
    })


    if (localStorage.hasOwnProperty("currentFile")) {
        fillEditor(localStorage.getItem("currentFile"));
    }

    if (localStorage.hasOwnProperty("currentProject")) {
        fillExplorer(localStorage.getItem("currentProject"));
    }

    document.getElementById("closeButton").addEventListener("click", function () {
        ipcRenderer.send("close-application");
    });

    document.getElementById("hideButton").addEventListener("click", function () {
        ipcRenderer.send("hide-application");
    });

    document.getElementById("openFile").addEventListener("click", function () {
        dialog.showOpenDialog({
            properties: ['openFile']
        }).then(r => {
            if (r.filePaths[0]) {
                fillEditor(r.filePaths[0]);
            } else console.log("[Open a file] Closed without selection");
        });
    })

    document.getElementById("addMusic").addEventListener("click", function () {
        window.open("index.html", "Ratting", "width=550,height=170,left=150,top=200,toolbar=0,status=0,")
    })

    function fillEditor(path) {
        if(path !== "null") {
            localStorage.setItem("currentFile", path);
            if(fs.statSync(path).size <= maxSizeForEditorToOpenAFile) {
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        // @ts-ignore
                        document.getElementById("textEditor").value = data;
                        document.getElementById("textEditor").focus();
                        document.getElementById("textEditor").dispatchEvent(new Event('input', {
                            bubbles: true
                        }));
                        document.getElementById("textEditor").dispatchEvent(new Event('keydown', {
                            bubbles: true
                        }));
                    }
                });
            }
        } else {
            alert("The file size should be less than " + maxSizeForEditorToOpenAFile + " bytes");
        }
    }

    document.getElementById("openProject").addEventListener("click", function () {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then(r => {
            if (r.filePaths[0]) {
                fillExplorer(r.filePaths[0]);
            } else console.log("[Open a file] Closed without selection");
        });
    });


    document.querySelector("*").addEventListener("click", function (event) {
        // @ts-ignore
        if (event.target.classList.contains("explorer-file")) {
            // @ts-ignore
            fillEditor(event.target.dataset.path);
        }
    })

    function fillExplorer(path) {
        localStorage.setItem("currentProject", path);
        aFillExplorer(path).then(function (data) {
            document.getElementById("projectExplorer").innerHTML = data;
        });


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