import { NextFunction , Request, Response} from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"


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
        return res.status(401).json({
            error:error
        })
    }



}