require('dotenv').config({ quiet: true });

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use('/game-content', express.static(path.join(__dirname, 'game-content')));

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

    var baseUrl = req.protocol + '://' + req.get('host') + '/game-content/' + seasonGameId + '/';
    var mediaKeys = ['media', 'audio', 'video'];

    function resolveUrl(value) {
        if (typeof value === 'string' && !/^https?:\/\//i.test(value)) {
            return baseUrl + value.replace(/^\.\//, '');
        }
        return value;
    }

    Object.keys(jsonData).forEach(function (key) {
        var clue = jsonData[key];
        if (clue && typeof clue === 'object') {
            mediaKeys.forEach(function (mediaKey) {
                if (mediaKey in clue) {
                    clue[mediaKey] = Array.isArray(clue[mediaKey])
                        ? clue[mediaKey].map(resolveUrl)
                        : resolveUrl(clue[mediaKey]);
                }
            });
        }
    });

    res.json(jsonData);
});