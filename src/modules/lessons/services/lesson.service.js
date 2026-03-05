import Lesson from "../../../DB/models/lesson.model.js"
import Course from "../../../DB/models/course.model.js"
import { createNotFoundError, createForbiddenError } from "../../../utils/APIErrors.js"

export const createLesson = async (lessonData, userId, userRole) => {
    // check course exists
    const course = await Course.findOne({ _id: lessonData.course, isActive: true })
    if (!course) throw createNotFoundError("course not found")

    // only course owner or admin can add lessons
    if (course.instructor.toString() !== userId && userRole !== "admin") {
        throw createForbiddenError("you are not allowed to add lessons to this course")
    }

    const lesson = await Lesson.create(lessonData)

    // update lessonsCount in course
    course.lessonsCount = await Lesson.countDocuments({ course: lessonData.course })
    await course.save()

    return lesson
}

export const getAllLessons = async (courseId, page = 1, limit = 10) => {    
    const skip = (page - 1) * limit

    // check course exists
    const course = await Course.findOne({ _id: courseId, isActive: true })
    if (!course) throw createNotFoundError("course not found")

    const lessons = await Lesson.find({ course: courseId })
        .skip(skip)
        .limit(Number(limit))
        .sort({ order: 1 }) // sort by order field

    const total = await Lesson.countDocuments({ course: courseId })

    return {
        lessons,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        }
    }
}

export const getLessonById = async (id) => {
    const lesson = await Lesson.findById(id)
        .populate("course", "title slug instructor")

    if (!lesson) throw createNotFoundError("lesson not found")

    return lesson
}

export const updateLesson = async (id, updateData, userId, userRole) => {
    const lesson = await Lesson.findById(id)
        .populate("course", "instructor")

    if (!lesson) throw createNotFoundError("lesson not found")

    // only course owner or admin can update
    if (lesson.course.instructor.toString() !== userId && userRole !== "admin") {
        throw createForbiddenError("you are not allowed to update this lesson")
    }

    // prevent manually setting slug
    delete updateData.slug

    Object.assign(lesson, updateData)
    await lesson.save() // triggers pre-save slug generation

    return lesson
}

export const deleteLesson = async (id, userId, userRole) => {
    const lesson = await Lesson.findById(id)
        .populate("course", "instructor")

    if (!lesson) throw createNotFoundError("lesson not found")

    // only course owner or admin can delete
    if (lesson.course.instructor.toString() !== userId && userRole !== "admin") {
        throw createForbiddenError("you are not allowed to delete this lesson")
    }

    const courseId = lesson.course._id
    await Lesson.findByIdAndDelete(id)

    // update lessonsCount in course
    const course = await Course.findById(courseId)
    if (course) {
        course.lessonsCount = await Lesson.countDocuments({ course: courseId })
        await course.save()
    }

    return { message: "lesson deleted successfully" }
}