class ICS {
  constructor(populatedLoan) {
    this.loan = populatedLoan;
  }

  create() {
    const event = {
      start: this.loan.EndDate,
      duration: { days: 1 },
      title: `Rendre Emprunt: ${this.loan.Book.Title}`,
      location: this.loan.Book.Location,
      status: "TENTATIVE",
      method: "PUBLISH",
      organizer: {
        name: "Bibliothèque",
        email: "noreply@bibliotheque.applications.ws",
      },
      attendees: [
        {
          name: this.loan.Collaborator.Name,
          email: this.loan.Collaborator.Email,
        },
      ],
    };

    return event;
  }
}

export default ICS;
