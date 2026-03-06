import express from "express"
import * as AuthController from "./auth.controller.js"
import * as authValidation from "./validation/auth.validation.js"
import { ValidationRequest } from './../../middlewares/validation.middleware.js';
import { authentication } from "../../middlewares/authentication.middleware.js"
import { authlimit } from "../../middlewares/ratelimit.middleware.js";

const authRouter = express.Router()

authRouter.post( "/register"  , authlimit , ValidationRequest(authValidation.registerValidation)  , AuthController.register )
authRouter.post( "/login"  , authlimit , AuthController.login )
authRouter.post( "/refresh-token"  , AuthController.refreshToken )
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/reset-password/:token', AuthController.resetPassword);
authRouter.post('/logout', authentication, AuthController.logout)

export default authRouter