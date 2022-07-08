import React, {FC} from 'react';
import {json} from "stream/consumers";
import {stringify} from "querystring";

function execute_cmd(cmd: string, path: string){
    let res = {output: "Error", error: "Error"};

    process.chdir(path);

    const { exec } = require('node:child_process');

    exec(cmd, (error: any, stdout: string, stderr: string) => {
        res.output = stdout;
        res.error = stderr;
    });

    localStorage.setItem("exec_result", JSON.stringify(res));
    //localStorage("output", xxx);
}

export default execute_cmd;