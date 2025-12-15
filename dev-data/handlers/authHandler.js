import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { Collaborator } from "../models/collaboratorModel.js";

export async function protect(req, res, next) {

  if (!req.headers.auth_token)
    throw new AppError("you must be logged in to access this route. No auth token found in headers.", 401);

  const authToken = req.headers.auth_token;

  const decoded = jwt.verify(authToken, process.env.JWTSECRET);
  if (!decoded)
    throw new AppError("invalid authentication token. Please log in again.", 401);

  const { id } = decoded;

  const currentCollaborator = await Collaborator.findById(id);
  req.collaboratorId = currentCollaborator._id;

  next();
}

export async function signup(req, res, next) {

  //
  //    Create a new collaborator
  //    For now, no password is required
  //    A jwt token is sent back in the response body
  //

  const { name, email } = req.body;

  if (!name || !email)
    throw new AppError("an email and a name must be provided.", 400);

  const createdCollaborator = await Collaborator.create({
    Name: name,
    Email: email,
  });

  const authToken = jwt.sign({ id: createdCollaborator._id }, process.env.JWTSECRET, { expiresIn: "1d" })

  res.status(201).json({
    status: "success",
    auth: { name: createdCollaborator.Name, authToken },
  });
}

export async function login(req, res, next) {

  //
  //    Log in a collaborator
  //    For now, login is done only via email
  //    In addition, the auth token is sent back in the response body
  //    This is to get around CORS issues with headers
  //    The front end stores this token in sessionStorage, and sends it back in a headers
  //


  const { email } = req.body;

  if (!email) throw new AppError("an email must be provided", 400);

  const collaborator = await Collaborator.findOne()
    .where("Email")
    .equals(email.toLowerCase());

  if (!collaborator) throw new AppError(`no collaborator found with email: ${email}`, 404);

  const authToken = jwt.sign({ id: collaborator._id }, process.env.JWTSECRET, { expiresIn: "1d" })
  if (!authToken) throw new AppError("error generating authentication token", 500);

  res.status(200).json({
    status: "success",
    message: `collaborator with email: ${email} has logged in successfully`,
    auth: { name: collaborator.Name, authToken }
  });
}
