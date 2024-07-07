"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: "./config.env" });
// Apply Helmet middleware for security
app.use((0, helmet_1.default)());
// Rate limiting middleware to prevent brute-force attacks
const limiter = (0, express_rate_limit_1.default)({
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
app.use((0, cors_1.default)());
// Middleware
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.json());
// Handle preflight requests
// app.options("*", cors(corsOptions));
app.use(index_1.default);
exports.default = app;
