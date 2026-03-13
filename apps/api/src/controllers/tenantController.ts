import { Request, Response } from "express";

export function generateApiKey(req:Request, res:Response){
     console.log("tenantId",req.tenantId);
        console.log("email",req.email);
        return res.status(200).json({
            tenantId:req.tenantId,
            email:req.email
        })
}