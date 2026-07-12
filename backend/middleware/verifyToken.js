import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// Verifies the JWT stored in the HttpOnly `access_token` cookie.
// On success attaches the decoded payload ({ _id, id, role }) to req.user.
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized. Please log in."));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(401, "Invalid or expired session. Please log in again."));
    }
    req.user = decoded;
    next();
  });
};

// Restricts a route to the given roles. Must run after verifyToken.
export const verifyRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(errorHandler(401, "Unauthorized. Please log in."));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(errorHandler(403, "Forbidden. You do not have permission to perform this action."));
    }
    next();
  };
