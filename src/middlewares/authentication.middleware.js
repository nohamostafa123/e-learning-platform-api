import { createUnauthorizedError } from "../utils/APIErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.utils.js";
import User from "../DB/models/user.model.js" // ← add this

export const authentication = asyncHandler(async (req, res, next) => {

    let token = req.headers.authorization?.split("Bearer ")[1]
    if (!token) {
        token = req.cookies?.accessToken
    }
    if (!token) {
        throw createUnauthorizedError("no token provided")
    }
    const decoded = verifyToken(token)

    // ← fetch user from DB first
    const user = await User.findById(decoded.userId)

    if (!user) {
        throw createUnauthorizedError("user no longer exists")
    }
    if (!user.isActive) {
        throw createUnauthorizedError("user account is deactivated")
    }

    // ← now you can use user.lastLogout
    if (user.lastLogout && decoded.iat * 1000 < user.lastLogout.getTime()) {
        throw createUnauthorizedError("token has been invalidated")
    }

    req.user = decoded
    next()
})