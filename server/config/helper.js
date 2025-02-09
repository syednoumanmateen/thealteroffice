import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// SECRETKEY
const secretKey = process.env.JWT_SECRET

// hashing password
export const hashedPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    } catch (e) {
        console.log(`error: ${e}`)
    }
}
// hashing password

// compare password
export const comparePassword = async (password, encryptPassword) => {
    try {
        return await bcrypt.compare(password, encryptPassword)
    } catch (e) {
        console.log(`error: ${e}`)
    }
}
// compare password

// generate token
export const tokenGenerate = async (data) => {
    try {
        return await jwt.sign(data, secretKey, { expiresIn: "1d" })
    } catch (e) {
        console.log(`error: ${e}`)
    }
}
// generate token

// verify token
export const verifyToken = async (token) => {
    try {
        const data = await jwt.verify(token, secretKey)
        return { ...data }
    } catch (e) {
        console.log(`error: ${e}`)
    }
}
// verify token