"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mempool_1 = require("../src/Mempool");
test("Mempool size in mb", () => __awaiter(void 0, void 0, void 0, function* () {
    let maxMemPoolMb = yield (0, Mempool_1.getMaxMemPoolSizeMb)();
    console.log(`Max mempool: ${maxMemPoolMb}mb`);
    expect(maxMemPoolMb).toBe(300);
}));
