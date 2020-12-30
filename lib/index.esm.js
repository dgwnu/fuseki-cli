import { execSync } from 'child_process';
import { type, release, platform } from 'os';

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
 * Run Fuseki-server as a service (will nor restart after reboot)
 * @returns Run Fuseki Service execution results
 */
function fusekiServices(command) {
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

export { execOsShellCommand, fusekiServices, systemConfigInfo };
