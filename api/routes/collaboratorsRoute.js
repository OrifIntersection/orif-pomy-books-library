import express from "express";
import {
  login,
  signup,
  modify,
  authenticate,
  deleteAccount,
  attachCollaborator,
  requireCollaborator,
} from "../handlers/authHandler.js";
import { getCollaborator } from "../handlers/collaboratorsHandler.js";

const router = express.Router();

router.post("/login", login); // /api/v1/collaborators/login
router.post("/signup", signup); // /api/v1/collaborators/signup
router.get("/auth/:auth", authenticate); // /api/v1/collaborators/auth

router
  .route("/me") // /api/v1/collaborators/me
  .get(attachCollaborator, requireCollaborator, getCollaborator)
  .delete(attachCollaborator, requireCollaborator, deleteAccount)
  .patch(attachCollaborator, requireCollaborator, modify);

router
  .route("/:id")
  .get(attachCollaborator, requireCollaborator, getCollaborator);

export default router;
