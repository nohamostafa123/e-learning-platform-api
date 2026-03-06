import * as AdminService from "./services/admin.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponse } from "../../utils/APIResponse.js"

export const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const result = await AdminService.getAllUsers(page, limit)
    res.json(successResponse(result, "Users fetched successfully"))
})

export const getUserById = asyncHandler(async (req, res) => {
    const user = await AdminService.getUserById(req.params.id)
    res.json(successResponse(user, "User fetched successfully"))
})

export const updateUserRole = asyncHandler(async (req, res) => {
    const user = await AdminService.updateUserRole(req.params.id, req.body.role)
    res.json(successResponse(user, "User role updated successfully"))
})

export const deleteUser = asyncHandler(async (req, res) => {
    const result = await AdminService.deleteUser(req.params.id)
    res.json(successResponse(result, "User deleted successfully"))
})