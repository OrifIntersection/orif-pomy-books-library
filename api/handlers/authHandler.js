import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { Collaborator } from "../models/collaboratorModel.js";
import validator from "validator";
import { parseWhitelist } from "../utils/emailHosts.js";

import { Loan } from "../models/loanModel.js";

export async function attachCollaborator(req, res, next) {
  //
  //  Attach collaborator ID to request if valid token is provided
  //  It allows us to get the collaborator ID for logged in users, even on routes that don't require authentication
  //

  const token = req.get("Auth-Token");
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

  let { name, email } = req.body;

  if (!name) throw new AppError("NO_NAME");
  if (!email) throw new AppError("NO_EMAIL");

  if (!validator.isEmail(email, { host_whitelist: parseWhitelist() }))
    throw new AppError("INVALID_EMAIL");

  email = validator.normalizeEmail(email, { all_lowercase: true });

  const emailExists = await Collaborator.exists({ Email: email });
  const nameExists = await Collaborator.exists({ Name: name });

  if (emailExists) throw new AppError("EMAIL_EXISTS");
  if (nameExists) throw new AppError("NAME_EXISTS");

  const createdCollaborator = await Collaborator.create({
    Name: name,
    Email: email,
  });

  const authToken = jwt.sign(
    { id: createdCollaborator._id },
    process.env.JWTSECRET,
    { expiresIn: "1d" }
  );

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

  let { email } = req.body;

  if (!email) throw new AppError("NO_EMAIL");
  if (!validator.isEmail(email)) throw new AppError("INVALID_EMAIL");

  // could cause problems for case-sensitive emails
  email = validator.normalizeEmail(email, { all_lowercase: true });

  const collaborator = await Collaborator.findOne()
    .where("Email")
    .equals(email);

  if (!collaborator) throw new AppError("UNFOUND_EMAIL");

  const authToken = jwt.sign({ id: collaborator._id }, process.env.JWTSECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({
    status: "success",
    message: `collaborator with email: ${email} has logged in successfully`,
    auth: { name: collaborator.Name, authToken },
  });
}

export async function modify(req, res, next) {
  const collaboratorId = req.collaboratorId;
  let { name, email } = req.body;

  if (!collaboratorId) throw new AppError("UNAUTHORIZED");
  if (!name) throw new AppError("NO_EMAIL");
  if (!email) throw new AppError("NO_NAME");
  if (!validator.isEmail(email, { host_whitelist: parseWhitelist() }))
    throw new AppError("INVALID_EMAIL");

  // could cause problems for case-sensitive emails
  validator.normalizeEmail(email, { all_lowercase: true });

  const nameExists = await Collaborator.findOne({ Name: name });
  const emailExists = await Collaborator.findOne({ Email: email });

  if (nameExists && nameExists._id.toString() !== collaboratorId.toString())
    throw new AppError("NAME_EXISTS");

  if (emailExists && emailExists._id.toString() !== collaboratorId.toString())
    throw new AppError("EMAIL_EXISTS");

  await Collaborator.findByIdAndUpdate(collaboratorId, {
    Name: name,
    Email: email,
  });

  const authToken = jwt.sign({ id: collaboratorId }, process.env.JWTSECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({
    status: "success",
    message: `collaborator with id: ${collaboratorId} has been modified successfully.`,
    auth: { name, authToken }, // return new name & jwt on auth for frontend consistency
  });
}

export async function deleteAccount(req, res, next) {
  // deletes the collaborator account
  // checks if any loans are active first

  const collaboratorId = req.collaboratorId;
  if (!collaboratorId) throw new AppError("UNAUTHORIZED");

  const checkLoans = await Loan.exists({
    Collaborator: collaboratorId,
    Returned: false,
  });

  if (checkLoans) throw new AppError("CANNOT_DELETE_ACCOUNT_WITH_LOANS");

  await Collaborator.findByIdAndDelete(collaboratorId);

  res.status(200).json({
    status: "success",
    message: "This collaborator has been deleted",
  });
}
