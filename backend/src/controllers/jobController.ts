import {Router} from "express"
import { db } from "../db";
import { requireAuth } from "../auth";

export const jobRouter = Router();

jobRouter.get("/jobs", requireAuth, async (req,res) => {
    // TODO: use adzuna instead of remote ok first
    const response = await fetch ("https://remoteok.com/api");
    const data = await response.json();
    // data[0] is a legal notice, not a job listing - skip it. Only forward the fields
    // the frontend needs (the full "description" field is huge HTML per listing).
    const jobs = data.slice(1, 21).map((job: any) => ({
        id: job.id,
        company: job.company,
        position: job.position,
        url: job.url,
        tags: job.tags,
    }));
    res.json(jobs);
})
