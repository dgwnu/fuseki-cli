#!/usr/bin/env node
/**
 * Run Fuseki
 */
"use strict"

import { argv } from 'process';
import { inspect } from 'util';
import { fusekiServices, fusekiPing, fusekiServer, fusekiDatasets } from '../lib/dgwnu-fuseki-utils';

const command = argv[2] ? argv[2] : '(no value supplied)' +
    argv[3] ? '-' + argv[3] : '' +
    argv[4] ? '-' + argv[4] : '' +
    argv[5] ? '-' + argv[5] : '' ;
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
        fusekiServer.subscribe(
            data => displayResult(data),
            error => displayResult(error)
        );
        break;
    }

    case 'datasets': {
        fusekiDatasets().subscribe(
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