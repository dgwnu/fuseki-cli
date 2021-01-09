/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { createReadStream, readFileSync } from 'fs';
import axios from 'axios';
import { Observable, throwError } from 'rxjs';
import * as FormData from 'form-data';

/**
 * Local Library Imports
 */
import { execOsShellCommand, systemConfigInfo } from './dgwnu-system-utils';

/**
 * Fuseki Server Defaults
 */
axios.defaults.baseURL = 'http://localhost:3030';
const uploadApi = axios.create({ method: 'POST' });

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
 * Fuseki Server Protocol - Dataset Service Information
 * @param datasetName Name of the Dataset (all Datasets if not applied)
 */
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
 * @param assemblerFilePath Path to Dataset Assembler File
 * @see <https://masteringjs.io/tutorials/axios/form-data>
 */
export function fusekiAddDataset(assemblerFilePath: string) {
    //uploadApi.defaults.headers['content-type'] = 'text/turtle';
    const formData = new FormData();
    formData.append('assembler', createReadStream(assemblerFilePath));

    return new Observable<any>(observer => {
        // PM get upload path from dataset config!
        axios.post('/$/datasets', formData, { headers: formData.getHeaders() })
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
 * Fuseki Server Protocol - Delete Dataset Service from Fuseki Server
 * @param datasetname name of the Dataset on the server
 */
export function fusekiRemoveDataset(datasetname: string) {
    return new Observable<any>(observer => {
        // PM get upload path from dataset config!
        axios.delete(`/$/datasets/${datasetname}`)
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