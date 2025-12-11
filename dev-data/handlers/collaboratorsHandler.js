import { Collaborator } from "../models/collaboratorModel.js";
import { Loan } from "../models/loanModel.js";
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

  const collaboratorId = req.params.id;

  const currentUser = await Collaborator.findById(collaboratorId);

  if (!currentUser)
    throw new AppError(
      "You are not logged in, or your account no longer exists.",
      401
    );

  const activeLoans = await Loan.find()
    .where("Collaborator")
    .equals(currentUser._id)
    .where("Returned")
    .equals(false)
    .populate({ path: "Book" })
  
  res.status(200).json({
    status: "success",
    message: `Details for user with ID: ${currentUser._id} have been sent successfully`,
    data: { currentUser, activeLoans },
  });
}


