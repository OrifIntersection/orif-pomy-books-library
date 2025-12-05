import express from "express"; 
import { login, signup, protect } from "../handlers/authHandler.js";

const router = express.Router();

router.post("/login", login);           // /api/v1/collaborators/login
router.post("/signup", signup);         // /api/v1/collaborators/signup

export default router;