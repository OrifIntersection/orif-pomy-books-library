import { Collaborator } from "../models/collaboratorModel.js";
import AppError from "../utils/AppError.js";

export async function postCollaborator(req, res, next) {
    
  //
  //    Create a new collaborator
  //   

    const { Name, Email } = req.body;
    if (!Name || !Email) throw new AppError("An email and a name must be provided.", 400);

    const createdCollaborator = await Collaborator.create({ Name, Email });
    
    res.status(201).json({
      status: "success",
      data: createdCollaborator,
    });
}