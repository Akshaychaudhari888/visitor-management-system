/**
 * Shared response helpers to standardize API responses.
 */

export const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

export const errorResponse = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message });
};

export const paginatedResponse = (res, { data, page, limit, totalCount }) => {
  return res.status(200).json({
    success: true,
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    data,
  });
};
