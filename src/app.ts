import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

dotenv.config({ path: "./config.env" });

// Apply Helmet middleware for security
app.use(helmet());

// Rate limiting middleware to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

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
