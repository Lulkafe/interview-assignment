const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

import { Request, Response } from 'express';

app.get('/', (reqFromUser: Request, resToUser: Response) => {
    resToUser.sendStatus(200);
})


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})