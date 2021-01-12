import { execSync } from 'child_process';
import { type, release, platform } from 'os';
import { createReadStream } from 'fs';
import axios from 'axios';
import { Observable, throwError } from 'rxjs';
import FormData from 'form-data';

/**
 * Generic DGWNU Paackte TypeScript Tripple Store Utilities
 */
/**
 * NPM Package Imports
 */
/**
 * Execute Shell Command in Operating System Shell
 * @param command Shell Command to exec in de Operating System Shell
 * @returns Shell Command result output
 */
function execOsShellCommand(osShellcommand) {
    return execSync(osShellcommand).toString();
}
/**
 * System Configuration Information
 */
function systemConfigInfo() {
    return { osType: type(), osRelease: release(), osPlatform: platform() };
}

/**
 * DGWNU Utils to use Fuseki Services
 */
/**
 * Fuseki Server Defaults
 */
axios.defaults.baseURL = 'http://localhost:3030';
/**
 * Run Fuseki-server as a service (will nor restart after reboot)
 * @returns Run Fuseki Service execution results
 */
function services(command) {
    var osPlatform = systemConfigInfo().osPlatform;
    var runResult = undefined;
    switch (osPlatform) {
        case 'darwin': {
            // Mac OS(X) platform
            var osShellCommand = "brew services " + command + " fuseki";
            console.log(osShellCommand);
            runResult = execOsShellCommand(osShellCommand);
            break;
        }
        default: {
            console.log("OS Platform " + osPlatform + " not (yet) supported!");
            break;
        }
    }
    return runResult;
}
/**
 * Fuseki Server Protocol - Ping
 */
var ping = new Observable(function (observer) {
    axios.get('/$/ping', { responseType: 'text' })
        .then(function (response) {
        observer.next('Fuseki Server is Up: ' + response.data);
    })
        .catch(function (error) {
        observer.error(mapErrorMsg(error));
    })
        .finally(function () {
        observer.complete();
    });
});
/**
 * Fuseki Server Protocol - Server Information
 */
var server = new Observable(function (observer) {
    axios.get('/$/server')
        .then(function (response) {
        observer.next(response.data);
    })
        .catch(function (error) {
        observer.error(mapErrorMsg(error));
    })
        .finally(function () {
        observer.complete();
    });
});
/**
 * Fuseki Server Protocol - Dataset Service Information
 * @param datasetName Name of the Dataset (all Datasets if not applied)
 */
function datasetConfig(datasetName) {
    return new Observable(function (observer) {
        var datasetPath = datasetName ? '/' + datasetName : '';
        axios.get("/$/datasets" + datasetPath)
            .then(function (response) {
            observer.next(response.data);
        })
            .catch(function (error) {
            observer.error(mapErrorMsg(error));
        })
            .finally(function () {
            observer.complete();
        });
    });
}
/**
 * Fuseki Server Protocol - Add Dataset Service to Fuseki Server
 * @param assemblerFilePath Path to Dataset Assembler File
 * @see <https://masteringjs.io/tutorials/axios/form-data>
 */
function addDataset(assemblerFilePath) {
    var config = { method: 'POST' };
    setUploadConfig(assemblerFilePath, config);
    return new Observable(function (observer) {
        // PM get upload path from dataset config!
        axios('/$/datasets', config)
            .then(function (response) {
            observer.next(mapResponseMsg(response));
        })
            .catch(function (error) {
            observer.error(mapErrorMsg(error));
        })
            .finally(function () {
            observer.complete();
        });
    });
}
/**
 * Fuseki Server Protocol - Delete Dataset Service from Fuseki Server
 * @param datasetName name of the Dataset on the server
 */
function removeDataset(datasetName) {
    return new Observable(function (observer) {
        axios.delete("/$/datasets/" + datasetName)
            .then(function (response) {
            observer.next(mapResponseMsg(response));
        })
            .catch(function (error) {
            observer.error(mapErrorMsg(error));
        })
            .finally(function () {
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
function getGraphStore(datasetName, graph) {
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
function putGraphStore(datasetName, uploadFilePath, graph) {
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
function postGraphStore(datasetName, uploadFilePath, graph) {
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
function deleteGraphStore(datasetName, graph) {
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
function graphStoreClient(method, datasetName, graph, uploadFilePath) {
    if (graph === void 0) { graph = 'default'; }
    var client;
    var graphQueryParm = graph == 'default' ? graph : encodeURI('?graph=' + graph);
    // PM uploadPath = dataUploadPath(datasetName)
    var graphServicePath = "/" + datasetName + "/data?" + graphQueryParm;
    console.log('graphServicePath: ', graphServicePath);
    var config = { method: method };
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
                client = throwError('Graph Store PUT-Service requires parm "uploadFilePath"');
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
function setUploadConfig(uploadFilePath, config) {
    var formData = new FormData();
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
function fusekiClient(servicePath, config) {
    return new Observable(function (observer) {
        axios(servicePath, config)
            .then(function (response) {
            observer.next(mapResponseMsg(response));
        })
            .catch(function (error) {
            observer.error(mapErrorMsg(error));
        })
            .finally(function () {
            observer.complete();
        });
    });
}
/**
 * Map http (axios) response object
 * @param response http (axios) response object
 */
function mapResponseMsg(response) {
    var responseMsg = 'Response : ';
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
    var errorStr = 'Error: ';
    if (error.response) {
        errorStr += mapResponseMsg(error.response);
    }
    else {
        errorStr += 'Unknown!';
    }
    return errorStr;
}

export { addDataset, datasetConfig, deleteGraphStore, execOsShellCommand, getGraphStore, ping, postGraphStore, putGraphStore, removeDataset, server, services, systemConfigInfo };
