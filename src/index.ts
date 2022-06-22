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

    const io = new Server(httpServer, { cors: { origin: "*" } })

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
    app.set('socketIO', io)

    io.on('connection', (socket) => {
        console.log('a user connected')
        socket.on('joinPlaceRoom', (placeId) => {
            console.log('user joined place ' + placeId)
            socket.join(`place-${placeId}`)
        })
        socket.on('leavePlaceRoom', (placeId) => {
            console.log('user leaved place ' + placeId)
            socket.leave(`place-${placeId}`)
        })

        socket.on('joinCityRoom', (cityId) => {
            console.log('user joined city ' + cityId)
            socket.join(`city-${cityId}`)
        })
        socket.on('leaveCityRoom', (cityId) => {
            console.log('user leaved city ' + cityId)
            socket.leave(`city-${cityId}`)
        })

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })

    })



    // start express server
    httpServer.listen(port);

    console.log("Server has started");

}).catch(error => console.log(error));
