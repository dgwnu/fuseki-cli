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

/**
 * CLI Library Modules
 */
import { services, ping, server, datasetConfig, 
    addDataset, removeDataset, graphStore } from '../lib/dgwnu-fuseki-utils';

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

console.log(`DGWNU - Fuseki CLI - ${command} ${parms}`);

switch (command) {

    case 'run': {
        displayResult(services('run'));
        break;
    }

    case 'start': {
        displayResult(services('start'));
        break;
    }

    case 'restart': {
        displayResult(services('restart'));
        break;
    }

    case 'stop': {
        displayResult(services('stop'));
        break;
    }

    case 'ping': {
        ping.subscribe(
            up => displayResult(up),
            down => displayResult(down)
        );
        break;
    }

    case 'server': {
        server.subscribe(
            data => displayResult(data),
            error => displayResult(error)
        );
        break;
    }

    case 'datasets': {
        datasets(parms).subscribe(
            data => displayResult(data),
            error => displayResult(error)
        );
        break;
    }

    case 'refresh': {
        refresh(parms).subscribe(
            data => displayResult(data),
            error => displayResult(error)
        );
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
function datasets(parms: string[]) {
    let observerable: Observable<any>;

    if (parms.length < 2) {
        // No or one parm supplied
        // Retrieve dataset(s) configuration information
        observerable = datasetConfig(parms[0])
    } else if (parms.length == 2) {
        // two parms supplied
        // add or delete dataset

        if (['-a', '--add'].find(parm => parm == parms[0])) {
            observerable = addDataset(parms[1])
        } else if (['-d', '-delete'].find(parm => parm == parms[0])) {
            observerable = removeDataset(parms[1])
        } else {
            observerable = throwError(`Parms "${parms[0]} ${parms[1]}" are not correct specified!`);
        }

    } else {
        observerable = throwError(`To many Parms ${parms.length} !`);
    }

    return observerable;
}

function refresh(parms: string[]) {
    let observerable: Observable<any>;

    if (parms.length == 2) {
        observerable = graphStore('put', parms[0], undefined, parms[1]);
    } else {
        observerable = throwError('Excact 2 parms (datasetName and tripleFilePath) required for "refresh" command');
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