const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/data", express.static(path.join(__dirname, "data")));
app.use("/assets", express.static(path.join(__dirname, "assets"))); // 🔥 LOGA


// Hlavní stránka
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Formulář
app.post("/api/contact", (req, res) => {
    console.log("Přijatý formulář:", req.body);

    res.json({
        success: true,
        message: "Zpráva byla úspěšně přijata"
    });
});


// Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});
