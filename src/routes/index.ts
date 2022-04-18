import { AuthController } from "../controller/auth.controller";
import { CityController } from "../controller/city.controller";
import { PlaceController } from "../controller/place.controller";
import { auth } from "../utils/middleware/auth.middleware";

const express = require('express');

const router = express.Router();

export default class Router {
  private router: any;
  private authMiddleware: Function
  private controllers: {
      authController: AuthController
      cityController: CityController
      placeController: PlaceController

  };
  constructor() {
    this.router = express.Router();
    this.authMiddleware = auth
    this.controllers = {
      authController: new AuthController(),
      cityController: new CityController(),
      placeController: new PlaceController()
    };
  }

  initializeRoutes() {
    this.router.get('/ping', (req: any, res: any) => {
      res.status(200).send('admin pong');
    });

    // auth routes
    this.router.post('/auth/register/user', this.controllers.authController.registerNormalUser)
    this.router.post('/auth/register/agency', this.controllers.authController.registerAgency)
    this.router.post('/auth/login/user', this.controllers.authController.loginNormalUser)
    this.router.post('/auth/login/agency', this.controllers.authController.loginAgency)

    //Auth Middleware
    this.router.use(this.authMiddleware)

    // city routes
    this.router.get('/city', this.controllers.cityController.findAllCities)
    this.router.post('/city', this.controllers.cityController.createCity)
    this.router.get('/city/:id', this.controllers.cityController.findOne)
    this.router.patch('/city/:id', this.controllers.cityController.updateCity)
    this.router.delete('/city/:id', this.controllers.cityController.deleteCity)

    // places routes
    this.router.get('/place', this.controllers.placeController.findAllPlaces)
    this.router.get('/city/:id/place', this.controllers.placeController.findCityPlaces)
    this.router.post('/place', this.controllers.placeController.createPlace)
    this.router.get('/place/:id', this.controllers.placeController.findOne)
    this.router.patch('/place/:id', this.controllers.placeController.updatePlace)
    this.router.delete('/place/:id', this.controllers.placeController.deletePlace)
  
    
  }

  getRoutes() {
    return this.router;
  }
}