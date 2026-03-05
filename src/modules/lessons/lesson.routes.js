import express from "express"
import * as LessonController from "./lesson.controller.js"
import { authentication } from "../../middlewares/authentication.middleware.js"
import { authorization } from "../../middlewares/authorization.middleware.js"

const lessonRouter = express.Router({ mergeParams: true })// mergeParams to access courseId

// Public
lessonRouter.get("/", LessonController.getAllLessons)
lessonRouter.get("/:id", LessonController.getLessonById)

// Protected — instructor or admin only
lessonRouter.post("/",
    authentication,
    authorization("instructor", "admin"),
    LessonController.createLesson
)

lessonRouter.put("/:id",
    authentication,
    authorization("instructor", "admin"),
    LessonController.updateLesson
)

lessonRouter.delete("/:id",
    authentication,
    authorization("instructor", "admin"),
    LessonController.deleteLesson
)

export default lessonRouter