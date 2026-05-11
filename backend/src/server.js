import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes); 

app.get("/", (req, res) => {
  res.json({ message: "Server running", status: "ok" });
});



export default app;
