import { Collaborator } from "../models/collaboratorModel.js";
import AppError from "../utils/AppError.js";

//
//  Only get and getAll functions for collaborators
//  Other functions should be handled via authHandler.js
//

export async function getAllCollaborators(req, res, next) {
  //
  //  Return all collaborators
  //
}

export async function getCollaborator(req, res, next) {

  // 
  //  Logic should ideally check if the requester is the same as the requested collaborator
  //  Render other user profile page or own profile page accordingly on front end...
  //

  //  If there is no :id param, we assume the user wants their own data
  //  (the collaborators route "/me" expects no params)
  
  let collaboratorId = req.params.id || req.collaboratorId;

  const user = await Collaborator.findById(collaboratorId);

  if (!user)
    throw new AppError(
      "This account doesn't exist!",
      401
    );

  res.status(200).json({
    status: "success",
    message: `Details for user with ID: ${user._id} have been sent successfully`,
    data: user,
  });
}


