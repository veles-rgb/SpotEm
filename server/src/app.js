import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 3001;

const allowed = [
    /^https:\/\/spotem\.up\.railway\.app$/,
    /^http:\/\/localhost:5173$/,
];

app.use(
    cors({
        origin: (origin, cb) => {
            if (!origin) return cb(null, true);
            const ok = allowed.some((rule) =>
                rule instanceof RegExp ? rule.test(origin) : rule === origin
            );
            cb(ok ? null : new Error("Not allowed by CORS"), ok);
        },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => res.status(200).json({ ok: true }));
app.use("/api", routes);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});