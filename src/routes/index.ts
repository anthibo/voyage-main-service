import { AuthController } from "../controller/auth.controller";
import { CityController } from "../controller/city.controller";
import { PlaceController } from "../controller/place.controller";
import { TransportationController } from "../controller/transportation.controller";
import { UserController } from "../controller/user.controller";
import { auth as authMiddleware, checkPermission } from "../utils/middleware/auth.middleware";
import {Router as RouterExpress} from 'express';
import * as express from 'express';
import { upload } from "../utils/helpers/multer";
import { uploadToCloud } from "../utils/helpers/cloudinary";
import { DashboardController } from "../controller/dashboard.controller";
import { TripController } from "../controller/trip.controller";
// const express = require('express');


export default class Router {
  private router: express.Router;
  private controllers: {
      authController: AuthController
      cityController: CityController
      placeController: PlaceController
      userController: UserController
      transportationController: TransportationController
      dashboardController: DashboardController,
      tripController: TripController

  };
  constructor() {
    this.router = express.Router();
    this.controllers = {
      authController: new AuthController(),
      cityController: new CityController(),
      placeController: new PlaceController(),
      userController: new UserController(),
      transportationController : new TransportationController(),
      dashboardController: new DashboardController(),
      tripController: new TripController()
    };
  }

  initializeRoutes() {
    this.router.get('/ping', (req: any, res: any) => {
      res.status(200).send('admin pong');
    });

    // auth routes
    this.router.post('/auth/register/user', this.controllers.authController.registerNormalUser)
    this.router.post('/auth/login/user', this.controllers.authController.loginNormalUser)

    this.router.post('/auth/register/agency', this.controllers.authController.registerAgency)
    this.router.post('/auth/login/agency', this.controllers.authController.loginAgency)

    this.router.post('/auth/register/admin', this.controllers.authController.registerAdmin)
    this.router.post('/auth/login/admin', this.controllers.authController.loginAdmin)

    
    
    //Auth Middleware
    this.router.use(authMiddleware)
    
    //Dashboard routes
    this.router.get('/dashboard/stats',checkPermission('admin'), this.controllers.dashboardController.getPlaceCityUsersStats)

    //user routes
    this.router.get('/user/me', this.controllers.userController.getNormalUserDataByToken)
    this.router.get('/user/', checkPermission('admin'),this.controllers.userController.listAllUsers)


    // city routes
    this.router.get('/city', checkPermission('admin', 'normal_user'),this.controllers.cityController.findAllCities)
    this.router.post('/city', checkPermission('admin'),upload.array('image'), this.controllers.cityController.createCity)
    this.router.get('/city/:id', this.controllers.cityController.findOne)
    this.router.patch('/city/:id', this.controllers.cityController.updateCity)
    this.router.delete('/city/:id', this.controllers.cityController.deleteCity)
    this.router.post('/city/:id/rating', this.controllers.cityController.addRatingToCity)
    this.router.post('/city/:id/review', upload.array('image'),this.controllers.cityController.addReviewToCity)
    this.router.delete('/city/:id/review',this.controllers.cityController.deleteReview)


    // places routes
    this.router.get('/place', this.controllers.placeController.findAllPlaces)
    this.router.post('/place',checkPermission('admin'),upload.array('image'), this.controllers.placeController.createPlace)
    this.router.get('/place/:id', this.controllers.placeController.findOne)
    this.router.patch('/place/:id', this.controllers.placeController.updatePlace)
    this.router.delete('/place/:id', this.controllers.placeController.deletePlace)
    this.router.post('/place/:id/rating', this.controllers.placeController.addRatingToPlace)
    this.router.post('/place/:id/review', upload.array('image'),this.controllers.placeController.addReviewToPlace)
    this.router.delete('/place/:id/review',this.controllers.placeController.deleteReview)

    //trips routes
    this.router.post('/trip', this.controllers.tripController.createCustomizedTrip)
    this.router.patch('/trip/:tripId', this.controllers.tripController.updateCustomizedTrip)
    this.router.get('/trip', this.controllers.tripController.listAllUserTrips)
    this.router.get('/trip/generated', this.controllers.tripController.listGeneratedTrips)
    this.router.get('/trip/:tripId', this.controllers.tripController.getTrip)
    this.router.get('/trip/place/:placeId', this.controllers.tripController.listNotAddedPlaceTrips)
    this.router.delete('/trip/:tripId', this.controllers.tripController.deleteTrip)
    this.router.post('/trip/:tripId/place', this.controllers.tripController.addPlaceToTrip)
    this.router.delete('/trip/:tripId/place/:placeId', this.controllers.tripController.deletePlaceFromTrip)
    this.router.post('/trip/generated', this.controllers.tripController.createGeneratedTrips)
    this.router.post('/trip/generated/save', this.controllers.tripController.saveGeneratedTrips)


    




    // transportation means routes
    this.router.get('/transportationMean', this.controllers.transportationController.findAllTransportationMeans)
    this.router.post('/transportationMean', this.controllers.transportationController.createTransportationMean)
    this.router.get('/transportationMean/:id', this.controllers.transportationController.findOneTransportationMean)
    this.router.patch('/transportationMean/:id', this.controllers.transportationController.updateTransportationMean)
    this.router.delete('/transportationMean/:id', this.controllers.transportationController.deleteTransportationMean)
    this.router.post('/transportationMean/:id', this.controllers.transportationController.deleteTransportationMean)





  
    
  }

  getRoutes() {
    return this.router;
  }
}