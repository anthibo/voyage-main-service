import "reflect-metadata";
import {createConnection} from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
const logger = require('morgan')
import Router from './routes'
createConnection().then(async connection => {

    // create express app
    const app = express();

    if (process.env.NODE_ENV !== 'test') {
        app.use(logger('dev'));
      }
    // app middlewares 
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

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    console.log("Server has started on port 3000. Open http://localhost:3000");

}).catch(error => console.log(error));
