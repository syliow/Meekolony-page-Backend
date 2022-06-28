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
const js_1 = require("@metaplex-foundation/js");
const web3_js_1 = require("@solana/web3.js");
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("mainnet-beta"));
const metaplex = new js_1.Metaplex(connection);
const cors = require("cors");
const app = (0, express_1.default)();
const port = 5000;
app.use(cors());
app.get("/nft/listings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startIndex } = req.query;
        const { data } = yield axios_1.default.get(`https://api-mainnet.magiceden.dev/v2/collections/meekolony/listings?offset=${startIndex}&limit=20`);
        res.send(data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log("error message: ", error.message);
            return error.message;
        }
    }
}));
app.get("/nft/sales", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get("https://api-mainnet.magiceden.dev//v2/collections/meekolony/activities?offset=0&limit=350");
        const filtered = data.filter((obj) => {
            return obj.type === "buyNow";
        });
        res.send(filtered);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log("error message: ", error.message);
            return error.message;
        }
    }
}));
app.get("/nft/getData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mintAddress = req.query.mintAddress;
        const mint = new web3_js_1.PublicKey(mintAddress);
        const nft = yield metaplex.nfts().findByMint(mint);
        res.send(nft);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log("error message: ", error.message);
            return error.message;
        }
    }
}));
app.get("/nft/checkAddress", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAddress = req.query.userAddress;
        const owner = new web3_js_1.PublicKey(userAddress);
        const myNfts = yield metaplex.nfts().findAllByOwner(owner);
        const filteredResult = myNfts.filter((obj) => {
            return obj.symbol === "MKLN";
        });
        if (filteredResult) {
            res.send(filteredResult);
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log("error message: ", error.message);
            return error.message;
        }
    }
}));
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
    }
}));
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
