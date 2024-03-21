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

import DatabaseLoader from './src/config/database.config.js';
const uri = process.env.MONGODB_URI;
DatabaseLoader.init(uri);

import RoutesLoader from './src/config/router.config.js';
RoutesLoader.init(app);

import CatchLoader from './src/config/catch.config.js'
CatchLoader.init(app);

var server = createServer(app);
const PORT = process.env.PORT || 3300;

server.listen(PORT, () => {
    console.log(`👌 Server running at http://localhost:${PORT}`);
});


