import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { createServer } from "http";
import * as bodyParser from "body-parser";
import { Server } from 'socket.io';
import cors from 'cors'
import { Request, Response } from "express";
const logger = require('morgan')
import Router from './routes'
import { dbConnectionOptions } from "./ormconfig";
import { handleGlobalErrors } from "./utils/middleware/error.middleware";

const port = process.env.PORT || 3000
createConnection().then(async connection => {
    const app = express();


    const httpServer = createServer(app)

    const io = new Server(httpServer, {})

    // create express app

    if (process.env.NODE_ENV !== 'test') {
        app.use(logger('dev'));
    }
    // app middlewares 
    app.use(cors())
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.urlencoded({ extended: false }));

    // register express routes from defined application routes
    const router = new Router();
    router.initializeRoutes()
    app.get('/', (req, res) => {
        res.send(`healthy`)
    })
    app.use('/api/v1', router.getRoutes())
    app.use(handleGlobalErrors)

    // setup express app here
    // ...
    io.on('connection', (socket) => {
        console.log('a user connected')
        socket.emit('de7k', {message: 'a user is presenting de7k'})
        socket.on('de7k', (data) => {
            console.log(data)
            socket.emit('user ezayek', 'ezayek')
        })
        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
        
    })
   

    // start express server
    httpServer.listen(port);

    console.log("Server has started");

}).catch(error => console.log(error));
