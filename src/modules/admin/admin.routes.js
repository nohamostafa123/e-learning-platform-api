import express from "express"
import * as AdminController from "./admin.controller.js"
import { authentication } from "../../middlewares/authentication.middleware.js"
import { authorization } from "../../middlewares/authorization.middleware.js"

const adminRouter = express.Router()

adminRouter.use(authentication, authorization("admin"))

adminRouter.get("/users", AdminController.getAllUsers)
adminRouter.get("/users/:id", AdminController.getUserById)
adminRouter.put("/users/:id/role", AdminController.updateUserRole)
adminRouter.delete("/users/:id", AdminController.deleteUser)

export default adminRouter