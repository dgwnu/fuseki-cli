#!/usr/bin/env node
/**
 * Run Fuseki
 */
"use strict"

/**
 * Node Package Modules
 */
import { argv } from 'process';
import { inspect } from 'util';
import { Observable, throwError } from 'rxjs';
import * as Colors from 'colors';

/**
 * CLI Library Modules
 */
import { ping, server, datasetConfig, 
    addDataset, removeDataset, putGraphStore, postGraphStore
} from '../lib/dgwnu-fuseki-utils';

/**
 * colors constant that is used for console.log()
 * Based on <https://www.voidcanvas.com/make-console-log-output-colorful-and-stylish-in-browser-node/>
 */
const colors = Colors;

//
// START CLI Script
//
const command = argv[2];
let parms: string[] = [];

if (argv[3]) {
    parms.push(argv[3]);
}

if (argv[4]) {
    parms.push(argv[4]);
}

console.log(`DGWNU - Fuseki CLI - ${command} ${parms}`.bgRed.yellow.bold);

switch (command) {

    case 'ping': {
        ping.subscribe({
            next: (up) => displayResult(up),
            error: (down) => displayResult(down)
        });
        break;
    }

    case 'server': {
        server.subscribe({
            next: (data) => displayResult(data),
            error: (error) => displayResult(error)
        });
        break;
    }

    case 'datasets': {
        datasets(parms).subscribe({
            next: (data) => displayResult(data),
            error: (error) => displayResult(error)
        });
        break;
    }

    case 'put': {
        putData(parms).subscribe({
            next: (data) => displayResult(data),
            error: (error) => displayResult(error)
        });
        break;
    }

    case 'post': {
        postData(parms).subscribe({
            next: (data) => displayResult(data),
            error: (error) => displayResult(error)
        });
        break;
    }

    default: {
        console.log(`Missing or invalig param ${command}`);
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
function datasets(parms: string[]) {
    let observerable: Observable<any>;

    if (parms.length < 2) {
        // No or one parm supplied
        // Retrieve dataset(s) configuration information
        observerable = datasetConfig(parms[0])
    } else if (parms.length == 2) {
        // two parms supplied
        // add or delete dataset

        if (['-a', '-add'].find(parm => parm == parms[0])) {
            observerable = addDataset(parms[1])
        } else if (['-r', '-remove'].find(parm => parm == parms[0])) {
            observerable = removeDataset(parms[1])
        } else {
            observerable = throwError(`Parms "${parms[0]} ${parms[1]}" are not correct specified!`);
        }

    } else {
        observerable = throwError(`To many Parms ${parms.length} !`);
    }

    return observerable;
}

function putData(parms: string[]) {
    let observerable: Observable<any>;

    if (parms.length == 2) {
        observerable = putGraphStore(parms[0], parms[1]);
    } else {
        observerable = throwError('Excact 2 parms (datasetName and tripleFilePath) required for "put" command');
    }

    return observerable;
}

function postData(parms: string[]) {
    let observerable: Observable<any>;

    if (parms.length == 2) {
        observerable = postGraphStore(parms[0], parms[1]);
    } else {
        observerable = throwError('Excact 2 parms (datasetName and tripleFilePath) required for "post" command');
    }

    return observerable;
}

function displayResult(result: any) {

    if (result) {
        if (typeof result == 'string') {
            console.log(result);
        } else {
            console.log(inspect(result, false, 5, true));
        }
    } else {
        console.log('No result output!');
    }

}