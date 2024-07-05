import mongoose from "mongoose";

import app from "./app";
const port = process.env.PORT || 4000;

if (process.env.DATABASE && process.env.DATABASE_PASSWORD) {
  const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
  );
  // Now you can use DB safely
  mongoose.set("strictQuery", false);

  mongoose.connect(DB).then((con) => {
    console.log("DB connection succesful");
  });
} else {
  console.error(
    "DATABASE or DATABASE_PASSWORD environment variable is not defined"
  );
  // Handle the situation where environment variables are not defined
}

app.listen(port, () => console.log(`Server running on ${port}`));
