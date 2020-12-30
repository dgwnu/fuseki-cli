"use strict";
/**
 * DGWNU Utils to use Fuseki Services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fusekiServices = void 0;
var dgwnu_system_utils_1 = require("./dgwnu-system-utils");
/**
 * Run Fuseki-server as a service (will nor restart after reboot)
 * @returns Run Fuseki Service execution results
 */
function fusekiServices(command) {
    var osPlatform = dgwnu_system_utils_1.systemConfigInfo().osPlatform;
    var runResult = undefined;
    switch (osPlatform) {
        case 'darwin': {
            // Mac OS(X) platform
            var osShellCommand = "brew services " + command + " fuseki";
            console.log(osShellCommand);
            runResult = dgwnu_system_utils_1.execOsShellCommand(osShellCommand);
            break;
        }
        default: {
            console.log("OS Platform " + osPlatform + " not (yet) supported!");
            break;
        }
    }
    return runResult;
}
exports.fusekiServices = fusekiServices;
