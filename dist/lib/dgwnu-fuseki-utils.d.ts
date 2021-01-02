/**
 * DGWNU Utils to use Fuseki Services
 */
/**
 * Run Fuseki-server as a service (will nor restart after reboot)
 * @returns Run Fuseki Service execution results
 */
export declare function fusekiServices(command: 'run' | 'start' | 'restart' | 'stop'): string | undefined;
