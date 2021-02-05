# Fuseki CLI [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Fuseki is a populair SPARQL / Triplestore implementation in Java that is simple and robust to use. See [Jena Apache Jena Fuseki documentation](https://jena.apache.org/documentation/fuseki2/index.html) for more info. The Fuseki CLI is a build as a __TypeScript__ based _wrapper_ to use and support the services that are provided from the Open Source version.
  
## Jena Fuseki Server Dependencies

This pre-release only supports a local Jena Fuseki Service as a peer depedency for this package. See for info how to install and use: [@dgwnu/fuseki-service](https://github.com/dgwnu/fuseki-service).  
_Other server installations could work but are not tested (or in scope). Hint: Any localhost installation should work like HomeBrew but there might be some authorization issues to resolve in "shiro.ini"_

## NPM installation

````
npm install https://github.com/dgwnu/fuseki-cli.git --save
````

## CLI-commands

At this moment there is only some prelimannary support to configure and use Fuseki-services Api.

### Services

````
npx fuseki-cli < ping | server >
````

| Command | Function |
|---------|:------------|
| ping | Fuseki Server is Up or Down status check |
| server | Fuseki Server Configuration |

### Datasets
````
npx fuseki-cli datasets <parameters>
````
| Parameters | Function |
|:------------|:------------|
| (<_datasetName_>) | Gets configuration of all datasets (or one specified by <_datasetName_>) |
| _-a_ (or _-add_) <_assemblerFilePath_> | Add dataset with <_assemblerFilePath_> configuration |
| _-r_ (or _-remove_) <_datasetName_> | Remove dataset specified by <_datasetName_>

### GraphStore Data Management
````
npx fuseki-cli < put | post > <datasetName> <uploadFilePath>
````
Parameters must always be specified:  
- <__datasetName__> the dataset to update
- <__uploadFilePath__> the location of data file to upload   

| Command | Function |
|---------|:------------|
| put | Replace all with new data |
| post | Update (non-blank) nodes with new data (and add non-exsiting) |
_Other commands with other Service functionality will be added soon (in 2021 ;-))._

## CLI-library

This package provides a __TypeScript__ based library to reuse and /or extend the CLI-functionality.  
  
Import library in your TypeScript-application and use it to make extended functionality:
````
import { ping } from '@dgwnu/fuseki-cli';

// Use Fuseki Server Ping Service
ping.subscribe(
    up => console.log(up),
    down => console.log(down)
);

````
