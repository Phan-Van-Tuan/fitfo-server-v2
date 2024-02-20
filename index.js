import express, { json } from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './src/config/connectionDatabase.js';
import router from './src/routes/index.js';

const app = express();
app.use(json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(logger("dev"));
app.use('/api', router);

app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status == 404
    next(err)
});

app.use((err, req, res, next) => {
    const mode = process.env.NODE_ENV === 'development' ? err : {}
    return res.status(err.status || 500).json({
        message: mode.message,
        error: err
    });
});

connectDB();
var server = createServer(app);
const PORT = process.env.PORT || 3300;

server.listen(PORT, () => {
    // console.log(`Server running at http://localhost:${PORT}`);
});


