import { Duplex, DuplexOptions } from 'node:stream';
interface MinipaviHandlerOptions {
    version?: string;
    providePavi?: boolean;
    provideUrlParams?: boolean;
}
export declare class DuplexBridge extends Duplex {
    ws: WebSocket;
    constructor(ws: WebSocket, opts?: DuplexOptions);
    end(cb?: () => void): this;
    _write(chunk: any, bufferEncoding: BufferEncoding, callback: (err: Error | null | undefined) => void): void;
    _read(size?: number): void;
}
export declare function createMinipaviHandler(minitelFactory: (ws: Duplex, req: Request) => any, options?: MinipaviHandlerOptions): {
    fetch(request: Request, _: {}, ctx: ExecutionContext): Promise<Response | undefined>;
};
export {};
