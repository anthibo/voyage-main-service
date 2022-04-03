import { AuthController } from "../controller/auth.controller";
import { CityController } from "../controller/city.controller";

const express = require('express');

const router = express.Router();

export default class Router {
  private router: any;
  private controllers: {
      authController: AuthController
      cityController: CityController
  };
  constructor() {
    this.router = express.Router();
    this.controllers = {
      authController: new AuthController(),
      cityController: new CityController()
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

    // city routes
    this.router.get('/city', this.controllers.cityController.findAllCities)
    this.router.post('/city', this.controllers.cityController.createCity)
    this.router.get('/city/:id', this.controllers.cityController.findOne)
    this.router.patch('/city/:id', this.controllers.cityController.updateCity)
    this.router.delete('/city/:id', this.controllers.cityController.deleteCity)



    
  }

  getRoutes() {
    return this.router;
  }
}