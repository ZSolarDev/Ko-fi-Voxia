var rcon = require('rcon/node-rcon.js');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT;
const RCON_IP = '192.99.103.218';
const RCON_PORT = 8130;
const RCON_PASSWORD = '819VDe1x3l201';

var rconAuthenticated = false;

var conn = new rcon(RCON_IP, RCON_PORT, RCON_PASSWORD);
console.log("loading...");
conn.on('auth', function() {
        console.log("RCON Authenticated!!");
        rconAuthenticated = true;
    }).on('response', function(str) {
        console.log("Response: " + str);
    }).on('error', function(err) {
        console.log("Error: " + err);
    }).on('end', function() {
        console.log("Connection closed");
        process.exit();
    }
);
conn.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("womp womp. Why is bro here? 💀");
});

app.post("/", (req, res) => {
    const rawBody = req.body.data;

    if (rconAuthenticated)
    {
        try {
            const parsedData = JSON.parse(rawBody);
            conn.send('say Ko-fi dotation!!! message: ' + parsedData.message);
        } catch (e) {
            console.error(e);
            res.status(500).send("Failed to parse JSON data string");
        }
    }else{
        res.status(500).send("RCON not authenticated");
    }

    // Send a response back to Ko-fi
    res.status(200).send("OK");
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});