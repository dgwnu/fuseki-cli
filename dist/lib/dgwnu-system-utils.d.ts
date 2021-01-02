/**
 * Generic DGWNU Paackte TypeScript Tripple Store Utilities
 */
/// <reference types="node" />
/**
 * NPM Package Imports
 */
/**
 * Execute Shell Command in Operating System Shell
 * @param command Shell Command to exec in de Operating System Shell
 * @returns Shell Command result output
 */
export declare function execOsShellCommand(osShellcommand: string): string;
/**
 * System Configuration Information
 */
export declare function systemConfigInfo(): {
    osType: string;
    osRelease: string;
    osPlatform: NodeJS.Platform;
};
