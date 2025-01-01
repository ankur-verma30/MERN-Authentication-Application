import jwt from "jsonwebtoken";

// Middleware for user authentication
const userAuth = async (request, response, next) => {
  try {
    // Access the token from cookies
    const token = request.cookies.token;

    if (!token) {
      return response.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    // Verify the token and decode it
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      request.body.userId = tokenDecode.id;
    } else {
      return response
        .status(401)
        .json({ success: false, error: "Invalid token, authorization denied" });
    }

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: "Token verification failed",
      error: error.message,
    });
  }
};

export default userAuth;
