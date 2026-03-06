import Course from "../../../DB/models/course.model.js"
import { createNotFoundError, createForbiddenError } from "../../../utils/APIErrors.js"

export const createCourse = async (courseData, userId) => {
    const course = await Course.create({
        ...courseData,
        instructor: userId
    })
    return course
}

export const getAllCourses = async (page = 1, limit = 10, query = {}) => {
    const skip = (page - 1) * limit 
    const filter = { isActive: true, status: "published" }
    // filter by level
    if (query.level) filter.level = query.level
    // filter by price range
    if (query.minPrice || query.maxPrice) {
        filter.price = {}
        if (query.minPrice) filter.price.$gte = Number(query.minPrice)
        if (query.maxPrice) filter.price.$lte = Number(query.maxPrice)
    }

    // search by title or description
    if (query.search) {
        filter.$or = [ 
            { title: { $regex: query.search, $options: "i" } },
            { description: { $regex: query.search, $options: "i" } }
        ]
    }

    const courses = await Course.find(filter)
        .populate("instructor", "firstName lastName email avatar")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })

    const total = await Course.countDocuments(filter)
    return {
        courses,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        }
    }
}

export const getCourseById = async (id) => {
    const course = await Course.findOne({ _id: id, isActive: true })
        .populate("instructor", "firstName lastName email avatar bio")
    if (!course) throw createNotFoundError("course not found")
    return course
}

export const updateCourse = async (id, updateData, userId, userRole) => {
    const course = await Course.findOne({ _id: id, isActive: true })
    if (!course) throw createNotFoundError("course not found")
    if (course.instructor.toString() !== userId && userRole !== "admin") {
        throw createForbiddenError("you are not allowed to update this course")
    }

    // prevent manually setting slug (auto-generated from title)
    delete updateData.slug
    Object.assign(course, updateData)
    await course.save() // triggers pre-save slug generation
    await course.populate("instructor", "firstName lastName email")
    return course
}

export const deleteCourse = async (id, userId, userRole) => {
    const course = await Course.findOne({ _id: id, isActive: true })
    if (!course) throw createNotFoundError("course not found")
    if (course.instructor.toString() !== userId && userRole !== "admin") {
        throw createForbiddenError("you are not allowed to delete this course")
    }

    // soft delete → set isActive false + archive
    course.isActive = false
    course.status = "archived"
    await course.save()

    return { message: "course deleted successfully" }
}