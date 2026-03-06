import User from "../../../DB/models/user.model.js"
import { createNotFoundError } from "../../../utils/APIErrors.js"

export const getAllUsers = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit

    const users = await User.find()
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
    const total = await User.countDocuments()

    return {
        users,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        }
    }
}

export const getUserById = async (id) => {
    const user = await User.findById(id).select("-password")
    if (!user) throw createNotFoundError("user not found")
    return user
}

export const updateUserRole = async (id, role) => {
    const user = await User.findById(id)
    if (!user) throw createNotFoundError("user not found")
    user.role = role
    await user.save()
    user.password = undefined
    return user
}

export const deleteUser = async (id) => {
    const user = await User.findById(id)
    if (!user) throw createNotFoundError("user not found")

    // Soft delete
    user.isActive = false
    await user.save()
    return { message: "user deleted successfully" }
}