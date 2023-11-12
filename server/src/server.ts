require("dotenv").config();

import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import app from "./app";

const PORT = process.env.EXPRESS_PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
