import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});