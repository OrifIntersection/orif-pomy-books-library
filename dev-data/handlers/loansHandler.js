import { Loan } from "../models/loanModel.js";
import AppError from "../utils/AppError.js";

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
    message: `Loans retrieved successfully.`,
    results: loans.length,
    data: loans,
  });
}

export async function getLoan(req, res, next) {
  //
  //  Return a specific loan by ID
  //

  const { id } = req.params;

  const loanDoc = await Loan.findById(id)
    .populate("Book")
    .populate("Collaborator");
  if (!loanDoc) throw new AppError("UNFOUND_LOAN_ID");

  // Convert to object to add IsUserLoan property
  let loan = loanDoc.toObject({ virtuals: true, getters: true });

  // Mark if the loan belongs to the logged in user
  if (
    req.collaboratorId &&
    loanDoc.Collaborator._id.toString() === req.collaboratorId.toString()
  )
    loan.IsUserLoan = true;

  return res.status(200).json({
    status: "success",
    message: `Loan with ID: ${id} retrieved successfully.`,
    data: loan,
  });
}

export async function patchLoan(req, res, next) {
  //
  // Update EndDate of a loan
  // Only EndDate can be modified
  //
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
  if (!collaboratorId) throw new AppError("UNAUTHORIZED");

  // logic to check if the book is already on loan
  const existingLoan = await Loan.exists({ Book: bookId, Returned: false });
  if (existingLoan) throw new AppError("CANNOT_LOAN_WHILE_LOANED");

  let loan = new Loan({ Book: bookId, Collaborator: collaboratorId });
  if (!endDate) throw new AppError("NO_DATE");
  if (new Date(endDate) < Date.now()) throw new AppError("INVALID_DATE");

  loan.EndDate = new Date(endDate);
  const newLoan = await loan.save();

  return res.status(201).json({
    status: "success",
    message: "Loan created successfully.",
    data: newLoan,
  });
}

export async function deleteLoan(req, res, next) {
  //
  //  Mark a loan as returned
  //  Should check that the requester's ID matches the loan's Collaborator ID
  //

  const { id } = req.params;

  const loan = await Loan.findById(id);

  if (!loan) throw new AppError("UNFOUND_LOAN_ID");
  if (loan.Returned) throw new AppError("CANNOT_DELETE_DELETED_LOAN");

  if (loan.Collaborator._id.toString() !== req.collaboratorId.toString())
    throw new AppError("CANNOT_RETURN_OTHER_LOAN");

  loan.Returned = true;
  await loan.save();

  return res.status(200).json({
    status: "success",
    message: `Loan with ID: ${id} marked as returned.`,
  });
}
