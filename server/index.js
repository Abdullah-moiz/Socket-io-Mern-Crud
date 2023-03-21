import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/routes.js';

import { createServer } from "http";
import { Server } from "socket.io";
import test from './models/test.js';

dotenv.config();

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors("*"));
app.use('/', router)

const connectionUrl = process.env.ConnectionUrl;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

// create a new http server for socket on port 5001
const socketHttpServer = createServer();
const ioSocket = new Server(socketHttpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

ioSocket.on("connection", (socket) => {
    socket.on('message', async (payload) => {
        try {
            const saveData =  await test.create(payload);
            ioSocket.emit('message', saveData);
        } catch (error) {
            console.log(error)
        }
    }) 
    
    socket.on('getMessages', async () => {
        console.log('getting messages ')
        try {
            const saveData =  await test.find({});
            ioSocket.emit('getMessages', saveData);
        } catch (error) {
            console.log(error)
        }
    }) 
    
    socket.on('delete', async (payload) => {
 
        try {
            const saveData =  await test.findByIdAndDelete(payload);
            const getData = await test.find({});
            ioSocket.emit('delete', getData);
        } catch (error) {
            console.log(error)
        }
    }) 

});

ioSocket.on("disconnect", () => {
    console.log("Client disconnected");
});


socketHttpServer.listen(5001, () => {
    console.log(`Socket.IO server is running on http://localhost:5001`);
});

io.attach(httpServer);

mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Getting Error from DB connection" + err.message))

httpServer.listen(port, () => {
    console.log(`Express app is running on http://localhost:${port}`);
});
