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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
var cors = require("cors");
const app = (0, express_1.default)();
const port = 5000;
app.use(cors());
app.get("/nft/listings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get("https://api-mainnet.magiceden.dev/v2/collections/meekolony/listings?offset=0&limit=20");
        res.send(data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log("error message: ", error.message);
            return error.message;
        }
        else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
        }
    }
}));
app.get("/nft/sales", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get("https://api-mainnet.magiceden.dev//v2/collections/meekolony/activities?offset=0&limit=100");
        res.send(data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log("error message: ", error.message);
            return error.message;
        }
        else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
        }
    }
}));
// getUsers();
// getListings();
// getSales();
app.get("/", (req, res) => {
    res.send("Helloooo 123");
});
app.get("/nft", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get("https://api-mainnet.magiceden.dev/v2/collections/meekolony/stats");
        res.send(data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log("error message: ", error.message);
            return error.message;
        }
        else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
        }
    }
}));
app.get("/hello", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("hello");
}));
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
