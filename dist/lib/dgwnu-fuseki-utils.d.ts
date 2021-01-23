/**
 * DGWNU Utils to use Fuseki Services
 */
import { Observable } from 'rxjs';
/**
 * Fuseki Server Protocol - Ping
 */
export declare const ping: Observable<string>;
/**
 * Fuseki Server Protocol - Server Information
 */
export declare const server: Observable<any>;
/**
 * Fuseki Server Protocol - Dataset Service Information
 * @param datasetName Name of the Dataset (all Datasets if not applied)
 */
export declare function datasetConfig(datasetName?: string): Observable<any>;
/**
 * Fuseki Server Protocol - Add Dataset Service to Fuseki Server
 * @param assemblerFilePath Path to Dataset Assembler File
 * @see <https://masteringjs.io/tutorials/axios/form-data>
 */
export declare function addDataset(assemblerFilePath: string): Observable<any>;
/**
 * Fuseki Server Protocol - Delete Dataset Service from Fuseki Server
 * @param datasetName name of the Dataset on the server
 */
export declare function removeDataset(datasetName: string): Observable<any>;
/**
 * Graph Store GET Operation
 *
 * @param datasetName Name of the Dataset to retrieve all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 *
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-get>
 */
export declare function getGraphStore(datasetName: string, graph?: string): Observable<any>;
/**
 * Graph Store PUT Operation
 *
 * @param datasetName Name of the Dataset to refresh all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 *
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-put>
 */
export declare function putGraphStore(datasetName: string, uploadFilePath: string, graph?: string): Observable<any>;
/**
 * Graph Store POST Operation
 *
 * @param datasetName Name of the Dataset to update all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 *
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-post>
 */
export declare function postGraphStore(datasetName: string, uploadFilePath: string, graph?: string): Observable<any>;
/**
 * Graph Store DELETE Operation
 *
 * @param datasetName Name of the Dataset to delete all data
 * @param graph Other then default graph IRI (http://example.graph.sample)
 *
 * @see <https://www.w3.org/TR/sparql11-http-rdf-update/#http-delete>
 */
export declare function deleteGraphStore(datasetName: string, graph?: string): Observable<any>;
