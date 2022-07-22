// @ts-ignore


const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
const remote = require('@electron/remote');
const {dialog} = remote;
const slugger = require('slugger');

window.onload = function ()  {
    lo().then(r => console.log("done"))
    resizerHandler()
    musicHandler()
    controllingHandler()
    editorHandler()
}

async function lo() {
    localStorage.setItem("currentFile", null)
    localStorage.setItem("currentProject", null)
    const maxSizeForEditorToOpenAFile = 500000;


    const dateTime = document.getElementById("datetime");
    const openFile = document.getElementById("openFile");
    const openProject = document.getElementById("openProject");
    const addMusic = document.getElementById("addMusic");
    const textEditor = document.getElementById("textEditor");
    const currfile = document.getElementById("currentOpenedFile");
    const consol = document.getElementById("enter");
    const res = document.getElementById("consoleResults");

    if (consol)
        consol.addEventListener("keyup", async e => {
            e.preventDefault();
            e.stopPropagation()
            if (e.key === 'Enter' || e.keyCode === 13) {
                const axios = require("axios")
                try {
                    let response = await axios.get("http://localhost:8081/execute?command="+consol.value);
                    res.innerHTML += "<div>" + response.data + "</div>"
                } catch (error) {
                    if (error.response) {
                        console.log("error while setting rootnode")
                        return;
                    }
                }


                consol.value = ""
                res.scrollTop = res.scrollHeight;
            }
        })


    fillEditor(localStorage.getItem("currentFile"));
    fillExplorer(localStorage.getItem("currentProject"));

    const axios = require("axios")
    if (localStorage.getItem("currentProject")) {
        try {
            //let response = await axios.get("http://localhost:8081/rootnode?path=" + localStorage.getItem("currentProject"));
            //console.log("project set")
        } catch (error) {
            if (error.response) {
                console.log("http://localhost:8081/rootnode?path=" + localStorage.getItem("currentProject"))
                return;
            }
        }
    }


    function displayDate() {
        let dt = new Date();
        dateTime.innerHTML = dt.toLocaleTimeString();
        refreshDate()
    }

    function refreshDate() {
        let refresh = 1000
        setTimeout(displayDate, refresh)
    }
    console.log("date")
    if (dateTime) displayDate()

    /*try {
        let response = await axios.get("http://localhost:8081/simple-request");
        console.log(response.data)
    } catch (e) {
        console.log("error")
    } */

    if (localStorage.getItem("currentFile") !== null) {
        fillEditor(localStorage.getItem("currentFile"));
    }

    if (localStorage.getItem("currentProject") !== null) {
        fillExplorer(localStorage.getItem("currentProject"));
    }


    if (openFile) {
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





    ////////DIALOG///////////
    const favDialog = document.getElementById('favDialog');
    const addmusicbutt = document.getElementById("confirmBtn");
    let str = "test"

    if ( typeof favDialog.showModal !== 'function' ) {
        favDialog.hidden = true;
        /* a fallback script to allow this dialog/form to function
           for legacy browsers that do not support <dialog>
           could be provided here.
        */
    }

    if (addMusic) {
        addMusic.addEventListener("click", function onOpen() {
            //window.open("addmusic.html", "Ratting", "width=550,height=170,left=150,top=200,toolbar=0,status=0,")
            if (typeof favDialog.showModal === "function") {
                favDialog.showModal();
            } else {
                outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
            }
        })
        favDialog.addEventListener('close', function onClose() {
            console.log("oui" + str)
            //let fs = require('fs');
            //let tracklist = require("../public/music/tracks/tracks.json")
            //tracklist.push(str);
            //fs.writeFileSync("./music/tracks/tracks.json", tracklist, "utf8")

        });
    }
    if (addmusicbutt) {
        addmusicbutt.addEventListener("keyup", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if ((/[a-zA-Z1-9\-\\+_.\"\'+=&~$%*]/).test(e.key)) {
                console.log(e.key);
                str += e.key;

            }
        })


    }
    function fillEditor(path) {
        if (path !== "null") {
            localStorage.setItem("currentFile", path);
            if (textEditor) {
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
                    currfile.innerHTML = path.split("\\").pop();
                } else {
                    alert("The file size should be less than " + maxSizeForEditorToOpenAFile + " bytes");
                }
            }
        }
    }

    if (openProject) {
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
            //TODO rootnode
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
    if(textEditor) {
        textEditor.addEventListener("input", function (event) {
            // @ts-ignore
            localStorage.setItem("openedFile", textEditor.value);
        })
    }
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
        audio.volume = 1;
        audio.play().then(() => {
        }).catch(e => console.log(e));
    }

    let tracklist = require("../public/music/tracks/tracks.json")
    const shuffledtracklist = tracklist.sort((a, b) => 0.5 - Math.random());
    console.log(tracklist[0])
    playMusic('../music/FX/intro.mp3');


    let pause_butt = document.getElementById("PauseMusic")
    let play_butt = document.getElementById("PlayMusic")
    let next_butt = document.getElementById("next")
    let previous_butt = document.getElementById("previous")
    let slider = document.getElementById("myRange");
    let current_music = new Audio('../music/tracks/' + tracklist[0])
    let inde = 0
    let volume = 1


    let addbutt = document.getElementById("gitadd");
    let pullbutt = document.getElementById("gitpull");
    let commitbutt = document.getElementById("gitcommit")
    let pushbutt = document.getElementById("gitpush")
    let execbutton = document.getElementById("exec")

    if (addbutt)
    {
        addbutt.addEventListener("click", function (e) {
            //TODO
            playMusic('../music/FX/bleep.wav');
        })
    }
    if (pullbutt) {
        pullbutt.addEventListener("click", function (e) {
            playMusic('../music/FX/fuzz.wav');
        })
    }

    if (commitbutt) {
        commitbutt.addEventListener("click", function (e) {

            playMusic('../music/FX/synth.wav');
        })
    }

    if (pushbutt) {
        pushbutt.addEventListener("click", function (e) {

            playMusic('../music/FX/success.wav');
        })
    }

    function drop(bo) {
        if (bo) {
            playMusic('../music/FX/second.mp3');
        }
        else
            playMusic('../music/FX/sus.mp3');
    }
    if (execbutton) {
        execbutton.addEventListener("click", function () {
            let sc = false;
            playMusic('../music/FX/first.mp3');


            setTimeout(function () {
                drop(sc)
            }, 10000)
        })
    }
    if (pause_butt) {
        pause_butt.addEventListener("click", function (event) {
            play_butt.style.display = "block";
            pause_butt.style.display = "none";
            current_music.pause();
        })
    }
    if (play_butt) {
        play_butt.addEventListener("click", function (event) {

            console.log("e")
            pause_butt.style.display = "block";
            play_butt.style.display = "none";
            current_music.play().then(() => {
            }).catch(e => console.log(e));
        })
    }
    if (next_butt) {
        next_butt.addEventListener("click", function (e) {
            inde = (inde + 1) % shuffledtracklist.length
            current_music.pause()
            current_music = new Audio('../music/tracks/' + shuffledtracklist[inde])
            current_music.volume = volume
            current_music.play().then(() => {
            }).catch(e => console.log(e));
            pause_butt.style.display = "block";
            play_butt.style.display = "none";
        })
    }
    if (previous_butt) {
        previous_butt.addEventListener("click", function (e) {
            if (inde === 0)
                inde = shuffledtracklist.length
            inde -= 1
            current_music.pause()
            current_music = new Audio('../music/tracks/' + shuffledtracklist[inde])
            current_music.volume = volume
            current_music.play().then(() => {
            }).catch(e => console.log(e));
            pause_butt.style.display = "block";
            play_butt.style.display = "none";
        })
    }
    if (slider) {
        slider.addEventListener("input", function () {
            volume = this.value / 100
            current_music.volume = volume
        })
    }
};








const resizerHandler = () => {
    let pageY, consoleHeight, editorHeight
    const resizerElement = document.getElementById("resizer");
    const consoleEditor = document.getElementById("console")
    const editorElement = document.getElementById("editor")
    if (resizerElement) {
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
    const closeButton = document.getElementById("closeButton")
    const hideButton = document.getElementById("hideButton")
    if (closeButton) {
        closeButton.addEventListener("click", function () {
            ipcRenderer.send("close-application");
        });
    }

    if (hideButton) {
        hideButton.addEventListener("click", function () {
            ipcRenderer.send("hide-application");
        });
    }
}