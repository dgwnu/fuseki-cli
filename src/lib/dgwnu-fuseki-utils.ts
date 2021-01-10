/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { createReadStream } from 'fs';
import { default as http, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import * as FormData from 'form-data';

/**
 * Local Library Imports
 */
import { execOsShellCommand, systemConfigInfo } from './dgwnu-system-utils';

/**
 * Fuseki Server Defaults
 */
http.defaults.baseURL = 'http://localhost:3030';

/**
 * Run Fuseki-server as a service (will nor restart after reboot)
 * @returns Run Fuseki Service execution results
 */
export function services(command: 'run' | 'start' | 'restart' | 'stop') {
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
export const ping = new Observable<string>(observer => {
    http.get('/$/ping', { responseType: 'text' })
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
export const server = new Observable<any>(observer => {
    http.get('/$/server')
    .then(response => {
        observer.next(response.data);
    })
    .catch(error => {
        observer.error('Fuseki Server is Not Found!');
    })
    .finally(() => {
        observer.complete();
    });
});

/**
 * Fuseki Server Protocol - Dataset Service Information
 * @param datasetName Name of the Dataset (all Datasets if not applied)
 */
export function datasetConfig(datasetName?: string) {
    return new Observable<any>(observer => {
        const datasetPath = datasetName ? '/' + datasetName : '';

        http.get(`/$/datasets${datasetPath}`)
        .then(response => {
            observer.next(response.data);
        })
        .catch(error => {
            observer.error(error.response.data);
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
export function addDataset(assemblerFilePath: string) {
    const formData = new FormData();
    formData.append('assembler', createReadStream(assemblerFilePath));

    return new Observable<any>(observer => {
        // PM get upload path from dataset config!
        http.post('/$/datasets', formData, { headers: formData.getHeaders() })
        .then(response => {
            observer.next(statusMsg(response));
        })
        .catch(error => {
            observer.error(error.response.data);
        })
        .finally(() => {
            observer.complete();
        });
    });
}

/**
 * Fuseki Server Protocol - Delete Dataset Service from Fuseki Server
 * @param datasetName name of the Dataset on the server
 */
export function removeDataset(datasetName: string) {
    return new Observable<any>(observer => {
        // PM get upload path from dataset config!
        http.delete(`/$/datasets/${datasetName}`)
        .then(response => {
            observer.next(statusMsg(response));
        })
        .catch(error => {
            observer.error(error.response.data);
        })
        .finally(() => {
            observer.complete();
        });
    });
}

/**
 * Refresh Dataset Contents with triples file
 * @param datasetName Name of dataset to refresh
 * @param triplesFilePath Path to triples file with refresh data
 */
export function refreshData(datasetName: string, triplesFilePath: string) {
    const formData = new FormData();
    formData.append('data', createReadStream(triplesFilePath));
    const dataHeaders = formData.getHeaders();
    
    return new Observable<any>(observer => {
        // PM get upload path from dataset config!
        http.put(`/${datasetName}/data`, formData, { headers: dataHeaders })
        .then(response => {
            observer.next(statusMsg(response));
        })
        .catch(error => {
            observer.error(error.response.data);
        })
        .finally(() => {
            observer.complete();
        });
    });
}

function statusMsg(response: AxiosResponse) {
    return `${response.status} - ${response.statusText}`;
}