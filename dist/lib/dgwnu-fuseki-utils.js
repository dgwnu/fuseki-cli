"use strict";
/**
 * DGWNU Utils to use Fuseki Services
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGraphStore = exports.postGraphStore = exports.putGraphStore = exports.getGraphStore = exports.removeDataset = exports.addDataset = exports.datasetConfig = exports.server = exports.ping = exports.services = void 0;
/**
 * Node Package Imports
 */
const fs_1 = require("fs");
const axios_1 = __importDefault(require("axios"));
const rxjs_1 = require("rxjs");
const form_data_1 = __importDefault(require("form-data"));
/**
 * Local Library Imports
 */
const dgwnu_system_utils_1 = require("./dgwnu-system-utils");
/**
 * Fuseki Server Defaults
 */
axios_1.default.defaults.baseURL = 'http://localhost:3030';
/**
 * Run Fuseki-server as a service (will nor restart after reboot)
 * @returns Run Fuseki Service execution results
 */
function services(command) {
    const osPlatform = dgwnu_system_utils_1.systemConfigInfo().osPlatform;
    let runResult = undefined;
    switch (osPlatform) {
        case 'darwin': {
            // Mac OS(X) platform
            const osShellCommand = `brew services ${command} fuseki`;
            console.log(osShellCommand);
            runResult = dgwnu_system_utils_1.execOsShellCommand(osShellCommand);
            break;
        }
        default: {
            console.log(`OS Platform ${osPlatform} not (yet) supported!`);
            break;
        }
    }
    return runResult;
}
exports.services = services;
/**
 * Fuseki Server Protocol - Ping
 */
exports.ping = new rxjs_1.Observable(observer => {
    axios_1.default.get('/$/ping', { responseType: 'text' })
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
exports.server = new rxjs_1.Observable(observer => {
    axios_1.default.get('/$/server')
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
function datasetConfig(datasetName) {
    return new rxjs_1.Observable(observer => {
        const datasetPath = datasetName ? '/' + datasetName : '';
        axios_1.default.get(`/$/datasets${datasetPath}`)
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
exports.datasetConfig = datasetConfig;
/**
 * Fuseki Server Protocol - Add Dataset Service to Fuseki Server
 * @param assemblerFilePath Path to Dataset Assembler File
 * @see <https://masteringjs.io/tutorials/axios/form-data>
 */
function addDataset(assemblerFilePath) {
    let config = { method: 'POST' };
    setUploadConfig(assemblerFilePath, config);
    return new rxjs_1.Observable(observer => {
        // PM get upload path from dataset config!
        axios_1.default('/$/datasets', config)
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
exports.addDataset = addDataset;
/**
 * Fuseki Server Protocol - Delete Dataset Service from Fuseki Server
 * @param datasetName name of the Dataset on the server
 */
function removeDataset(datasetName) {
    return new rxjs_1.Observable(observer => {
        axios_1.default.delete(`/$/datasets/${datasetName}`)
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
exports.removeDataset = removeDataset;
/**
 * Graph Store GET Operation
 *
 * @param datasetName Name of the Dataset to retrieve all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 *
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-get>
 */
function getGraphStore(datasetName, graph) {
    return graphStoreClient('GET', datasetName, graph);
}
exports.getGraphStore = getGraphStore;
/**
 * Graph Store PUT Operation
 *
 * @param datasetName Name of the Dataset to refresh all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 *
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-put>
 */
function putGraphStore(datasetName, uploadFilePath, graph) {
    return graphStoreClient('PUT', datasetName, graph, uploadFilePath);
}
exports.putGraphStore = putGraphStore;
/**
 * Graph Store POST Operation
 *
 * @param datasetName Name of the Dataset to update all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 *
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-post>
 */
function postGraphStore(datasetName, uploadFilePath, graph) {
    return graphStoreClient('POST', datasetName, graph, uploadFilePath);
}
exports.postGraphStore = postGraphStore;
/**
 * Graph Store DELETE Operation
 *
 * @param datasetName Name of the Dataset to delete all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 *
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-delete>
 */
function deleteGraphStore(datasetName, graph) {
    return graphStoreClient('DELETE', datasetName, graph);
}
exports.deleteGraphStore = deleteGraphStore;
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
function graphStoreClient(method, datasetName, graph = 'default', uploadFilePath) {
    let client;
    const graphQueryParm = graph == 'default' ? graph : encodeURI('?graph=' + graph);
    // PM uploadPath = dataUploadPath(datasetName)
    const graphServicePath = `/${datasetName}/data?${graphQueryParm}`;
    console.log('graphServicePath: ', graphServicePath);
    let config = { method: method };
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
            }
            else {
                client = rxjs_1.throwError('Graph Store PUT-Service requires parm "uploadFilePath"');
            }
            break;
        }
        case 'POST': {
            if (uploadFilePath) {
                setUploadConfig(uploadFilePath, config);
                console.log('POST - Config');
                client = fusekiClient(graphServicePath, config);
            }
            else {
                client = rxjs_1.throwError('Graph Store POST-Service requires parm "uploadFilePath"');
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
function setUploadConfig(uploadFilePath, config) {
    const formData = new form_data_1.default();
    formData.append('uploadfile', fs_1.createReadStream(uploadFilePath));
    config.data = formData;
    config.headers = formData.getHeaders();
}
/**
 * Observerable for Fuseki Client
 *
 * @param servicePath Path to the service to Request
 * @param config Request Configuration
 */
function fusekiClient(servicePath, config) {
    return new rxjs_1.Observable(observer => {
        axios_1.default(servicePath, config)
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
function mapResponseMsg(response) {
    let responseMsg = 'Response : ';
    if (response.status) {
        responseMsg += response.status + ' - ' + response.statusText + '\n';
    }
    else {
        responseMsg += 'Unknown!';
    }
    return responseMsg;
}
/**
 * Map http (axios) error object
 * @param error http (axios) error object
 */
function mapErrorMsg(error) {
    let errorStr = 'Error: ';
    if (error.response) {
        errorStr += mapResponseMsg(error.response);
    }
    else {
        errorStr += 'Unknown!';
    }
    return errorStr;
}
