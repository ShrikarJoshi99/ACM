const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Always log the full error server-side
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  // In production, hide internal error details from the client
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Server Error";

  res.status(statusCode).json({
    success: false,
    message
  });
};

export default errorMiddleware;