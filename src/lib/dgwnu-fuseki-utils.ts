/**
 * DGWNU Utils to use Fuseki Services
 */

/**
 * Node Package Imports
 */
import { default as axios } from 'axios';
import { from } from 'rxjs';

/**
 * Local Library Imports
 */
import { execOsShellCommand, systemConfigInfo } from './dgwnu-system-utils';

/**
 * Fuseki Server Defaults
 */
axios.defaults.baseURL = 'http://localhost:3030';


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
    const observerable = from(axios.get('/$/ping'));

    observerable.subscribe(
        data => console.log('data: ', data),
        error => console.log(error),
        () => console.log('completed!');
    );
}