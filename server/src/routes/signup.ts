import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

// Errors
import { RequestValidationError } from "../errors/request-validation-error";
import { UserError } from "../errors/user-error";

// Services
import { findUser, createUser } from "../services/user.service";
import createToken from "../functions/createToken";
import sanitizeUser from "../functions/sanitizeUser";

const router = express.Router();

router.post(
  "/api/users/signUp",
  [
    body("firstName")
      .isLength({ min: 3, max: 20 })
      .withMessage("First name must be between 3 and 20 characters"),
    body("lastName")
      .isLength({ min: 3, max: 20 })
      .withMessage("Last name must be between 3 and 20 characters"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 64 })
      .matches(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$`)
      .withMessage(
        "Password must be between 8 and 64 characters, must contain 1 number, 1 uppercase and 1 lowercase letters, and 1 special character"
      ),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { firstName, lastName, email, password } = req.body;
    const sanitizedEmail: string = email.toLowerCase();

    const userWithEmail = await findUser({ email: sanitizedEmail });

    if (userWithEmail !== null) {
      throw new UserError("User already exists", 409);
    }

    const token = await createToken(sanitizedEmail);
    const newUser = await createUser({
      email: sanitizedEmail,
      firstName,
      lastName,
      password,
      token,
    });

    const userJSON = sanitizeUser(newUser);

    res.status(200).send({
      status: "success",
      user: userJSON,
    });
  }
);

export { router as signupRouter };
