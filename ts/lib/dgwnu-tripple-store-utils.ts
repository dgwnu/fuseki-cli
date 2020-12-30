/**
 * Generic DGWNU Paackte TypeScript Tripple Store Utilities
 */

/**
 * Node System Imports
 */
import { execSync } from 'child_process';
import { type, release, platform } from 'os';

/**
 * NPM Package Imports
 */

/**
 * Execute Shell Command in Operating System Shell
 * @param command Shell Command to exec in de Operating System Shell
 * @returns Shell Command result output
 */
export function execOsShellCommand(osShellcommand: string) {
    return execSync(osShellcommand).toString();
}

/**
 * System Configuration Information
 */
export function systemConfigInfo() {
    return { osType: type(), osRelease: release(), osPlatform: platform() };
}