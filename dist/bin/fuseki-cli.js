#!/usr/bin/env node
/**
 * Run Fuseki
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Node Package Modules
 */
const process_1 = require("process");
const util_1 = require("util");
const rxjs_1 = require("rxjs");
/**
 * CLI Library Modules
 */
const dgwnu_fuseki_utils_1 = require("../lib/dgwnu-fuseki-utils");
//
// START CLI Script
//
const command = process_1.argv[2];
let parms = [];
if (process_1.argv[3]) {
    parms.push(process_1.argv[3]);
}
if (process_1.argv[4]) {
    parms.push(process_1.argv[4]);
}
console.log(`DGWNU - Fuseki CLI - ${command} ${parms}`);
switch (command) {
    case 'run': {
        displayResult(dgwnu_fuseki_utils_1.services('run'));
        break;
    }
    case 'start': {
        displayResult(dgwnu_fuseki_utils_1.services('start'));
        break;
    }
    case 'restart': {
        displayResult(dgwnu_fuseki_utils_1.services('restart'));
        break;
    }
    case 'stop': {
        displayResult(dgwnu_fuseki_utils_1.services('stop'));
        break;
    }
    case 'ping': {
        dgwnu_fuseki_utils_1.ping.subscribe(up => displayResult(up), down => displayResult(down));
        break;
    }
    case 'server': {
        dgwnu_fuseki_utils_1.server.subscribe(data => displayResult(data), error => displayResult(error));
        break;
    }
    case 'datasets': {
        datasets(parms).subscribe(data => displayResult(data), error => displayResult(error));
        break;
    }
    case 'put': {
        putData(parms).subscribe(data => displayResult(data), error => displayResult(error));
        break;
    }
    case 'post': {
        postData(parms).subscribe(data => displayResult(data), error => displayResult(error));
        break;
    }
    default: {
        console.log(`Missing or invalig param ${command}`);
        console.log('Param should be a: run, start, restart, stop');
        break;
    }
}
//
// END CLI Script
//
/**
 * Fuseki Server Protocol - Dataset(s) Service Configuration
 * @param parms for process options
 *
 * One paramater supplied: dataset name
 *
 * Two parameters supplied:
 *
 * => 1st parm: -a | --add | -d | --delete
 *
 * => 2nd parm: assembly file path of dataset to add | name of dataset to delete
 */
function datasets(parms) {
    let observerable;
    if (parms.length < 2) {
        // No or one parm supplied
        // Retrieve dataset(s) configuration information
        observerable = dgwnu_fuseki_utils_1.datasetConfig(parms[0]);
    }
    else if (parms.length == 2) {
        // two parms supplied
        // add or delete dataset
        if (['-a', '-add'].find(parm => parm == parms[0])) {
            observerable = dgwnu_fuseki_utils_1.addDataset(parms[1]);
        }
        else if (['-r', '-remove'].find(parm => parm == parms[0])) {
            observerable = dgwnu_fuseki_utils_1.removeDataset(parms[1]);
        }
        else {
            observerable = rxjs_1.throwError(`Parms "${parms[0]} ${parms[1]}" are not correct specified!`);
        }
    }
    else {
        observerable = rxjs_1.throwError(`To many Parms ${parms.length} !`);
    }
    return observerable;
}
function putData(parms) {
    let observerable;
    if (parms.length == 2) {
        observerable = dgwnu_fuseki_utils_1.putGraphStore(parms[0], parms[1]);
    }
    else {
        observerable = rxjs_1.throwError('Excact 2 parms (datasetName and tripleFilePath) required for "put" command');
    }
    return observerable;
}
function postData(parms) {
    let observerable;
    if (parms.length == 2) {
        observerable = dgwnu_fuseki_utils_1.postGraphStore(parms[0], parms[1]);
    }
    else {
        observerable = rxjs_1.throwError('Excact 2 parms (datasetName and tripleFilePath) required for "post" command');
    }
    return observerable;
}
function displayResult(result) {
    if (result) {
        if (typeof result == 'string') {
            console.log(result);
        }
        else {
            console.log(util_1.inspect(result, false, 5, true));
        }
    }
    else {
        console.log('No result output!');
    }
}
