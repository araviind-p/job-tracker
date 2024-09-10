import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/authRoute.js"
import userRoutes from "./routes/userRoute.js"
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/v1', userRoutes)

const port = 5000

app.listen(port, () => {
    console.log(`Server is Running on port ${port}`)
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("Database connected✅");
    }).catch((err) => {
        console.log("mongodb connection error", err);
    })
})
