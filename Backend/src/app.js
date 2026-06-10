import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import authrouter from './Routes/auth.route.js'
import cors from 'cors'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import config from './config/config.js'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

const app=express()

// Secure Express headers with Helmet
app.use(helmet())

// Brute-force & DDoS protection rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    msg: 'Too many requests from this IP, please try again after 15 minutes.'
  }
})

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
}))


app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID:config.GOOGLE_CLIENT_ID,
    clientSecret:config.GOOGLE_CLIENT_SECRET,
    callbackURL:"/api/auth/google/callback"
},(accessToken,refreshToken,profile,done)=>{
   return  done(null,profile);
})
)






app.use('/api/auth', authLimiter, authrouter)
export default app