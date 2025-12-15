import express from "express"; 
import { login, signup, attachCollaborator, requireCollaborator } from "../handlers/authHandler.js";
import { getCollaborator } from "../handlers/collaboratorsHandler.js";

const router = express.Router();

router.post("/login", login);           // /api/v1/collaborators/login
router.post("/signup", signup);         // /api/v1/collaborators/signup
router.get("/me", attachCollaborator, requireCollaborator, getCollaborator);  // /api/v1/collaborators/me

// need to protect route "/:id" + get, but get routes cannot handle auth at the moment.
router.route("/:id").get(attachCollaborator, requireCollaborator, getCollaborator)

export default router;