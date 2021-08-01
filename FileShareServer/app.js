import conf from './conf/conf.json'
import express from 'express';
import bodyParser from 'body-parser';
import dao from './repositories/dao';
import { authenticated, authMiddleware } from './controllers/user.controller';
import userRoutes from './routes/user.route';
import itemRoutes from './routes/item.route';
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs')

const folderName = conf.baseLibraryPath;

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName)
  }
} catch (err) {
  console.error(err)
}


const port = process.env.PORT || conf.api.port || 4000;
export const app = express();

// Create port
const server = app.listen(port, () => {
    console.log('Connected to port ' + port);
})


// Setting up port with express js
app.use(bodyParser.json());
app.use(authMiddleware);
app.use(cookieParser());
app.use(cors());

app.use(session({ secret: "super secret string" }));

//  Script to setup sqlite DB in memory //
dao.setupDbForDev();
////////////////////////////////////



app.use('/user', userRoutes);
app.use('/item', itemRoutes);


// Error handler
app.use(function(err, req, res, next) {
    console.error(err.message); // Log error message in our server's console
    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
    res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});
