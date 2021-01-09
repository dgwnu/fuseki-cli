#!/usr/bin/env node
/**
 * Run Fuseki
 */
"use strict"

import { argv } from 'process';
import { fusekiServices, fusekiPing, fusekiServer } from '../lib/dgwnu-fuseki-utils';

const command = argv[2];
console.log(`DGWNU - Fuseki CLI - ${command}`);

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
        fusekiPing.subscribe(
            data => displayResult(JSON.stringify(data)),
            error => displayResult(JSON.stringify(error))
        );
        break;
    }

    default: {
        console.log(`Missing or invalig param ${argv[2]}`);
        console.log('Param should be a: run, start, restart, stop');
        break;
    }
}


function displayResult(result: string) {

    if (result) {
        console.log(result);
    } else {
        console.log('No result output!');
    }

}