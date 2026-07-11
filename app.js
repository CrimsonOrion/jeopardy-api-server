require('dotenv').config({ quiet: true });

const express = require('express');
const app = express();
const fs = require('fs');
const PORT = process.env.PORT || 3001;
app.use(express.json());

// Set the listen port
app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on port: `, PORT);
});

app.get("/status", (req, res) => {
    const status = {
        "Status": "Running"
    };

    res.send(status);
});

app.get("/game-content/seasons", (req, res) => {
    var fileData = fs.readFileSync("./game-content/seasons.json");
    var jsonData = JSON.parse(fileData);
    res.json(jsonData);
});

app.get(`/game-content/seasons/:id`, (req, res) => {
    var seasonId = req.params["id"];
    var fileData = fs.readFileSync("./game-content/" + seasonId + "/overview.json");
    var jsonData = JSON.parse(fileData);
    res.json(jsonData);
});

app.get(`/game-content/games/:id`, (req, res) => {
    var seasonGameId = req.params["id"].replace("---", "/");
    var fileData = fs.readFileSync("./game-content/" + seasonGameId + "/game.json");
    var jsonData = JSON.parse(fileData);
    res.json(jsonData);
});