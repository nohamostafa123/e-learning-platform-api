import * as LessonService from "./services/lesson.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponse, createResponse } from "../../utils/APIResponse.js"

export const createLesson = asyncHandler(async (req, res) => {
    const lesson = await LessonService.createLesson(
        req.body,
        req.user.userId,
        req.user.role
    )
    res.status(201).json(createResponse(lesson, "Lesson created successfully"))
})

export const getAllLessons = asyncHandler(async (req, res) => {
    const courseId = req.params.courseId || req.query.courseId  // ← check both

    const { page = 1, limit = 10 } = req.query

    const result = await LessonService.getAllLessons(courseId, page, limit)
    res.json(successResponse(result, "Lessons fetched successfully"))
})

export const getLessonById = asyncHandler(async (req, res) => {
    const lesson = await LessonService.getLessonById(req.params.id)

    res.json(successResponse(lesson, "Lesson fetched successfully"))
})

export const updateLesson = asyncHandler(async (req, res) => {
    const lesson = await LessonService.updateLesson(
        req.params.id,
        req.body,
        req.user.userId,
        req.user.role
    )
    res.json(successResponse(lesson, "Lesson updated successfully"))
})

export const deleteLesson = asyncHandler(async (req, res) => {
    const result = await LessonService.deleteLesson(
        req.params.id,
        req.user.userId,
        req.user.role
    )
    res.json(successResponse(result, "Lesson deleted successfully"))
})