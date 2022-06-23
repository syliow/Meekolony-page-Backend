import express, { Application, Request, Response } from "express";
import axios from "axios";
var cors = require("cors");

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
      "https://api-mainnet.magiceden.dev//v2/collections/meekolony/activities?offset=0&limit=100"
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

// getUsers();
// getListings();
// getSales();

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
