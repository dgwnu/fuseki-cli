/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { ClientRequest, ClientRequestArgs } from 'http';
import { Observable } from 'rxjs';

/**
 * Local Library Imports
 */
import { execOsShellCommand, systemConfigInfo } from './dgwnu-system-utils';

/**
 * Local BREW INSTALL FUSEKI SERVER - Fuseki Server Protocal Paths 
 * @ see: <https://jena.apache.org/documentation/fuseki2/fuseki-server-protocol.html>
 */
const fusekiClientArgs: ClientRequestArgs = {
    host: 'localhost',
    port: 3030,
    path: '/$/'
};

/**
 * Run Fuseki-server as a service (will nor restart after reboot)
 * @returns Run Fuseki Service execution results
 */
export function fusekiServices(command: 'run' | 'start' | 'restart' | 'stop') {
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


export function fusekiPing() {
    let pingArgs = fusekiClientArgs;
    pingArgs.path += 'ping';
    pingArgs.method = 'POST';
    
}