"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMinipaviHandler = createMinipaviHandler;
const zod_1 = require("zod");
const node_stream_1 = require("node:stream");
const paviSchema = zod_1.z.object({
    PAVI: zod_1.z.object({
        version: zod_1.z.string().regex(/^(\d+\.)*\d+$/g),
        uniqueId: zod_1.z.string().regex(/^\d+$/g),
        remoteAddr: zod_1.z.string(),
        typesocket: zod_1.z.enum(['websocketssl', 'websocket', 'other']),
        versionminitel: zod_1.z.string().regex(/^\x01.{3}\x04$/g),
        content: zod_1.z.array(zod_1.z.string()),
        context: zod_1.z.any(),
        fctn: zod_1.z.enum([
            'ENVOI',
            'SUITE',
            'RETOUR',
            'ANNULATION',
            'CORRECTION',
            'GUIDE',
            'REPETITION',
            'SOMMAIRE',
            'CNX',
            'FIN',
            'DIRECT',
            'DIRECTCNX',
            'DIRECTCALLFAILED',
            'DIRECTCALLENDED',
            'BGCALL',
            'BGCALL-SIMU',
        ]),
    }),
    URLPARAMS: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
});
async function createMinipaviHandler(minitelFactory, options = {}) {
    const fullOptions = {
        version: '1.0',
        providePavi: false,
        provideDirectUrl: false,
        ...options,
    };
    return {
        async fetch(request) {
            const reqUrl = new URL(request.url);
            const upgradeHeader = request.headers.get('Upgrade');
            if (reqUrl.pathname === '/websocket') {
                if (!upgradeHeader || upgradeHeader !== 'websocket') {
                    return new Response('Upgrade required', { status: 426 });
                }
                const webSocketPair = new WebSocketPair();
                const client = webSocketPair[0];
                const server = webSocketPair[1];
                (async () => {
                    server.accept();
                    const stream = new node_stream_1.Duplex();
                    server.addEventListener('message', (event) => stream.write(event.data));
                    stream.on('data', (data) => server.send(data));
                    server.addEventListener('close', () => stream.end());
                    stream.on('close', () => server.close());
                    server.addEventListener('open', () => minitelFactory(stream, request));
                })();
                return new Response(null, {
                    status: 101,
                    webSocket: client,
                });
            }
            if (request.method !== 'POST') {
                return new Response('Method not allowed', { status: 405 });
            }
            const { success, data, error } = paviSchema.safeParse(await request.json());
            if (!success) {
                return new Response(`Malformed request: ${JSON.stringify(error)}`, {
                    status: 400,
                });
            }
            if (reqUrl.pathname === '/') {
                const newParams = new URLSearchParams();
                if (fullOptions.providePavi)
                    newParams.append('pavi', JSON.stringify(data.PAVI));
                if (fullOptions.provideDirectUrl && 'DIRECTURL' in data)
                    newParams.append('directUrl', JSON.stringify(data.DIRECTURL));
                return new Response(JSON.stringify({
                    version: fullOptions.version,
                    content: '',
                    context: '',
                    echo: 'off',
                    next: `https://${reqUrl.hostname}/disconnect`,
                    directcall: 'no',
                    COMMAND: {
                        name: 'connectToWs',
                        param: {
                            key: 'Same host <https://npmjs.com/packages/minitel-minipavi>',
                            host: reqUrl.hostname,
                            path: `/websocket${newParams.toString()}`,
                            echo: 'off',
                            case: 'lower',
                            proto: 'wss',
                        },
                    },
                }), { headers: { 'Content-Type': 'application/json' } });
            }
            else if (reqUrl.pathname === '/disconnect') {
                return new Response(JSON.stringify({
                    version: fullOptions.version,
                    content: '',
                    context: '',
                    echo: 'off',
                    next: `https://${reqUrl.hostname}/disconnect`,
                    directcall: 'no',
                    COMMAND: {
                        name: 'libCnx',
                    },
                }), { headers: { 'Content-Type': 'application/json' } });
            }
        },
    };
}
