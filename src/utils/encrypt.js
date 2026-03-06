import CryptoJS from "crypto-js"
import { config } from './../config/env.js';

export const encrypt =  ( text ) =>{
    return CryptoJS.AES.encrypt( text  , config.JWT.SECRET  ).toString()
}

export const decrypt =  ( ciphertext ) =>{
    const bytes = CryptoJS.AES.decrypt( ciphertext , config.JWT.SECRET  )
    return bytes.toString( CryptoJS.enc.Utf8 )
}
