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
import { fusekiServices, fusekiPing, fusekiServer, fusekiDatasetConfig, 
    fusekiAddDataset, fusekiRemoveDataset } from '../lib/dgwnu-fuseki-utils';

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
        displayResult(fusekiServices('run'));
        break;
    }

    case 'start': {
        displayResult(fusekiServices('start'));
        break;
    }

    case 'restart': {
        displayResult(fusekiServices('restart'));
        break;
    }

    case 'stop': {
        displayResult(fusekiServices('stop'));
        break;
    }

    case 'ping': {
        fusekiPing.subscribe(
            up => displayResult(up),
            down => displayResult(down)
        );
        break;
    }

    case 'server': {
        fusekiServer.subscribe(
            data => displayResult(data),
            error => displayResult(error)
        );
        break;
    }

    case 'datasets': {
        fusekiDatasets(parms).subscribe(
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
function fusekiDatasets(parms: string[]) {
    let observerable: Observable<any>;

    if (parms.length < 2) {
        // No or one parm supplied
        // Retrieve dataset(s) configuration information
        observerable = fusekiDatasetConfig(parms[0])
    } else if (parms.length == 2) {
        // two parms supplied
        // add or delete dataset

        if (['-a', '--add'].find(parm => parm == parms[0])) {
            observerable = fusekiAddDataset(parms[1])
        } else if (['-d', '-delete'].find(parm => parm == parms[0])) {
            observerable = fusekiRemoveDataset(parms[1])
        } else {
            observerable = throwError(`Parms "${parms[0]} ${parms[1]}" are not correct specified!`);
        }

    } else {
        observerable = throwError(`To many Parms ${parms.length} !`);
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