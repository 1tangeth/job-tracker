import OpenAI from "openai";
import {Router} from "express"

import { requireAuth } from "../auth";

export const openaiRouter= Router();
const openai = new OpenAI();

openaiRouter.post("/parse-job", requireAuth, async(req, res) => {
    const {text} = req.body;
    const completion = await openai.chat.completions.create( {
    model: "gpt-5-codex",
    response_format: {type : "json_object"},
    messages : [
        {role : "system", content : "Extract structured data from job postings. Respoond with JSON only, matching this shape: shape: { \"company\": string, \"role\": string, \"status\": \"applied\", \"notes\": string }. \"notes\" should be a 1-2 sentence summary of the role."},
        {role : "user", content : text},
        ],
    });

    const content = completion.choices[0].message.content;
    if (!content) {
        return res.status(500).json({ error: "No response from AI" });
    }
    const result = JSON.parse(content);
    res.json(result);
})










