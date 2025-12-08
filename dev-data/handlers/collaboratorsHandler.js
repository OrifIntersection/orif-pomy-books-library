import { Collaborator } from "../models/collaboratorModel.js";
import AppError from "../utils/AppError.js";

export async function getCollaborator(req, res, next) {

  // temporary way to circumnavigate auth.
  const collaboratorId = req.userId ? req.userId : req.params.id;

  const currentUser = await Collaborator.findById(collaboratorId)
    .populate("AddedBooks")
    .populate("OwnedBooks")
    .populate("Loans");

  if (!currentUser)
    throw new AppError(
      "You are not logged in, or your account no longer exists.",
      401
    );

  res.status(200).json({
    status: "success",
    message: `Details for user with ID: ${currentUser._id} have been sent successfully`,
    data: currentUser,
  });
}
