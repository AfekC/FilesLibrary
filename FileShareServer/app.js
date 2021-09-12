import conf from './conf/conf.json'
import getLocalIP from './helpers'

import express from 'express';
import bodyParser from 'body-parser';
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs')

import dao from './repositories/dao';
import { authMiddleware } from './controllers/user.controller';
import userRoutes from './routes/user.route';
import itemRoutes from './routes/item.route';

const folderName = conf.baseLibraryPath;

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

console.log('local ip:');
console.log(getLocalIP());

const port = process.env.PORT || conf.api.port || 4000;
export const app = express();

// Setting up port with express js
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../fileslibrary/dist')));
app.use(authMiddleware);
app.use(cookieParser());
app.use(session({ secret: "super secret string" }));

//  Script to setup sqlite DB in memory //
dao.setupDbForDev();

app.use('/user', userRoutes);
app.use('/item', itemRoutes);

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../fileslibrary/build/index.html'));
});

// Error handler
app.use(function(err, req, res, next) {
    console.error(err.message); // Log error message in our server's console
    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
    res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});
app.listen(port, () => {
    console.log('port: ' + port);
})
