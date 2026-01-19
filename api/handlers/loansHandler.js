import { Loan } from "../models/loanModel.js";
import AppError from "../utils/AppError.js";
import Transporter from "../utils/emailTransporter.js";
import * as ics from "ics";
import ICS from "../utils/CreateICS.js";

export async function getAllLoans(req, res, next) {
  //
  //  Return all loans
  //  Accepts query for Returned true                         "returned=true"
  //  Accepts query for loans of the logged in collaborator   "mine=true"
  //

  const { mine, returned } = req.query;

  let loansQuery = Loan.find().populate("Book").populate("Collaborator");

  // if "mine" query exists, finds the loans that belong to the logged in collaborator
  if (mine === "true")
    loansQuery = loansQuery.find({ Collaborator: req.collaboratorId });
  if (returned === "true") loansQuery = loansQuery.find({ Returned: true });
  if (returned === "false") loansQuery = loansQuery.find({ Returned: false });

  const loans = await loansQuery;

  if (loans.length === 0) throw new AppError("UNFOUND_LOAN_SEARCH");

  return res.status(200).json({
    status: "success",
    message: "Les emprunts ont été retrouvés.",
    results: loans.length,
    data: loans,
  });
}

export async function getLoan(req, res, next) {
  //
  //  Return a specific loan by ID
  //

  const { id } = req.params;

  if (!id) throw new AppError("NO_LOAN_ID");

  const loanDoc = await Loan.findById(id)
    .populate("Book")
    .populate("Collaborator");
  if (!loanDoc) throw new AppError("UNFOUND_LOAN_ID");

  return res.status(200).json({
    status: "success",
    message: "Cet emprunt à été retrouvé.",
    data: loanDoc,
  });
}

export async function patchLoan(req, res, next) {
  //
  // Update EndDate of a loan
  // Only EndDate can be modified
  //

  const { id } = req.params;
  const { endDate } = req.body;
  const collaboratorId = req.collaboratorId;

  if (!id) throw new AppError("NO_LOAN_ID");
  if (!collaboratorId) throw new AppError("UNAUTHORIZED");
  if (!endDate) throw new AppError("NO_DATE");
  if (new Date(endDate) < Date.now()) throw new AppError("INVALID_DATE");

  const loanDoc = await Loan.findById(id)
    .populate("Book")
    .populate("Collaborator");

  if (!loanDoc) throw new AppError("UNFOUND_LOAN_ID");
  if (loanDoc.Collaborator._id.toString() !== collaboratorId.toString())
    throw new AppError("CANNOT_MODIFY_OTHER_LOAN");
  if (loanDoc.Returned === true)
    throw new AppError("CANNOT_RETURN_RETURNED_LOAN");

  loanDoc.EndDate = new Date(endDate);
  const updatedLoan = await loanDoc.save();

  return res.status(201).json({
    status: "success",
    message: "Vous avez modifié votre emprunt. Redirection...",
    data: updatedLoan,
  });
}

export async function postLoan(req, res, next) {
  //
  //    Create a new loan
  //    Only the Book ID is required
  //    Collaborator ID is set onto the request after authProtect
  //    => user must be logged in to create a loan
  //

  const { bookId, endDate } = req.body;
  const collaboratorId = req.collaboratorId;

  if (!bookId) throw new AppError("NO_BOOK_ID");
  if (!endDate) throw new AppError("NO_DATE");
  if (!collaboratorId) throw new AppError("UNAUTHORIZED");
  if (new Date(endDate) < Date.now()) throw new AppError("INVALID_DATE");

  // logic to check if the book is already on loan
  const existingLoan = await Loan.exists({ Book: bookId, Returned: false });
  if (existingLoan) throw new AppError("CANNOT_LOAN_WHILE_LOANED");

  let loan = new Loan({ Book: bookId, Collaborator: collaboratorId });

  loan.EndDate = new Date(endDate);
  const newLoan = await loan.save();

  const populatedLoan = await Loan.findById(newLoan._id)
    .populate("Book")
    .populate("Collaborator");

  const calendarEvent = new ICS(populatedLoan).create();

  const { calendarError, calendarValue } = ics.createEvent(calendarEvent);

  if (calendarError) console.log(calendarError);

  const transporter = Transporter();

  const sentEmail = await transporter.sendMail({
    from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
    to: populatedLoan.Collaborator.Email,
    subject: "Votre emprunt",
    text:
      "Vous avec emprunté " +
      populatedLoan.Book.Title +
      " Voici un évênement que vous pouvez ajouter à votre calendrier si vous souhaitez.",
    icalEvent: {
      filename: "invitation.ics",
      method: "PUBLISH",
      content: calendarValue,
    },
  });

  console.log("Message sent: " + sentEmail.messageId);

  return res.status(201).json({
    status: "success",
    message:
      "Vous avez emprunté ce livre. Un email sera envoyé avec plus de détails. Redirection...",
    data: newLoan,
  });
}

export async function deleteLoan(req, res, next) {
  //
  //  Mark a loan as returned
  //  Should check that the requester's ID matches the loan's Collaborator ID
  //

  const { id } = req.params;
  const collaboratorId = req.collaboratorId;

  if (!id) throw new AppError("NO_LOAN_ID");
  if (!collaboratorId) throw new AppError("UNAUTHORIZED");

  const loan = await Loan.findById(id);

  if (!loan) throw new AppError("UNFOUND_LOAN_ID");
  if (loan.Returned) throw new AppError("CANNOT_DELETE_DELETED_LOAN");

  if (loan.Collaborator._id.toString() !== req.collaboratorId.toString())
    throw new AppError("CANNOT_RETURN_OTHER_LOAN");

  loan.Returned = true;
  const deletedLoan = await loan.save();

  return res.status(200).json({
    status: "success",
    message: "Vous avez rendu votre emprunt sur ce livre. Redirection...",
    data: deletedLoan,
  });
}
