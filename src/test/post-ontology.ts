/**
 * File: post-ontology.ts
 * Fuseki Cli Test Script to develop FormData Upload to Fuseki Server
 */

import { resolve } from 'path';
import * as FormData from 'form-data';
import { request } from 'http';
import { createReadStream } from 'fs';

const uploadFilePath = resolve(__dirname, 'test-ontology.ttl');
console.log(uploadFilePath);
const readStream = createReadStream(uploadFilePath);
 
const form = new FormData();
form.append('', readStream);

console.log(form.getHeaders());

const req = request(
    {
      host: 'localhost',
      port: '3030',
      path: '/dgwnu/upload',
      method: 'POST',
      headers: form.getHeaders(),
    },
    response => {
      console.log(response.statusCode); // 200
    }
  );
   
form.pipe(req);