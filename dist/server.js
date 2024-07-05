"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 4000;
if (process.env.DATABASE && process.env.DATABASE_PASSWORD) {
    const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);
    // Now you can use DB safely
    mongoose_1.default.set("strictQuery", false);
    mongoose_1.default.connect(DB).then((con) => {
        console.log("DB connection succesful");
    });
}
else {
    console.error("DATABASE or DATABASE_PASSWORD environment variable is not defined");
    // Handle the situation where environment variables are not defined
}
app_1.default.listen(port, () => console.log(`Server running on ${port}`));
