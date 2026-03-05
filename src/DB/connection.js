import mongoose from "mongoose"
import { config } from "../config/env.js";

const DateBase = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI)
        console.log("DB is connected ")

    } catch (error) {
        console.log("DB connection failed ", error.message)
        process.exit(1) // stop server if db failed    
    }
}

export default DateBase