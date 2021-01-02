"use strict";
/**
 * Generic DGWNU Paackte TypeScript Tripple Store Utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemConfigInfo = exports.execOsShellCommand = void 0;
/**
 * Node System Imports
 */
var child_process_1 = require("child_process");
var os_1 = require("os");
/**
 * NPM Package Imports
 */
/**
 * Execute Shell Command in Operating System Shell
 * @param command Shell Command to exec in de Operating System Shell
 * @returns Shell Command result output
 */
function execOsShellCommand(osShellcommand) {
    return child_process_1.execSync(osShellcommand).toString();
}
exports.execOsShellCommand = execOsShellCommand;
/**
 * System Configuration Information
 */
function systemConfigInfo() {
    return { osType: os_1.type(), osRelease: os_1.release(), osPlatform: os_1.platform() };
}
exports.systemConfigInfo = systemConfigInfo;
