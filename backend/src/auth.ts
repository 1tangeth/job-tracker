import jwt from "jsonwebtoken"
import {Request, Response, NextFunction} from "express";

export function requireAuth (req: Request, res : Response, next:NextFunction) {
    const header = req.headers.authorization; // gets auth info from http request
    if (!header) {
        res.status(401).json({error : "missing token"})
        return;
    }
    
    const token = header.replace("Bearer ", "");    
    try {
        // extracted ID because i got token from header -> get userId -> put into request
        const verify = jwt.verify(token, process.env.JWT_SECRET as string) as {userId : string};
        (req as any).userId = verify.userId;
        next();
    } catch {
        res.status(401).json({error : "invalid token"});
    }
}