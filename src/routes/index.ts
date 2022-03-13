import { AuthController } from "../controller/auth.controller";

const express = require('express');

const router = express.Router();

export default class Router {
  private router: any;
  private controllers: {
      authController: AuthController
  };
  constructor() {
    this.router = express.Router();
    this.controllers = {
      authController: new AuthController()
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


    
  }

  getRoutes() {
    return this.router;
  }
}