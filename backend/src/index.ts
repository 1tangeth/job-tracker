import express from "express"; // default export
import cors from "cors";
import { db } from "./db";
import jwt from "jsonwebtoken"
import bycrypt from "bcryptjs";
import { requireAuth } from "./auth";
import "dotenv/config";

const app = express();
const PORT = 3000;
app.use(express.json()) // parse incoming json from request.body
app.use(cors({origin: "http://localhost:5173"})); // where my frontend is



app.get("/health", (req, res) => {
    res.json({status:"ok"});
});

app.get("/hello", (req, res) => {
    res.json({message : "hello"});
})


app.get("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await db.user.findUnique({where : {email}});

    if (!user)
        return res.status(401).json({error : "user not found"});

    const valid = await bycrypt.compare(password, user.passwordHash);
    if (!valid)
        return res.status(401).json({error : "invalid passward"});
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET as string, {expiresIn: "7d"});
    res.json({token});
})


app.post("/signup", async(req ,res) => {
    const{email, password} = req.body;
    if (!email || !password)
        return res.status(401).json({error : "invalid input"});
    if (password.length < 8) 
        return res.status(401).json({error : "enter at least 8 characters"});
    
    const passwordHash = await bycrypt.hash(password, 10);
    const user = await db.user.create({
        data : {email, passwordHash},
    });
    res.json({id : user.id, email: user.email});

})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});