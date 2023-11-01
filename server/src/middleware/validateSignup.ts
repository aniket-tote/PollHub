import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateSignup = [
  body("name", "Enter a valid name (more than 3 characters)").isLength({
    min: 3,
  }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password is too short").isLength({ min: 4 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
