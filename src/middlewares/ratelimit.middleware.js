
import { rateLimit } from "express-rate-limit"
import { config } from "../config/env.js"

export const apiLimit =  rateLimit( {
    windowMs : 15 * 60 * 1000 ,
    max : 100 ,
    message : "too many requests from this IP , try again later" ,
    standardHeaders : true ,
    legacyHeaders : false ,
    
} )


export const authlimit =  rateLimit( {
    windowMs : 90000 ,
    max : 5 ,
    message : "too many requests from this IP , try again later" ,
    standardHeaders : true , // return rate limit info in the `RateLimit-*` headers
    legacyHeaders : false , //prevent using old headers like x-rate-limit-limit
    skipSuccessfulRequests: true // only count failed requests (like wrong password) toward the limit
    
} )