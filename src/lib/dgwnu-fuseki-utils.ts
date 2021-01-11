/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { createReadStream } from 'fs';
import axios, { AxiosRequestConfig } from 'axios';
import { observable, Observable } from 'rxjs';
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
        observer.error(mapErrorMsg(error));
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
        observer.error(mapErrorMsg(error));
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
    let config: AxiosRequestConfig = { method: 'POST' };
    setUploadConfig(assemblerFilePath, config);
    
    return new Observable<any>(observer => {
        // PM get upload path from dataset config!
        axios('/$/datasets', config )
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
        axios.delete(`/$/datasets/${datasetName}`)
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
 * Graph Store GET Operation
 * 
 * @param datasetName Name of the Dataset to retrieve all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 * 
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-get>
 */
export function graphStoreGet(datasetName: string, graph?: string) {
    return graphStore('GET', datasetName, graph);
}

/**
 * Graph Store PUT Operation
 * 
 * @param datasetName Name of the Dataset to refresh all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 * 
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-put>
 */
export function graphStorePut(datasetName: string, uploadFilePath: string, graph?: string, ) {
    return graphStore('PUT', datasetName, graph, uploadFilePath);
}

/**
 * Graph Store POST Operation
 * 
 * @param datasetName Name of the Dataset to update all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 * 
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-post>
 */
export function graphStorePost(datasetName: string, uploadFilePath: string, graph?: string, ) {
    return graphStore('POST', datasetName, graph, uploadFilePath);
}

/**
 * Graph Store DELETE Operation
 * 
 * @param datasetName Name of the Dataset to delete all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 * 
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-delete>
 */
export function graphStoreDelete(datasetName: string, graph?: string) {
    return graphStore('DELETE', datasetName, graph);
}

/**
 * Graph Store Management Operations
 * 
 * @param method Graph Store Management Operation Method
 * @param datasetName Name of the Dataset to Manage
 * @param graph Other then default graph IRI (http://example.graph.sample)
 * @param uploadFilePath Path to triples file data to upload (post and put methods)
 * 
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/>
 */
function graphStore(method: 'GET' | 'PUT' | 'POST' | 'DELETE', datasetName: string, graph: string = 'default', uploadFilePath?: string) {
    let observerable: Observable<any>;
    const graphQueryParm = graph == 'default' ? graph : encodeURI('?graph=' + graph);
    // PM uploadPath = dataUploadPath(datasetName)
    const graphDataPath = `/${datasetName}/data?${graphQueryParm}`;
    console.log('graphDataPath: ', graphDataPath);

    let config: AxiosRequestConfig = { method: method };
        
    switch (method) {

            case 'GET': {
                config.headers = { Accept: 'text/turtle; charset=utf-8' };
                console.log('GET - Config');
                break;
            }

            case 'PUT': {
                if (uploadFilePath) {
                    setUploadConfig(uploadFilePath, config);
                    console.log('PUT - Config');
                    observable = 

                }
                break;
            }

            case 'POST': {
                setUploadConfig(uploadFilePath, config);
                console.log('POST - Config');
                break;
            }

            case 'DELETE': {
                console.log('DELETE - Config');
                break;
            }

    }

    observerable = new Observable<any>(observer => {
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

    return observerable;
}

/**
 * Update Axios Config for Form Data Read Stream for File Upload (put, post, ..)
 * @param uploadFilePath 
 */
function setUploadConfig(uploadFilePath: string, config: AxiosRequestConfig) {
    const formData = new FormData();
    formData.append('uploadfile', createReadStream(uploadFilePath));
    config.data = formData;
    config.headers = formData.getHeaders();
}

/**
 * Get the Dataset GraphStore Upload Path
 */
function dataUploadPath(datasetName: string) {

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