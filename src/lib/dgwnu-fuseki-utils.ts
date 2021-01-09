/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { createReadStream } from 'fs';
import axios from 'axios';
import { Observable } from 'rxjs';

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
 * Fuseki Server Protocol - Dataset(s) Service Config Information
 * @param datasetName Name of Dataset (default is all Datasets)
 */
export function fusekiDatasets(parms: string[]) {

    if (parms.length < 2) {
        const datasetPath = parms.length == 1 ? '/' + parms[0] : '';

        return new Observable<any>(observer => {
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

}

/**
 * Fuseki Server Protocol - Add Dataset Service to Fuseki Server
 * @param datasetName Name of the Dataset
 * @param assemblerFilePath Path to the Dataset Assembler File
 */
export function fusekiAddDataset(datasetName: string, assemblerFilePath: string) {
    return new Observable<any>(observer => {
        // PM get upload path from dataset config!
        axios.post(`/$/datasets/${datasetName}/upload`, { data: createReadStream(assemblerFilePath) })
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