export const ERROR_CODES = {
  // 404 NOT FOUND
  UNFOUND_BOOK_ID: {
    message: "Aucun livre trouvé avec l'identificateur de livre fourni.",
    statusCode: 404,
  },
  UNFOUND_BOOK_SEARCH: {
    message: "Aucun livre trouvé selon les critères de recherche.",
    statusCode: 404,
  },
  UNFOUND_LOAN_SEARCH: {
    message: "Aucun emprunt trouvé selon les critères de recherche.",
    statusCode: 404,
  },
  UNFOUND_EMAIL: {
    message: "Aucun collaborateur trouvé avec l'email fourni.",
    statusCode: 404,
  },
  UNFOUND_COLLAB_ID: {
    message: "Aucun collaborateur trouvé avec l'identificateur fourni.",
    statusCode: 404,
  },
  UNFOUND_LOAN_ID: {
    message: "Aucun emprunt trouvé avec l'identificateur d'emprunt fourni",
    statusCode: 404,
  },

  // 400 BAD REQUEST
  NO_BOOK_ID: {
    message: "Aucun identificateur de livre à été fourni.",
    statusCode: 400,
  },
  NO_TITLE: {
    message:
      "Des données incomplètes ont été fournies, il faut obligatoirement un titre.",
    statusCode: 400,
  },
  NO_AUTHOR: {
    message:
      "Des données incomplètes ont été fournies, il faut obligatoirement un auteur.",
    statusCode: 400,
  },
  NO_GENRE: {
    message:
      "Des données incomplètes ont été fournies, il faut obligatoirement un genre.",
    statusCode: 400,
  },
  NO_SUBJECT: {
    message:
      "Des données incomplètes ont été fournies, il faut obligatoirement un sujet.",
    statusCode: 400,
  },
  NO_LOCATION: {
    message:
      "Des données incomplètes ont été fournies, il faut obligatoirement un emplacement.",
    statusCode: 400,
  },
  NO_EMAIL: {
    message:
      "Des données incomplètes ont été fournies, il faut obligatoirement un email.",
    statusCode: 400,
  },
  NO_NAME: {
    message:
      "Des données incomplètes ont été fournies, il faut obligatoirement un nom.",
    statusCode: 400,
  },
  NO_DATE: {
    message:
      "Des données incomplètes ont été fournies, il faut obligatoirement une date.",
    statusCode: 400,
  },

  // 403 FORBIDDEN
  DELETED: {
    message: "Vous essayez d'accéder à des données qui ont été supprimées.",
    statusCode: 403,
  },
  CANNOT_DELETE_WHILE_LOANED: {
    message:
      "Il est impossible de supprimer un livre qui est actuellement emprunté",
    statusCode: 403,
  },
  CANNOT_LOAN_WHILE_LOANED: {
    message:
      "Il est impossible d'emprunter un livre qui est actuellement emprunté",
    statusCode: 403,
  },
  INVALID_DATE: {
    message:
      "Vous ne pouvez pas emprunter un livre pour le rendre dans le passé!",
    statusCode: 403,
  },
  CANNOT_DELETE_DELETED_LOAN: {
    message: "Il est impossible de rendre un emprunt qui à déjà été rendu.",
    statusCode: 403,
  },
  CANNOT_RETURN_OTHER_LOAN: {
    message: "Vous ne pouvez pas rendre un emprunt qui n'est pas a votre.",
    statusCode: 403,
  },

  // 401 UNAUTHORIZED
  UNAUTHORIZED: {
    message: "Vous n'êtes pas identifié, veuillez login s'il vous plaît.",
    statusCode: 401,
  },
};
