import express from "express"
import * as CourseController from "./course.controller.js"
import { authentication } from "../../middlewares/authentication.middleware.js"
import { authorization } from "../../middlewares/authorization.middleware.js"

const courseRouter = express.Router()

courseRouter.get("/", CourseController.getAllCourses)
courseRouter.get("/:id", CourseController.getCourseById)

// Protected routes — only instructor or admin
courseRouter.post("/",
    authentication,
    authorization("instructor", "admin"),
    CourseController.createCourse
)

courseRouter.put("/:id",
    authentication,
    authorization("instructor", "admin"),
    CourseController.updateCourse
)

courseRouter.delete("/:id",
    authentication,
    authorization("instructor", "admin"),
    CourseController.deleteCourse
)

export default courseRouter