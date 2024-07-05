import express, { Request, Response } from "express";

const app = express();

app.use("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "hello world",
  });
});

app.listen(3000, () => console.log("server is running"));
