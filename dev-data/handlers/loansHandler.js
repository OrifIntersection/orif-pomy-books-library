import { Loan } from "../models/loanModel.js";
import { Book } from "../models/bookModel.js";
import { Collaborator } from "../models/collaboratorModel.js";
import AppError from "../utils/AppError.js";

export async function getAllLoans(req, res, next) {

  //
  //  Return all loans
  //  Accepts query for Returned true/false
  //

  const { returned } = req.query;

  let loansQuery = Loan.find();

  // if returned exists as string "true" or "false", finds the loans that are "true" returned, or "false" not returned.
  if (returned) loansQuery = loansQuery.find({ Returned: returned === "true" })

  const loans = await loansQuery;

  if (loans.length === 0) throw new AppError("No active loans found.", 404);

  return res.status(200).json({
    status: "success",
    message: `Active loans retrieved successfully.`,
    results: loans.length,
    data: loans,
  });
}

export async function postLoan(req, res, next) {

  //
  //    Create a new loan
  //    Only the Book ID is required
  //    ReturnDays is optional, defaults to two weeks.
  //    Collaborator ID is set onto the request after authProtect
  //    => user must be logged in to create a loan
  //

  const { BookID, EndDate } = req.body;
  const CollaboratorID = req.collaboratorId;

  if (!BookID || !CollaboratorID) throw new AppError("a book and a collaborator are required to create a loan.", 400);

  let document = new Loan({ Book: BookID, Collaborator: CollaboratorID });
  if (EndDate) document.EndDate = new Date(EndDate);

  const newLoan = await document.save();

  return res.status(201).json({
    status: "success",
    message: "Loan created successfully.",
    data: newLoan,
  });
}

export async function patchLoan(req, res, next) {

  //
  //  Mark a loan as returned
  //  Also need to implement extending loan functionality
  //

  const { id } = req.params;

  const loan = await Loan.findByIdAndUpdate(id, { Returned: true }, { new: true });
  if (!loan) throw new AppError(`No loan found with ID: ${id}`, 404);

  return res.status(200).json({
    status: "success",
    message: `Loan with ID: ${id} marked as returned.`,
    data: loan,
  });
}
