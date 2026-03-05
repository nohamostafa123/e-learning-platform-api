import { HTTP_STATUS } from "../config/constants.js"
import { config } from "../config/env.js"

export const errorHandler = ( err , req , res , next ) =>{
    let error = {...err}
    error.message = err.message
    if (err.name == "CastError") {
        error.statusCode = HTTP_STATUS.NOT_FOUND 
        error.message = " resource not found "
    }
    if (err.code === 11000) {
        const filed = Object.keys( err.keyValue)[0]
        error.statusCode = HTTP_STATUS.CONFLICT
        error.message = ` ${ filed } already exist `
    }
    res.status( error.statusCode  || HTTP_STATUS.INTERNAL_SERVER_ERROR ).json({
        success: false ,
        message: error.message || "server error" ,
        ...( config.isDevelopment  && { stack :err.stack } )
    })

}