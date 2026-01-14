const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Statické složky
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/data", express.static(path.join(__dirname, "json"))); // JSON je v /json
app.use("/assets", express.static(path.join(__dirname, "assets"))); // loga

// Pro zpracování POST formulářů
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Hlavní stránka
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST endpoint pro formulář
app.post("/submit-form", (req, res) => {
    console.log("Přijatá data z formuláře:", req.body);
    res.json({ message: "Formulář úspěšně odeslán!", data: req.body });
});

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});
