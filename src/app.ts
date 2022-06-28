import express, { Application, Request, Response } from "express";
import axios from "axios";
import { Metaplex } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const metaplex = new Metaplex(connection);
const cors = require("cors");
const app: Application = express();
const port: number = 5000;
app.use(cors());

type NFT = {
  symbol: string;
  floorPrice: number;
  listedCount: number;
  avgPrice24hr: number;
  volumeAll: number;
};

type GetNftData = {
  data: NFT[];
};

app.get("/nft/listings", async (req: Request, res: Response) => {
  try {
    const { startIndex } = req.query;
    const { data } = await axios.get(
      `https://api-mainnet.magiceden.dev/v2/collections/meekolony/listings?offset=${startIndex}&limit=20`
    );
    res.send(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    }
  }
});

app.get("/nft/sales", async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get(
      "https://api-mainnet.magiceden.dev//v2/collections/meekolony/activities?offset=0&limit=350"
    );
    const filtered = data.filter((obj: { type: string }) => {
      return obj.type === "buyNow";
    });
    res.send(filtered);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    }
  }
});

app.get("/nft/getData", async (req: Request, res: Response) => {
  try {
    const mintAddress = req.query.mintAddress as string;
    const mint = new PublicKey(mintAddress);
    const nft = await metaplex.nfts().findByMint(mint);

    res.send(nft);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    }
  }
});

app.get("/nft/checkAddress", async (req: Request, res: Response) => {
  try {
    const userAddress = req.query.userAddress as string;
    const owner = new PublicKey(userAddress);
    const myNfts = await metaplex.nfts().findAllByOwner(owner);

    const filteredResult = myNfts.filter((obj: { symbol: string }) => {
      return obj.symbol === "MKLN";
    });

    if (filteredResult) {
      res.send(filteredResult);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    }
  }
});

app.get("/nft", async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get<GetNftData>(
      "https://api-mainnet.magiceden.dev/v2/collections/meekolony/stats"
    );
    res.send(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    }
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
