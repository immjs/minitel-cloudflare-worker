import { Minitel, TextNode } from 'minitel-standalone';
import { createMinipaviHandler } from '../index.js';

export default createMinipaviHandler(
  (stream) => {
    const minitel = new Minitel(stream, {});
    minitel.appendChild(new TextNode('Hello world!', {}, minitel));

    minitel.renderToStream();

    setTimeout(() => stream.end(), 10_000);
  },
);
