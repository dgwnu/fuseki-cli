# Fuseki CLI

Fuseki is a populair SPARQL / Triplestore implementation in Java that is simple and robust to use. See [Jena Apache Jena Fuseki documentation](https://jena.apache.org/documentation/fuseki2/index.html) for more info.  
  
This pre-release only supports __Homebrew__ based __Fuseki Sever__ installations on the __Mac-platform__ (darwin). Mac Fuseki Server installation and configuration is based on HomeBrew.  
[See install Fuseki on a Mac with Brew](https://brewinstall.org/install-fuseki-on-mac-with-brew/).

## NPM installation

````
npm install https://github.com/dgwnu/fuseki-cli.git --save
````

## CLI-commands

At this moment there is only some prelimannary support to provide and configure Fuseki-services.

### Services

````
npx fuseki-cli run | start | restart | stop | ping | server
````

| Command | Function |
|---------|:------------|
| run | Run a Fuseki Server Service (will not restart after reboot). |
| start | Start a Fuseki Server Service (will restart after reboot) |
| restart | Restart a Fuseki Server Service |
| stop | Stop a Fuseki Server Service |
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

### GraphStore Data Upload
````
npx fuseki-cli put | post <datasetName> <uploadFilePath>
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
import { services } from '@dgwnu/fuseki-cli';

// run Fuseki Server
const output = services('run');
console.log(`Fuseki services start output ${output}`);

````