import { NextFunction , Request, Response} from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import logger from "../lib/logger.js"

dotenv.config(); 

declare global {
    namespace Express {
         interface Request {
             tenantId:string 
             email:string 
         }
    }
}

export default function jwtMiddleware(req:Request , res:Response , next:NextFunction){
    const authHeader = req.headers.authorization; 

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        logger.warn("JWT Middleware: No token provided in authorization header");
        return res.status(401).json({
            error:"No Token Provided"
        })
    }

    const token = authHeader?.split(' ')[1]; 

    try{
        const decode = jwt.verify(token  as string, process.env.JWT_SECRET as string);
        req.tenantId = (decode as any).tenantId;
        req.email = (decode as any).email;
        next();
    }catch(error:any){
        logger.warn("JWT Middleware: Verification failed", { error: error.message || error });
        return res.status(401).json({
            error:error
        })
    }
}