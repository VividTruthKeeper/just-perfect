import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

// Functions
import createToken from "../functions/createToken";

// Services
import { loginUser } from "../services/user.service";

// Model
import User from "../models/user.model";

// Errors
import { RequestValidationError } from "../errors/request-validation-error";
import { UserError } from "../errors/user-error";

const router = express.Router();

router.post(
  "/api/users/signIn",
  [body("email").isEmail().withMessage("Invalid email")],
  async (req: Request, res: Response) => {
    // req params error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    let passwordCorrect: boolean = false;
    let result;
    const sanitizedEmail: string = email.toLowerCase();
    {passwordCorrect} = await loginUser({ email: sanitizedEmail, password });

    if (passwordCorrect) {
      const token = createToken(sanitizedEmail);
    }
  }
);

export { router as signinRouter };
