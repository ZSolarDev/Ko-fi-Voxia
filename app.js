const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const VER_TOKEN = process.env.VER_TOKEN;
var kofiAccounts = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json(kofiAccounts);
});

app.post("/", (req, res) => {
    const rawBody = req.body.data;
    try {
        const body = JSON.parse(rawBody);
        if (body.verification_token == VER_TOKEN && body.type == "Donation") {
            let account = [body.from_name, body.email];
            if (!kofiAccounts.includes(account)) {
                kofiAccounts.push(account);
                console.log(kofiAccounts);
            }
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Failed to parse JSON data string");
    }
    res.status(200).send("OK");
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
