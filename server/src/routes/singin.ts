import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

// Functions
import createToken from "../functions/createToken";
import sanitizeUser from "../functions/sanitizeUser";

// Services
import { assignToken, loginUser } from "../services/user.service";

// Model
import { IUserDocument } from "../models/user.model";

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
    let updatedUser: IUserDocument | null = null;
    const { email, password } = req.body;
    const sanitizedEmail: string = email.toLowerCase();
    const { passwordCorrect, user } = await loginUser({
      email: sanitizedEmail,
      password,
    });

    if (passwordCorrect) {
      const token: string = await createToken(sanitizedEmail);
      updatedUser = await assignToken(user, token);

      if (!updatedUser) {
        throw new UserError("Could not log you in", 500);
      }
      const userJSON = sanitizeUser(updatedUser.toJSON());
      userJSON.fullName = updatedUser.fullName;

      res.status(200).send({
        status: "success",
        user: userJSON,
      });
    } else {
      throw new UserError("Incorrect password", 401);
    }
  }
);

export { router as signinRouter };
