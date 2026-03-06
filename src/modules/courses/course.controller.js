import * as CourseService from "./services/course.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponse, createResponse } from "../../utils/APIResponse.js"

export const createCourse = asyncHandler(async (req, res) => {
    const course = await CourseService.createCourse(req.body, req.user.userId)
    res.status(201).json(createResponse(course, "Course created successfully"))
})

export const getAllCourses = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, level, search } = req.query
    const result = await CourseService.getAllCourses(page, limit, { category, level, search })
    res.json(successResponse(result, "Courses fetched successfully"))
})

export const getCourseById = asyncHandler(async (req, res) => {
    const course = await CourseService.getCourseById(req.params.id)
    res.json(successResponse(course, "Course fetched successfully"))
})

export const updateCourse = asyncHandler(async (req, res) => {
    const course = await CourseService.updateCourse(
        req.params.id,
        req.body,
        req.user.userId,
        req.user.role
    )

    res.json(successResponse(course, "Course updated successfully"))
})

export const deleteCourse = asyncHandler(async (req, res) => {
    const result = await CourseService.deleteCourse(
        req.params.id,
        req.user.userId,
        req.user.role
    )

    res.json(successResponse(result, "Course deleted successfully"))
})