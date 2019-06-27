import jwt from "jsonwebtoken";

import { Logger } from "../../utils";

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const student = (req, res, next) => {
  const logger = Logger("AuthCheck:Student");

  const TOKEN = req.header("X-Auth");

  if (TOKEN) {
    const decoded = jwt.decode(TOKEN);

    if (decoded.username) {
      const verified = jwt.verify(TOKEN, process.env.ADMIN_SALT);

      if (verified) {
        return next();
      }
    }

    if (decoded.studentID) {
      const verified = jwt.verify(TOKEN, process.env.STUDENT_SALT);

      if (verified) {
        return next();
      }
    }
  }

  return res.status(401).json({ status: false, message: "Access denied -> pwnx.js:22:06" });
};

/**
 * @param {Request} req - Request class from express
 * @param {Response} res - Response class from express
 */
export const admin = (req, res, next) => {
  const logger = Logger("AuthCheck:Admin");

  const TOKEN = req.header("X-Auth");

  if (TOKEN) {
    const decoded = jwt.decode(TOKEN);

    if (decoded.username) {
      const verified = jwt.verify(TOKEN, process.env.ADMIN_SALT);

      if (verified) {
        return next();
      }
    }
  }

  return res.status(401).json({ status: false, message: "Access denied -> pwnx.js:22:06" });
};
