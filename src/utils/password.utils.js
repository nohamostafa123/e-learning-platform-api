import bcrypt from "bcrypt"

export const hashPassword = async( password ) =>{
    const salt = await bcrypt.genSalt(10) //encrypting the password with 10 rounds of salt
    return await bcrypt.hash( password , salt )
}

export const comparePassword = async (  password , hashpassword  )=>{
    return await bcrypt.compare( password , hashpassword )
}