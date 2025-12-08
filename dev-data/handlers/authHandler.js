import AppError from "../utils/AppError.js";
import { Collaborator } from "../models/collaboratorModel.js";

export async function protect(req, res, next) {

  if (!req.body?.id)
    throw new AppError("you must be logged in to access this route. Furthermore, GET routes cannot have a body.", 401);

  const { id } = req.body;

  const currentCollaborator = await Collaborator.findById(id);

  req.collaboratorId = currentCollaborator._id;

  next();
}

export async function signup(req, res, next) {
  //
  //    Create a new collaborator
  //

  const { name, email } = req.body;

  if (!name || !email)
    throw new AppError("an email and a name must be provided.", 400);

  const createdCollaborator = await Collaborator.create({
    Name: name,
    Email: email,
  });

  res.status(201).json({
    status: "success",
    data: createdCollaborator,
  });
}

export async function login(req, res, next) {
  const { email } = req.body;

  if (!email) throw new AppError("an email must be provided", 400);

  const collaborator = await Collaborator.findOne()
    .where("Email")
    .equals(email.toLowerCase());

  if (!collaborator) throw new AppError(`no collaborator found with email: ${email}`, 404);

  res.status(200).json({
    status: "success",
    message: `collaborator with email: ${email} has logged in successfully`,
    data: { id: collaborator._id, name: collaborator.Name },
  });
}
