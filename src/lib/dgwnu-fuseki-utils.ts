/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { createReadStream } from 'fs';
import axios from 'axios';
import { Observable, throwError } from 'rxjs';

/**
 * Local Library Imports
 */
import { execOsShellCommand, systemConfigInfo } from './dgwnu-system-utils';

/**
 * Fuseki Server Defaults
 */
axios.defaults.baseURL = 'http://localhost:3030';


/**
 * Run Fuseki-server as a service (will nor restart after reboot)
 * @returns Run Fuseki Service execution results
 */
export function fusekiServices(command: 'run' | 'start' | 'restart' | 'stop') {
    const osPlatform = systemConfigInfo().osPlatform;
    let runResult = undefined;

    switch (osPlatform) {

        case 'darwin': {
            // Mac OS(X) platform
            const osShellCommand = `brew services ${command} fuseki`;
            console.log(osShellCommand);
            runResult = execOsShellCommand(osShellCommand);
            break;
        }

        default: {
            console.log(`OS Platform ${osPlatform} not (yet) supported!`);
            break;
        }

    }

    return runResult;
}

/**
 * Fuseki Server Protocol - Ping
 */
export const fusekiPing = new Observable<string>(observer => {
    axios.get('/$/ping', { responseType: 'text' })
    .then(response => {
        observer.next('Fuseki Server is Up: ' + response.data);
    })
    .catch(error => {
        observer.error('Fuseki Server is Down!');
    })
    .finally(() => {
        observer.complete();
    });
});

/**
 * Fuseki Server Protocol - Server Information
 */
export const fusekiServer = new Observable<any>(observer => {
    axios.get('/$/server')
    .then(response => {
        observer.next(response.data);
    })
    .catch(error => {
        observer.error(error);
    })
    .finally(() => {
        observer.complete();
    });
});

/**
 * Fuseki Server Protocol - Dataset(s) Service Configuration
 * @param parms With process options
 * 
 * One paramater supplied: dataset name
 * 
 * Two parameters supplied: 
 * 
 * => 1st parm: -a | --add | -d | --delete
 * 
 * => 2nd parm: assembly file path of dataset to add | name of dataset to delete
 */
export function fusekiDatasets(parms: string[]) {
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

        } else {
            observerable = throwError(`Parms "${parms[0]} ${parms[1]}" are not correct specified!`);
        }

    } else {
        observerable = throwError(`To many Parms ${parms.length} !`);
    }

    return observerable;
}

export function fusekiDatasetConfig(datasetName?: string) {
    return new Observable<any>(observer => {
        const datasetPath = datasetName ? '/' + datasetName : '';

        axios.get(`/$/datasets${datasetPath}`)
        .then(response => {
            observer.next(response.data);
        })
        .catch(error => {
            observer.error(error);
        })
        .finally(() => {
            observer.complete();
        });

    });
}


/**
 * Fuseki Server Protocol - Add Dataset Service to Fuseki Server
 * @param datasetName Name of the Dataset
 * @param assemblerFilePath Path to the Dataset Assembler File
 */
export function fusekiAddDataset(assemblerFilePath: string) {
    return new Observable<any>(observer => {
        // PM get upload path from dataset config!
        axios.post('/$/datasets', { data: createReadStream(assemblerFilePath) })
        .then(response => {
            observer.next(response.data);
        })
        .catch(error => {
            observer.error(error);
        })
        .finally(() => {
            observer.complete();
        });
    });
}