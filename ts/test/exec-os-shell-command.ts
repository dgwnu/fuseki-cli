/**
 * Test Exec OS Command Function
 */

import { argv } from 'process';
import { execOsShellCommand } from '../lib/dgwnu-tripple-store-utils';
import { type, release, platform } from 'os';

console.log({ osType: type(), osRelease: release(), osPlatform: platform() });

if (argv[2]) {
    const osShellCommand = argv[2];
    console.log(`osShellCommand = ${osShellCommand}`);
    const output = execOsShellCommand(osShellCommand);
    console.log(`Command Output ${output}`);
} else {
    console.log('Missing param for osShellCommand!');
}