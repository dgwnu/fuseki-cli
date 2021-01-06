/**
 * File: post-ontology.ts
 * Fuseki Cli Test Script to develop FormData Upload to Fuseki Server
 */

import * as FormData from 'form-data';
//import { request } from 'http';
import { createReadStream } from 'fs';
 
const readStream = createReadStream('./test-ontology');
 
const form = new FormData();
form.append('', readStream);

console.log(form.getHeaders());