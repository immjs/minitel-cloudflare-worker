"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minitel_standalone_1 = require("minitel-standalone");
const __1 = require("..");
exports.default = (0, __1.createMinipaviHandler)((stream) => {
    const minitel = new minitel_standalone_1.Minitel(stream, {});
    minitel.appendChild(new minitel_standalone_1.TextNode('Hello world!', {}, minitel));
    minitel.renderToStream();
    setTimeout(() => stream.end(), 10_000);
}).then(() => console.log('MiniPavi handler ready!'));
