import {Router} from "express"

import { db } from "../db";
import { requireAuth } from "../auth";

export const applicationRouter = Router();

applicationRouter.post("/applications", requireAuth, async(req, res) =>{
    // stop checking types on its value, treat as any
    const userId = (req as any).userId;
    const {company, role, status, notes} = req.body;
    const application = await db.application.create({
        data: {userId, company, role, status, notes}
    })
    // return application id by default?
    res.json(application);
})

applicationRouter.get("/applications", requireAuth, async(req, res) => {
    const userId = (req as any).userId;
    // const id = req.params;
    const [applications] = await Promise.all([
        db.application.findMany({
            where : {userId : userId as string},
            
        })
    ]);

    res.json({data : applications});
})

// patch status
applicationRouter.patch("/applications/:id", requireAuth, async(req, res) => {
    const userId = (req as any).userId;
    const { id } = req.params;
    const {status} = req.body;
    const result = await db.application.updateMany({
        where : {
            userId : userId as string,
            id : id as string,
        }, data : {
            status : status,
        }

    })

    if (result.count === 0) {
        return res.status(404).json({error : "no applications matching id"});
    }

    res.json(result);

})

// delete an applicaiton
applicationRouter.delete("/applications/:id", requireAuth, async(req, res) => {
    const userId = (req as any).userId;
    const {id} = req.params;
    await db.application.deleteMany ({where : {id : id as string, userId}});
    res.status(204).send();
})