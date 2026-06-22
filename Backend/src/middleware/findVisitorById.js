import Visitor from "../models/Visitor.js";
import { errorResponse } from "../utils/response.js";

/**
 * Middleware that finds a visitor by :id param and attaches it to req.visitor.
 * Returns 400 if id is missing, 404 if visitor not found.
 */
const findVisitorById = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorResponse(res, "id required", 400);
  }

  const visitor = await Visitor.findById(id);

  if (!visitor) {
    return errorResponse(res, "Visitor not found", 404);
  }

  req.visitor = visitor;
  next();
};

export default findVisitorById;
