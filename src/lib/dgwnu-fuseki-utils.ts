/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { createReadStream } from 'fs';
import axios, { AxiosRequestConfig } from 'axios';
import { Observable, throwError } from 'rxjs';
import FormData from 'form-data';

/**
 * Local Library Imports
 */
import { systemConfigInfo } from './dgwnu-system-utils';

/**
 * Fuseki Server Defaults
 */
axios.defaults.baseURL = 'http://localhost:3030';

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
export function getGraphStore(datasetName: string, graph?: string) {
    return graphStoreClient('GET', datasetName, graph);
}

/**
 * Graph Store PUT Operation
 * 
 * @param datasetName Name of the Dataset to refresh all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 * 
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-put>
 */
export function putGraphStore(datasetName: string, uploadFilePath: string, graph?: string, ) {
    return graphStoreClient('PUT', datasetName, graph, uploadFilePath);
}

/**
 * Graph Store POST Operation
 * 
 * @param datasetName Name of the Dataset to update all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 * 
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-post>
 */
export function postGraphStore(datasetName: string, uploadFilePath: string, graph?: string, ) {
    return graphStoreClient('POST', datasetName, graph, uploadFilePath);
}

/**
 * Graph Store DELETE Operation
 * 
 * @param datasetName Name of the Dataset to delete all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 * 
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-delete>
 */
export function deleteGraphStore(datasetName: string, graph?: string) {
    return graphStoreClient('DELETE', datasetName, graph);
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
function graphStoreClient(method: 'GET' | 'PUT' | 'POST' | 'DELETE', datasetName: string, graph: string = 'default', uploadFilePath?: string) {
    let client: Observable<any>;
    const graphQueryParm = graph == 'default' ? graph : encodeURI('?graph=' + graph);
    // PM uploadPath = dataUploadPath(datasetName)
    const graphServicePath = `/${datasetName}/data?${graphQueryParm}`;
    console.log('graphServicePath: ', graphServicePath);

    let config: AxiosRequestConfig = { method: method };
        
    switch (method) {

            case 'GET': {
                config.headers = { Accept: 'text/turtle; charset=utf-8' };
                console.log('GET - Config');
                client = fusekiClient(graphServicePath, config);
                break;
            }

            case 'PUT': {
                if (uploadFilePath) {
                    setUploadConfig(uploadFilePath, config);
                    console.log('PUT - Config');
                    client = fusekiClient(graphServicePath, config);
                } else {
                    client = throwError('Graph Store PUT-Service requires parm "uploadFilePath"');
                }
                break;
            }

            case 'POST': {
                if (uploadFilePath) {
                    setUploadConfig(uploadFilePath, config);
                    console.log('POST - Config');
                    client = fusekiClient(graphServicePath, config);
                } else {
                    client = throwError('Graph Store POST-Service requires parm "uploadFilePath"');
                }
                break;
            }

            case 'DELETE': {
                console.log('DELETE - Config');
                client = fusekiClient(graphServicePath, config);
                break;
            }

    }

    return client;
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
 * Observerable for Fuseki Client
 * 
 * @param servicePath Path to the service to Request
 * @param config Request Configuration
 */
function fusekiClient(servicePath: string, config: AxiosRequestConfig) {

    return new Observable<any>(observer => {
        axios(servicePath, config)
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

/**
 * Map http (axios) error object
 * @param error http (axios) error object
 */
function mapErrorMsg(error: any) {
    let errorStr = 'Error: ';

    if (error.response) {
        errorStr += mapResponseMsg(error.response); 
    } else {
        errorStr += 'Unknown!';
    }

    return errorStr;
}