import { Duplex } from 'node:stream';
interface MinipaviHandlerOptions {
    version?: string;
    providePavi?: boolean;
    provideDirectUrl?: boolean;
}
export declare function createMinipaviHandler(minitelFactory: (ws: Duplex, req: Request) => any, options?: MinipaviHandlerOptions): {
    fetch(request: Request): Promise<Response | undefined>;
};
export {};
