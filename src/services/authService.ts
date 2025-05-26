import { User } from "../models/user.interface"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "Default-secret"

export const generateToken = (user : User): string => {
    return jwt.sign({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        password: user.password
    },
    JWT_SECRET,
    {expiresIn : '1h'}
)}