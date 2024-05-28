import { config } from "../config.js";
import bcrypt from "bcrypt";

export const csrfCheck = (req, res, next) => {
  if (
    req.method === `GET` ||
    req.method === `OPTIONS` ||
    req.method === `HEAD`
  ) {
    return next();
  }

  const csrfHeader = req.get(`Dwitter-csrf-token`);

  if (!csrfHeader) {
    console.warn(
      'Missing required "Dwitter-csrf-token" header.',
      req.headers.origin
    );
    return res.status(403).json({ message: `Failed CSRF check` });
  }

  validateCsrfToken(csrfHeader) //
    .then((valid) => {
      if (!valid) {
        console.warn(
          `Value procided in "Dwitter-csrf-token" header does not validate.`,
          req.headers.origin,
          csrfHeader
        );
        return res.status(403).json({ message: "Failed CSRF check" });
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Somethin went wrong" });
    });
};

async function validateCsrfToken(scrfHeader) {
  return bcrypt.compare(config.csrf.plainToekn, scrfHeader);
}
