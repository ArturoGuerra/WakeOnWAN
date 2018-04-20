const bodyParser = require('body-parser');
const express = require('express');
const wol = require('node-wol');
const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'
const socket = process.env.SOCKET || null
const broadcast = process.env.BROADCAST || null
const password = process.env.PASSWORD || null

const app = new express();
const httpServer = http.createServer(app);

app.set('socket', socket);
app.set('port', port);
app.set('host', host);

//app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
//app.use(bodyParser.text());


function parseMac(mac) {
    return mac.replace(/-/g, ":")
}

app.post('/post', (req, res, next) => {
    console.log('Password: ' + req.body.password);
    if (req.body.password !== password) {
        res.status(403).send('Sorry invalid password');
        return;
    }
    let options = {};
    options.address = broadcast;
    let mac = parseMac(req.body.mac);
    console.log(mac);
    wol.wake(mac, options, (error) => {
        if (error) {
            res.status(500).send('Internal server error a trained team of niggers is working on it')
        } else {
            res.send('Your wake on lan request has been sent!')
        }
    })
})

function startServer () {
  if (socket) {
    if (fs.existsSync(socket)) {
      fs.unlinkSync(socket)
    }
    httpServer.listen(socket, () => { console.log('Server listening on ' + socket) })
    fs.chmodSync(socket, '0777')
  } else {
    httpServer.listen(port, host, () => {
      console.log('Server listening on ' + host + ':' + port)
    })
  }
}

startServer()
