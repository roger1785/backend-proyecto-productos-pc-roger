import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Falta el token" });
    }

    if (!authHeader.startsWith("Bearer")) {
      return res.starus(401).json({ message: "Token invalido" });
    }

    // Brearer token
    const [, token] = authHeader.split(" ");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalido" });
  }
};
