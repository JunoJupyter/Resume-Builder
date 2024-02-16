import express from "express";
import router from "./routes.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
let port = process.env.PORT;

// Middleware to parse request body as JSON
app.use(express.json());

// Mount the router on a specific path
app.use("/api", router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`,);
});
