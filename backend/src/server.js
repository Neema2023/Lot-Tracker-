const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const lotRoutes = require("./routes/lot.routes");
const authRoutes = require("./routes/auth.routes");

db.query("SELECT 1")
    .then(() => console.log("MySQL connected successfully"))
    .catch((err) => console.error("MySQL connection failed:", err));

const app = express();

const PORT = process.env.PORT || 5000;

// =========================
// CORS
// =========================

app.use(cors({
    origin: "http://localhost:5173"
}));

// =========================
// JSON
// =========================

app.use(express.json());

// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    next(err);
});

// =========================
// ROUTES
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/lots", lotRoutes);

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
    res.json({
        message: "Lot Tracker API is running",
    });
});

// =========================
// GENERAL ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        message: "Internal server error"
    });
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});