import { TextDecoder, TextEncoder } from "node:util";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

globalThis.TextDecoder ??= TextDecoder;
globalThis.TextEncoder ??= TextEncoder;

afterEach(cleanup);
beforeEach(() => localStorage.clear());
