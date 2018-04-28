#!/usr/bin/env node
const jwtAuthz = require('express-jwt-authz');
const bodyParser = require('body-parser');
const jwksRsa = require('jwks-rsa');
const jwt = require('express-jwt');
const express = require('express');
const wol = require('node-wol');
const http = require('http');
const cors = require('cors');
const fs = require('fs');

const port = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'
const socket = process.env.SOCKET || null
const broadcast = process.env.BROADCAST || null
const password = process.env.PASSWORD || null

const app = new express();
const httpServer = http.createServer(app);

app.set('socket', socket);
app.set('port', port);
app.set('host', host);

app.use(cors());

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://ar2ro.auth0.com/.well-known/jwks.json`
  }),

  issuer: `https://ar2ro.auth0.com/`,
  algorithms: ['RS256']
});

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

app.post('/post', checkToken, checkJwt, isAdmin, (req, res, next) => {
  let options = {};
  options.address = broadcast;
  let mac = parseMac(req.body.mac);
  wol.wake(mac, options, (error) => {
    if (error) {
      let result = { status: 'is-danger', text: 'Internal server error a trained team of niggers is working on it' }
      console.log(result)
      res.status(401).json(result)
    } else {
      let result = { status: 'is-success', text: 'Your wake on lan request has been sent!' }
      console.log(result)
      res.json(result)
    }
  })
})

function checkToken (req, res, next) {
  if (req.headers && req.headers.authorization) {
    next()
  } else {
    res.status(401).send('Invalid token')
  }
}

function isAdmin (req, res, next) {
  const roles = req.user['https://api.arturonet.com/roles']
  if (roles.indexOf('admin') > -1) {
    next()
  } else {
    res.status(401).send('401: Forbidden, user is not an admin')
  }
}

function parseMac(mac) {
    return mac.replace(/-/g, ":")
}

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
