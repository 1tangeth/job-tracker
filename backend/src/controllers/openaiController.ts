import OpenAI from "openai";
import {Router} from "express"
import { db } from "../db";
import { requireAuth } from "../auth";

export const openaiRouter= Router();
const openai = new OpenAI({ baseURL: process.env.OPENAI_BASE_URL });

openaiRouter.post("/parse-job", requireAuth, async(req, res) => {
    const {text, resumeText} = req.body;
    const resumeContext = resumeText
        ? `\n\nThe candidate's resume:\n${resumeText}\n\nIn "notes", briefly mention how well their background fits this role.`
        : "";
    const completion = await openai.chat.completions.create( {
    model: "claude-haiku-4-5-20251001",
    messages : [
            // the instructions for how the assistant should behave — the rules
            {role : "system", content : `Extract structured data from job postings. Respond with ONLY a raw JSON object, no markdown code fences, no explanation, matching this exact shape: { "company": string, "role": string, "status": "applied", "notes": string }. "notes" should be a 1-2 sentence summary of the role.${resumeContext}`},
            // e actual content/material being acted on
            {role : "user", content : text},
            ],
    });

    const content = completion.choices[0].message.content;
    if (!content) {
        return res.status(500).json({ error: "No response from AI" });
    }
    // the model sometimes wraps its answer in a ```json ... ``` fence despite being told not to; strip it before parsing
    const cleaned = content.trim().replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
    const result = JSON.parse(cleaned);
    res.json(result);
})










