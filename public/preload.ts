window.onload = function () {
    function execute_cmd(cmd, path){
        let res = {output: "Error", error: "Error"};

        process.chdir(path);

        const { exec } = require('node:child_process');

        exec(cmd, (error, stdout, stderr) => {
            res.output = stdout;
            res.error = stderr;
        });

        localStorage.setItem("exec_result", JSON.stringify(res));
        //localStorage("output", xxx);
    }

    //var mus = new Audio("https://youtu.be/oC-GflRB0y4")
    //mus.play()
    execute_cmd("echo test", "C:\\Users\\bomax\\OneDrive\\Desktop\\gitping\\emoroide\\");
    console.log(localStorage.getItem("exec_result"))
    localStorage.setItem("currentFile", null)
    const ipcRenderer = require('electron').ipcRenderer;
    const fs = require('fs');
    const remote = require('@electron/remote');
    const {dialog} = remote;
    const slugger = require('slugger');


    if (localStorage.getItem("currentFile") !== null) {
        fillEditor(localStorage.getItem("currentFile"));
    }

    if (localStorage.getItem("currentProject") !== null) {
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
        window.open("index.html","Ratting","width=550,height=170,left=150,top=200,toolbar=0,status=0,")
    })
    function fillEditor(path) {
        localStorage.setItem("currentFile", path);
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
        if(event.target.classList.contains("explorer-file")){
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
                html += "<label for=\"" + slugger(file) +"\">"
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