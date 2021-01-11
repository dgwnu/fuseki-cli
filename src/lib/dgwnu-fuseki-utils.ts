/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { createReadStream } from 'fs';
import axios, { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';
import * as FormData from 'form-data';

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
export const server = new Observable<any>(observer => {
    axios.get('/$/server')
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

        axios.get(`/$/datasets${datasetPath}`)
        .then(response => {
            observer.next(response.data);
        })
        .catch(error => {
            observer.error(mapErrorMsg(error));
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
        axios.post('/$/datasets', formData, { headers: formData.getHeaders() })
        .then(response => {
            observer.next(mapResponseMsg(response));
        })
        .catch(error => {
            observer.error(mapErrorMsg(error));
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
        axios.delete(`/$/datasets/${datasetName}`)
        .then(response => {
            observer.next(mapResponseMsg(response));
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
 * 
 * @param datasetName Name of dataset to refresh
 * @param triplesFilePath Path to triples file with refresh data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 * 
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-put>
 */
export function graphStorePut(datasetName: string, triplesFilePath: string, graph: string = 'default' ) {
    const formData = new FormData();
    formData.append('data', createReadStream(triplesFilePath));
    const dataHeaders = formData.getHeaders();
    const graphQueryParm = graph == 'default' ? graph : encodeURI('graph=' + graph);  
    const graphDataPath = `/${datasetName}/data?${graphQueryParm}`;
    console.log('graphDataPath: ', graphDataPath);

    const config: AxiosRequestConfig = { headers: dataHeaders, data: formData, method: 'put' };

    return new Observable<any>(observer => {
        // PM get upload path from dataset config!
        axios(graphDataPath, config)
        .then(response => {
            observer.next(mapResponseMsg(response));
        })
        .catch(error => {
            observer.error(error.response.data);
        })
        .finally(() => {
            observer.complete();
        });
    });
}

function dataUploadPath() {

}

/**
 * Map http (axios) response object
 * @param response http (axios) response object
 */
function mapResponseMsg(response: any) {
    let responseMsg = 'Response : ';
    
    if (response.status) {
        responseMsg += response.status + ' - ' + response.statusText + '\n';
    } else {
        responseMsg += 'Unknown!';
    }
        
    return responseMsg;
}

function mapErrorMsg(error: any) {
    let errorStr = 'Error: ';

    if (error.response) {
        errorStr += mapResponseMsg(error.response); 
    } else {
        errorStr += 'Unknown!';
    }

    return errorStr;
}