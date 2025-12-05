import AppError from "../utils/AppError";
import { Collaborator } from "../models/collaboratorModel.js";

export async function protect(req, res, next) {
    const { id } = req.body;

    if (!id) throw new AppError("you must be logged in to access this route", 401);

    const currentUser = await Collaborator.findById(id);

    req.user = currentUser;
    next();
}

export async function signup(req, res, next) {

    //
    //    Create a new collaborator
    //   

    const { name, email } = req.body;
    if (!name || !email) throw new AppError("an email and a name must be provided.", 400);

    const createdCollaborator = await Collaborator.create({ Name: name, Email: email });

    res.status(201).json({
        status: "success",
        data: createdCollaborator,
    });
}

export async function login(req, res, next) {
    const { email } = req.body;

    if (!email) throw new AppError("an email must be provided", 400);


    const user = await Collaborator.find().where("Email").equals(email.toLowerCase())

    res.status(200).json({
        status: "success",
        message: `user with email: ${email} has logged in successfully`,
        data: user._id
    })
}

