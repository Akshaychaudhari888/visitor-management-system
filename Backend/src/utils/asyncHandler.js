/**
 * Wraps an async controller function to catch errors and return a
 * consistent 500 response, eliminating repetitive try-catch blocks.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  });
};

export default asyncHandler;
