/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { ClientRequest } from 'http';
import { Observable } from 'rxjs';

/**
 * Local Library Imports
 */
import { execOsShellCommand, systemConfigInfo } from './dgwnu-system-utils';

/**
 * Global Constants
 */
const serverApiPath = '/$/';

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


export function serverStatus(serverUrl: string = 'http://localhost:3030') {
    return new Observable<void>(observer => {
        const serverPingUrlPath = serverUrl + serverApiPath + 'ping';

        const req = new ClientRequest(serverPingUrlPath, response => {

            req.on('error', error => {
                observer.error();
            });
            
            req.on('end', () => {
                observer.next();
                observer.complete();
            });

        });

        req.method = 'GET';
        req.end();
    });
}
