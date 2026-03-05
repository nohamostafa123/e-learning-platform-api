import * as EnrollmentService from "./services/enrollment.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponse, createResponse } from "../../utils/APIResponse.js"

export const createEnrollment = asyncHandler(async (req, res) => {
    const enrollment = await EnrollmentService.createEnrollment(
        req.body.courseId,
        req.user.userId
    )
    res.status(201).json(createResponse(enrollment, "Enrolled successfully"))
})

export const getAllEnrollments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query

    const result = await EnrollmentService.getAllEnrollments(
        req.user.userId,
        req.user.role,
        page,
        limit
    )
    res.json(successResponse(result, "Enrollments fetched successfully"))
})

export const deleteEnrollment = asyncHandler(async (req, res) => {
    const result = await EnrollmentService.deleteEnrollment(
        req.params.id,
        req.user.userId,
        req.user.role
    )
    res.json(successResponse(result, "Enrollment cancelled successfully"))
})