import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

const app = express();

dotenv.config({ path: "./config.env" });

// Configure CORS
// const allowedOrigins = [
//   "http://localhost:5174",
//   "https://r28.ng",
//   "https://r28.e37digital.com/",
//   "http://r28.e37digital.com/",
// ];

// const corsOptions: cors.CorsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));

app.use(cors());

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// Handle preflight requests
// app.options("*", cors(corsOptions));

export default app;
