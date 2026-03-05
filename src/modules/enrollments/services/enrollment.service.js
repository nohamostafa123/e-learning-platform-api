import Enrollment from "../../../DB/models/enrollment.model.js"
import Course from "../../../DB/models/course.model.js"
import { createNotFoundError, createConflictError, createForbiddenError } from "../../../utils/APIErrors.js"

export const createEnrollment = async (courseId, userId) => {

    // check course exists and is active
    const course = await Course.findOne({ _id: courseId, isActive: true })
    if (!course) throw createNotFoundError("course not found")

    // check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ student: userId, course: courseId })
    if (existingEnrollment) throw createConflictError("you are already enrolled in this course")

    const enrollment = await Enrollment.create({
        student: userId,
        course: courseId
    })

    // update studentsEnrolled count in course
    course.studentsEnrolled = await Enrollment.countDocuments({ 
        course: courseId, 
        status: "active" 
    })
    await course.save()

    await enrollment.populate([
        { path: "student", select: "firstName lastName email" },
        { path: "course", select: "title slug price instructor" }
    ])

    return enrollment
}

export const getAllEnrollments = async (userId, userRole, page = 1, limit = 10) => {
    const skip = (page - 1) * limit

    // admin sees all enrollments, student sees only their own
    const filter = userRole === "admin" ? {} : { student: userId }

    const enrollments = await Enrollment.find(filter)
        .populate("student", "firstName lastName email")
        .populate("course", "title slug price thumbnail instructor")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })

    const total = await Enrollment.countDocuments(filter)

    return {
        enrollments,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        }
    }
}

export const deleteEnrollment = async (id, userId, userRole) => {
    const enrollment = await Enrollment.findById(id)

    if (!enrollment) throw createNotFoundError("enrollment not found")

    // only the enrolled student or admin can cancel
    if (enrollment.student.toString() !== userId && userRole !== "admin") {
        throw createForbiddenError("you are not allowed to cancel this enrollment")
    }

    // soft delete → set status to cancelled
    enrollment.status = "cancelled"
    await enrollment.save()

    // update studentsEnrolled count in course
    const course = await Course.findById(enrollment.course)
    if (course) {
        course.studentsEnrolled = await Enrollment.countDocuments({
            course: enrollment.course,
            status: "active"
        })
        await course.save()
    }

    return { message: "enrollment cancelled successfully" }
}