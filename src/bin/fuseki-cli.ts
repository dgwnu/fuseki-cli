#!/usr/bin/env node
/**
 * Run Fuseki
 */
"use strict"

import { argv } from 'process';
import { fusekiServices, serverStatus } from '../lib/dgwnu-fuseki-utils';

const command = argv[2];
console.log(`DGWNU - Fuseki CLI - ${command}`);
let result = undefined;

switch (command) {

    case 'run': {
        result = fusekiServices('run');
        break;
    }

    case 'start': {
        result = fusekiServices('start');
        break;
    }

    case 'restart': {
        result = fusekiServices('restart');
        break;
    }

    case 'stop': {
        result = fusekiServices('stop');
        break;
    }

    case 'status': {
        result = serverStatus();
        break;
    }

    default: {
        console.log(`Missing or invalig param ${argv[2]}`);
        console.log('Param should be a: run, start, restart, stop');
        break;
    }
}

if (result) {
    console.log(result);
} else {
    console.log('No result output!');
}