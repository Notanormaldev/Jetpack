import config from "../config/config.js"
import usermodel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { sendOtpEmail, generateOtp } from "../utils/sendotp.js"
import redis from "../config/cache.js"

async function tokenresponse(user, res, msg) {
  // Access Token (Expires in 15m)
  const accessToken = jwt.sign(
    {
      id: user._id,
      user: { _id: user._id, email: user.email, role: user.role, fullname: user.fullname }
    },
    config.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  )

  // Refresh Token (Expires in 7d)
  const refreshToken = jwt.sign(
    { id: user._id },
    config.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENVIRONMENT === 'production',
    sameSite: config.NODE_ENVIRONMENT === 'production' ? 'none' : 'lax',
    path: '/'
  }

  // Set cookies
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

  user.password = undefined
  return res.status(200).json({
    msg,
    success: true,
    user: user
  })
}

async function register(req, res) {
  const { email, fullname, password } = req.body

  try {
    const existuser = await usermodel.findOne({ email })

    if (existuser && !existuser.isverified) {
      const otp = generateOtp()
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

      await usermodel.findByIdAndUpdate(existuser._id, { otp, otpExpiry })
      await sendOtpEmail(existuser.email, otp)

      return res.status(200).json({
        msg: "OTP resent to your email, please verify",
        success: true,
        requiresOtp: true,
        email
      })
    }

    if (existuser && existuser.isverified) {
      return res.status(400).json({
        msg: "User with this email already exists"
      })
    }

    const otp = generateOtp()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    await usermodel.create({
      email,
      fullname,
      password,
      role: "buyer",
      otp,
      otpExpiry,
      isverified: false
    })

    await sendOtpEmail(email, otp)

    return res.status(200).json({
      msg: "OTP sent to your email, please verify",
      success: true,
      requiresOtp: true,
      email
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Server error" })
  }
}

async function verifyotp(req, res) {
  const { email, otp } = req.body

  try {
    const user = await usermodel.findOne({ email })

    if (!user) {
      return res.status(400).json({ msg: "User not found, please register again" })
    }

    if (user.isverified) {
      return res.status(400).json({ msg: "Already verified, please login" })
    }

    if (user.otp !== otp) {
      return res.status(401).json({ msg: "Invalid OTP" })
    }

    if (user.otpExpiry < new Date()) {
      return res.status(401).json({ msg: "OTP expired, please register again" })
    }

    await usermodel.findByIdAndUpdate(user._id, {
      isverified: true,
      otp: null,
      otpExpiry: null
    })

    const verifiedUser = await usermodel.findById(user._id)
    await tokenresponse(verifiedUser, res, "Registration successful")
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Server error" })
  }
}

async function login(req, res) {
  const { email, password } = req.body

  try {
    const user = await usermodel.findOne({ email }).select('+password')

    if (!user) {
      return res.status(400).json({
        msg: "User does not exist, please register"
      })
    }

    const isvalid = await user.comparePassword(password)

    if (!isvalid) {
      return res.status(401).json({
        msg: "Invalid password"
      })
    }

    await tokenresponse(user, res, "Login successful")
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: "Server error"
    })
  }
}

async function getme(req, res) {
  const decoded = req.user

  try {
    const user = await usermodel.findById(decoded.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User does not exist"
      })
    }

    return res.status(200).json({
      success: true,
      user: user
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      msg: "Internal server error"
    })
  }
}

async function googlecallback(req, res) {
  const { emails, id, displayName, photos } = req.user
  const email = emails[0].value
  const profilepic = photos[0].value
  const isverified = emails[0].verified

  let user = await usermodel.findOne({ email })

  if (!user) {
    user = await usermodel.create({
      email: email,
      fullname: displayName,
      profilepic: profilepic,
      isverified: isverified,
      googleid: id
    })
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
      user: { _id: user._id, email: user.email, role: user.role, fullname: user.fullname }
    },
    config.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { id: user._id },
    config.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENVIRONMENT === 'production',
    sameSite: config.NODE_ENVIRONMENT === 'production' ? 'none' : 'lax',
    path: '/'
  }

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

  res.redirect(config.NODE_ENVIRONMENT === "development" ? 'http://localhost:5173' : '/')
}

async function logout(req, res) {
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken

  if (accessToken) {
    await redis.set(accessToken, Date.now().toString(), 'EX', 15 * 60)
  }
  if (refreshToken) {
    await redis.set(refreshToken, Date.now().toString(), 'EX', 3600 * 24 * 7)
  }

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENVIRONMENT === 'production',
    sameSite: config.NODE_ENVIRONMENT === 'production' ? 'none' : 'lax',
    path: '/'
  }

  res.clearCookie('accessToken', cookieOptions)
  res.clearCookie('refreshToken', cookieOptions)

  return res.status(200).json({
    msg: "Logout successful"
  })
}

async function deleteaccount(req, res) {
  const id = req.user.id
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken

  const finduser = await usermodel.findById(id)

  if (!finduser) {
    return res.status(401).json({
      msg: "User does not exist"
    })
  }

  await usermodel.findByIdAndDelete(id)

  if (accessToken) {
    await redis.set(accessToken, Date.now().toString(), 'EX', 15 * 60)
  }
  if (refreshToken) {
    await redis.set(refreshToken, Date.now().toString(), 'EX', 3600 * 24 * 7)
  }

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENVIRONMENT === 'production',
    sameSite: config.NODE_ENVIRONMENT === 'production' ? 'none' : 'lax',
    path: '/'
  }

  res.clearCookie('accessToken', cookieOptions)
  res.clearCookie('refreshToken', cookieOptions)

  return res.status(200).json({
    msg: "User deleted successfully"
  })
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, msg: "Email is required" })
    }

    const user = await usermodel.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, msg: "No user found with this email" })
    }

    const otp = generateOtp()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = otp
    user.otpExpiry = otpExpiry
    await user.save()

    await sendOtpEmail(email, otp)

    return res.status(200).json({
      success: true,
      msg: "OTP sent to your email for password reset"
    })
  } catch (error) {
    console.error("forgotPassword Error:", error)
    return res.status(500).json({ success: false, msg: "Server error during password reset" })
  }
}

async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, msg: "All fields are required" })
    }

    const user = await usermodel.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" })
    }

    if (user.otp !== otp) {
      return res.status(401).json({ success: false, msg: "Invalid OTP" })
    }

    if (user.otpExpiry < new Date()) {
      return res.status(401).json({ success: false, msg: "OTP has expired" })
    }

    user.password = newPassword
    user.otp = null
    user.otpExpiry = null
    await user.save()

    return res.status(200).json({
      success: true,
      msg: "Password updated successfully, please login"
    })
  } catch (error) {
    console.error("resetPassword Error:", error)
    return res.status(500).json({ success: false, msg: "Server error during password reset" })
  }
}

async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    return res.status(401).json({ success: false, msg: "Refresh token is missing" })
  }

  try {
    const isBlacklisted = await redis.get(refreshToken)
    if (isBlacklisted) {
      return res.status(401).json({ success: false, msg: "Session expired, please login again" })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET)
    const user = await usermodel.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ success: false, msg: "User not found" })
    }

    // 1. Generate new Access Token (15m)
    const newAccessToken = jwt.sign(
      {
        id: user._id,
        user: { _id: user._id, email: user.email, role: user.role, fullname: user.fullname }
      },
      config.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    )

    // 2. Generate new Refresh Token (Rotates validity for another 7d)
    const newRefreshToken = jwt.sign(
      { id: user._id },
      config.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    // 3. Blacklist old refresh token in Redis (prevent replay attacks)
    await redis.set(refreshToken, Date.now().toString(), 'EX', 3600 * 24 * 7)

    const cookieOptions = {
      httpOnly: true,
      secure: config.NODE_ENVIRONMENT === 'production',
      sameSite: config.NODE_ENVIRONMENT === 'production' ? 'none' : 'lax',
      path: '/'
    }

    // 4. Update cookies
    res.cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

    return res.status(200).json({
      success: true,
      msg: "Tokens rotated successfully",
      user: user
    })
  } catch (error) {
    console.log("Refresh token error:", error)
    return res.status(401).json({ success: false, msg: "Invalid or expired refresh token" })
  }
}

export default {
  register,
  login,
  getme,
  googlecallback,
  verifyotp,
  logout,
  deleteaccount,
  forgotPassword,
  resetPassword,
  refresh
}