import jwt from 'jsonwebtoken'
import config from '../config/config.js';
import redis from '../config/cache.js';

export async function authtokenmiddleware(req,res,next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            msg:"empty token"
        })
    }
    
    try {
        const isBlacklisted = await redis.get(token)
        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                msg: "Invalid session (logged out)"
            })
        }

        const decoded=jwt.verify(token,config.JWT)

        req.user=decoded

        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            msg: "Invalid or expired token"
        });
    }
}