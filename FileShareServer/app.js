import conf from './conf/conf.json'
import getLocalIP from './helpers'
import dao from './repositories/dao';
import { authMiddleware } from './controllers/user.controller';
import userRoutes from './routes/user.route';
import itemRoutes from './routes/item.route';
import express from 'express';
import bodyParser from 'body-parser';

require('./minio')
require("dotenv").config();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');


// create bucket in MinIO
(async () => {
    const { minioClient } = require('./minio');

    console.log(`Creating Bucket: ${process.env.MINIO_BUCKET_NAME}`);
    await minioClient.makeBucket(process.env.MINIO_BUCKET_NAME, "hello-there").catch((e) => {
        console.log(`Error while creating bucket '${process.env.MINIO_BUCKET_NAME}': ${e.message}`);
    });
    console.log(`Listing all buckets...`);
    const bucketsList = await minioClient.listBuckets();
    console.log(
        `Buckets List: ${bucketsList.map((bucket) => bucket.name).join(",\t")}`
    );
})();

console.log('local ip:');
console.log(getLocalIP());

const port = process.env.PORT || conf.api.port || 4000;
export const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'uiDist/dist')));
app.use(authMiddleware);
app.use(cookieParser());
app.use(session({ secret: 'a string for the session token' }));

//  Script to setup sqlite DB in memory //
dao.setupDbForDev();

//server main routs
app.use('/user', userRoutes);
app.use('/item', itemRoutes);


// Error handler
app.use(function(err, req, res, next) {
    console.error(err.message); // Log error message in our server's console
    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
    res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});
// Setting up port with express js
app.listen(port, () => {
    console.log('port: ' + port);
})
