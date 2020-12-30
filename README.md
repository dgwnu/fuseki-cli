# Fuseki CLI

Fuseki is a populair SparQL / Tripple Store implementation in Java that is simple and robust to use. See [Jena Apache Jena Fuseki documentation](https://jena.apache.org/documentation/fuseki2/index.html) for more info.  
  
This pre-release only supports __Homebrew__ based __Fuseki Sever__ installations on the __Mac-platform__ (darwin).

## NPM installation

````
npm install https://github.com/dgwnu/fuseki-cli.git --save
````

## CLI-commands

At this moment there is only some prelimannary support to provide and configure Fuseki-services.

### Service-commands

````
npx fuseki-cli run | start | restart | stop
````

| Command | Function |
|---------|:------------|
| run | Run a Fuseki Server Service (will not restart after reboot). |
| start | Start a Fuseki Server Service (will restart after reboot) |
| restart | Restart a Fuseki Server Service |
| stop | Stop a Fuseki Server Service |

_Other commands with other Service functionality will be added soon (in 2021 ;-))._

## CLI-library

This package provides a __TypeScript__ based library to reuse and /or extend the CLI-functionality.  
  
Import library in your TypeScript-application and use it to make extended functionality:
````
import { fusekiServices } from '@dgwnu/fuseki-cli';

// run Fuseki Server
const output = fusekiServices('run');
console.log(`Fuseki services start output ${output}`);

````