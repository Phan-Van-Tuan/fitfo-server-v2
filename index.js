import express, { json } from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(json());
app.use(cors());
app.use(helmet());
app.use(logger("dev"));

import MiddlewareLoader from './src/config/middleware.config.js'
MiddlewareLoader.init(app);

import RoutesLoader from './src/config/router.config.js';
const version = process.env.VERSION || "V2";
RoutesLoader.init(app, version);

import DatabaseLoader from './config/database.config.js';
const uri = process.env.MONGODB_URI;
DatabaseLoader.init(uri);

var server = createServer(app);
const PORT = process.env.PORT || 3300;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


