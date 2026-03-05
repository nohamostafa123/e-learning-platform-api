import express from "express"
import * as EnrollmentController from "./enrollment.controller.js"
import { authentication } from "../../middlewares/authentication.middleware.js"
import { authorization } from "../../middlewares/authorization.middleware.js"

const enrollmentRouter = express.Router()

// All enrollment routes require authentication
enrollmentRouter.use(authentication)

enrollmentRouter.post("/",
    authorization("student"),
    EnrollmentController.createEnrollment
)

enrollmentRouter.get("/",
    authorization("student", "admin"),
    EnrollmentController.getAllEnrollments
)

enrollmentRouter.delete("/:id",
    authorization("student", "admin"),
    EnrollmentController.deleteEnrollment
)

export default enrollmentRouter