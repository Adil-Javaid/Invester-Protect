// authToken.js

let storedToken = "9b1f5e5a7d2e3d5e6b7a2c9d4a7b8e1c8f6d5e2c3f8e7a6c9b4f3a2c1d9e4f5"; // Token stored in memory

// Function to verify the provided token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  console.log("Token:", token);// Token from request headers


  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Token required.' });
  }

  // Compare the provided token with the stored token in memory
  if (token === storedToken) {
    console.log(token)
    next(); // Token is valid, proceed to the next middleware or route handler
  } else {
    return res.status(403).json({ message: 'Invalid token.' });
  }
}

module.exports = {
  authenticateToken,
};
