import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { Collaborator } from "../models/collaboratorModel.js";


export async function attachCollaborator(req, res, next) {

  //
  //  Attach collaborator ID to request if valid token is provided
  //  It allows us to get the collaborator ID for logged in users, even on routes that don't require authentication
  //

  const token = req.headers.auth_token;
  if (!token) return next();

  const decoded = jwt.verify(token, process.env.JWTSECRET);

  const collaborator = await Collaborator.findById(decoded.id);
  if (!collaborator) return next();

  req.collaboratorId = collaborator._id;

  next();
}

export async function requireCollaborator(req, res, next) {

  //
  // Require that a valid collaborator is logged in for a given route
  //

  if (!req.collaboratorId) throw new AppError("UNAUTHORIZED");

  next();
}

export async function signup(req, res, next) {

  //
  //    Create a new collaborator
  //    For now, no password is required
  //    A jwt token is sent back in the response body
  //

  const { name, email } = req.body;

  if (!name) throw new AppError("NO_EMAIL");
  if (!email) throw new AppError("NO_NAME");

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
  //    The front end stores this token in sessionStorage, and sends it back in a header
  //

  const { email } = req.body;

  if (!email) throw new AppError("NO_EMAIL");

  const collaborator = await Collaborator.findOne()
    .where("Email")
    .equals(email.toLowerCase());

  if (!collaborator) throw new AppError("UNFOUND_EMAIL");

  const authToken = jwt.sign({ id: collaborator._id }, process.env.JWTSECRET, { expiresIn: "1d" })

  res.status(200).json({
    status: "success",
    message: `collaborator with email: ${email} has logged in successfully`,
    auth: { name: collaborator.Name, authToken},
  });
}

export async function modify(req, res, next) {

  const collaboratorId = req.collaboratorId;
  const { name, email } = req.body;

  if (!collaboratorId) throw new AppError("UNAUTHORIZED");
  if (!name) throw new AppError("NO_EMAIL");
  if (!email) throw new AppError("NO_NAME");

  await Collaborator.findByIdAndUpdate(collaboratorId, { Name: name, Email: email });

  const authToken = jwt.sign({ id: collaboratorId }, process.env.JWTSECRET, { expiresIn: "1d" })

  res.status(200).json({
    status: "success",
    message: `collaborator with id: ${collaboratorId} has been modified successfully.`,
    auth: { name: name, authToken },     // return new name & jwt on auth for frontend consistency
  }) 
}

export async function deleteAccount(req, res, next) {

  // deletes the collaborator account
  // will not handle if any books are loaned by the collaborator
  // loan docs will point to empty IDs

  const collaboratorId = req.collaboratorId;
  if (!collaboratorId) throw new AppError("UNAUTHORIZED");

  await Collaborator.findByIdAndDelete(collaboratorId);

  res.status(200).json({
    status: "success",
    message: "This collaborator has been deleted"
  })
}

