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
  //    Save to book and collaborator records
  //    Only the Book ID is required
  //    ReturnDays is optional, defaults to two weeks.
  //    Collaborator ID is set onto the request, after authProtect
  //

  const { BookID, ReturnDays } = req.body;
  const CollaboratorID = req.collaboratorId;

  if (!BookID || !CollaboratorID) throw new AppError("a book and a collaborator are required to create a loan.", 400);

  const book = await Book.findById(BookID);
  if (!book) throw new AppError(`No book found with ID: ${BookID}`, 404);

  const collaborator = await Collaborator.findById(CollaboratorID);
  if (!collaborator) throw new AppError(`No collaborator found with ID: ${CollaboratorID}`, 404);

  let document = new Loan({ Book: BookID, Collaborator: CollaboratorID });
  if (ReturnDays) document.EndDate = new Date(Date.now() + ReturnDays * 24 * 60 * 60 * 1000);

  const newLoan = await document.save();

  // Update book and collaborator records
  book.ActiveLoan.push(newLoan._id);
  await book.save();

  collaborator.Loans.push(newLoan._id);
  await collaborator.save();

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
