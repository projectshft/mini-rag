"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiClient = void 0;
var openai_1 = require("openai");
exports.openaiClient = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
