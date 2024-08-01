# `minitel-cloudflare-worker`

> [!NOTE]
> This is meant specifically for users of the `minitel-` ecosystem by me
> (immjs), and specifically for use with cloudflare workers
>
> It can also be used by whomever needs to hook up MiniPAVI with a websocket
> based minitel server.

Opens up an HTTP(s) server for access through minipavi

> [!NOTE]
> Unlike `minitel-minipavi`, the first argument to `minitelFactory` is already
> a duplex stream which means you _need_ to [enable nodejs compat](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#enable-nodejs-with-workers)
> You may access the request using the second argument, for instance to access
> the PAVI argument if you set `providePAVI: true`

## Example

```tsx
import { Minitel, TextNode } from 'minitel-standalone';
import { createMinipaviHandler } from 'minitel-cloudflare-worker';

export default createMinipaviHandler(
  (stream) => {
    const minitel = new Minitel(stream, {});
    minitel.appendChild(new TextNode('Hello world!', {}, minitel));

    minitel.renderToStream();

    setTimeout(() => stream.end(), 10_000);
  },
).then(() => console.log('MiniPavi handler ready!'));
```

## Reference

### `createMinipaviHandler` Function

#### Returns

A Promise that will resolve when the MiniPAVI handler will be up and running

### Parameters

| Parameter        | Type                      | Description                                         |
| ---------------- | ------------------------- | --------------------------------------------------- |
| `minitelFactory` | `(stream: Duplex) => any` | A factory function to handle WebSocket connections. |
| `options`        | `MinipaviHandlerOptions`  | Configuration options for the handler.              |

### MinipaviHandlerOptions

| Option             | Type                                       | Description                                                                                                                                                                        |
| ------------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`          | `string`                                   | Optional. Specifies the version that will be given to MiniPAVI. Defaults to `'1.0'`.                                                                                               |
| `providePavi`      | `boolean`                                  | Optional. If true, provides the PAVI field as query parameters. Defaults to `false`.                                                                                               |
| `provideDirectUrl` | `boolean`                                  | Optional. If true, provides the DIRECTURL field as query parameters. Defaults to `false`.                                                                                          |
