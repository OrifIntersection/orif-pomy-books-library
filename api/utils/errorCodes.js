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
  MALFORMED_ID: {
    message:
      "L'identificateur fourni pour cette ressource est invalide. Veuillez vérifier les données.",
    statusCode: 400,
  },
  INVALID_EMAIL: {
    message:
      "L'email fourni est invalide, notez que vous devez utiliser votre email orif. @formation.orif.ch, @orif.ch, ou autre.",
    statusCode: 400,
  },
  INVALID_NAME: {
    message:
      "Le nom d'utilisateur fourni est invalide, veuillez vérifier votre saisi.",
    statusCode: 400,
  },
  INVALID_SEARCH: {
    message:
      "Le critère de recherche fourni est invalide, veuillez vérifier votre saisi.",
    statusCode: 400,
  },
  INVALID_SORT: {
    message:
      "Le critère de tri fourni est invalide, veuillez vérifier votre saisi.",
    statusCode: 400,
  },
  INVALID_TITLE: {
    message:
      "Le titre de livre fourni est invalide, veuillez vérifier votre saisi.",
    statusCode: 400,
  },
  INVALID_AUTHOR: {
    message:
      "L'auteur de livre fourni est invalide, veuillez vérifier votre saisi.",
    statusCode: 400,
  },
  INVALID_GENRE: {
    message:
      "Le genre de livre fourni est invalide, veuillez vérifier votre saisi.",
    statusCode: 400,
  },
  INVALID_SUBJECT: {
    message:
      "Le sujet de livre fourni est invalide, veuillez vérifier votre saisi.",
    statusCode: 400,
  },
  INVALID_LOCATION: {
    message:
      "L'emplacement de livre fourni est invalide, veuillez vérifier votre saisi.",
    statusCode: 400,
  },
  NO_BOOK_ID: {
    message: "Aucun identificateur de livre à été fourni.",
    statusCode: 400,
  },
  NO_LOAN_ID: {
    message: "Aucun identificateur d'emprunt à été fourni.",
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
  EMAIL_EXISTS: {
    message: "Un compte existe déjà avec cet email, veuillez choisir un autre.",
    statusCode: 400,
  },
  NAME_EXISTS: {
    message:
      "Un compte exist déjà avec ce nom d'utilisateur, veuillez choisir un autre.",
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
    message: "Il est impossible de rendre un emprunt qui a déjà été rendu.",
    statusCode: 403,
  },
  CANNOT_DELETE_DELETED_BOOK: {
    message: "Il est impossible de supprimer un livre qui a déjà été supprimé.",
    statusCode: 403,
  },
  CANNOT_RETURN_OTHER_LOAN: {
    message: "Vous ne pouvez pas rendre un emprunt qui n'est pas la votre.",
    statusCode: 403,
  },
  CANNOT_MODIFY_OTHER_LOAN: {
    message: "Vous ne pouvez pas modifier un emprunt qui n'est pas la votre.",
    statusCode: 403,
  },
  CANNOT_MODIFY_RETURNED_LOAN: {
    message: "Vous ne pouvez pas modifier un emprunt qui a déjà été rendu",
    statusCode: 403,
  },

  // 401 UNAUTHORIZED
  UNAUTHORIZED: {
    message: "Vous n'êtes pas identifié, veuillez login s'il vous plaît.",
    statusCode: 401,
  },
};
