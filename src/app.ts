import express, { Application, Request, Response } from "express";
import axios from "axios";
import { Metaplex } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const metaplex = new Metaplex(connection);
const tokenPublicKey = "EAopTg4TPxLADNmNtzNoXyp9Z1Vo3xGYnwynrir19Sjc";

const cors = require("cors");

const app: Application = express();
const port: number = 5000;
app.use(cors());

type User = {
  symbol: string;
  floorPrice: number;
  listedCount: string;
  avgPrice24hr: number;
  volumeAll: number;
};

type GetUsersResponse = {
  data: User[];
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
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
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
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
});

app.get("/nft/getData", async (req: Request, res: Response) => {
  try {
    // const publicKey = "EAopTg4TPxLADNmNtzNoXyp9Z1Vo3xGYnwynrir19Sjc";
    // const nftmetadata = await metaplex.nfts().findAllByOwner(metaplex.identity().publicKey);

    const mintAddress = req.query.mintAddress as string;
    const mint = new PublicKey(mintAddress);
    const nft = await metaplex.nfts().findByMint(mint);

    console.log(mint,' mintt')
    console.log(nft,' nft')

    res.send(nft)


  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Helloooo 123");
});

app.get("/nft", async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get<GetUsersResponse>(
      "https://api-mainnet.magiceden.dev/v2/collections/meekolony/stats"
    );
    res.send(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
});

app.get("/hello", async (req: Request, res: Response) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
