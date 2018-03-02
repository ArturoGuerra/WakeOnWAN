const express = require('express');
const bodyParser = require('body-parser');
const wol = require('node-wol');
const app = new express();
const path = require('path');
const config = require('./config.json');
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());


function parseMac(mac) {
    return mac.replace(/-/g, ":");
}

app.post('/post', (req, res, next) => {
    console.log(req.body.password);
    if (req.body.password !== config.password) {
        res.status(403).send("Sorry invalid password");
        return;
    }
    let options = {};
    options.address = config.broadcast;
    let mac = parseMac(req.body.mac);
    console.log(mac);
    wol.wake(mac, options, (error) => {
        if (error) {
            res.status(500).send("Internal server error a trained team of niggers is working on it")
        } else {
            res.status(200).send("Your wake on lan request has been sent!")
        }
    });
});

app.listen(8808, () => {console.log("Running on port 8808")});


