#!/usr/bin/env node
/**
 * Run Fuseki
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = require("process");
var dgwnu_fuseki_utils_1 = require("../lib/dgwnu-fuseki-utils");
var command = process_1.argv[2];
console.log("DGWNU - Fuseki CLI - " + command);
var result = undefined;
switch (command) {
    case 'run': {
        result = dgwnu_fuseki_utils_1.fusekiServices('run');
        break;
    }
    case 'start': {
        result = dgwnu_fuseki_utils_1.fusekiServices('start');
        break;
    }
    case 'restart': {
        result = dgwnu_fuseki_utils_1.fusekiServices('restart');
        break;
    }
    case 'stop': {
        result = dgwnu_fuseki_utils_1.fusekiServices('stop');
        break;
    }
    default: {
        console.log("Missing or invalig param " + process_1.argv[2]);
        console.log('Param should be a: run, start, restart, stop');
        break;
    }
}
if (result) {
    console.log(result);
}
else {
    console.log('No result output!');
}
