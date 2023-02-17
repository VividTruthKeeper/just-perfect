import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { comparePassword } from "../functions/comparePassword";
import { User } from "../models/user";
import { RequestValidationError } from "../errors/request-validation-error";
import { createToken } from "../functions/createToken";
import { IncorrectPasswordError } from "..//errors/user/incorrect-password-error";

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
    const sanitizedEmail = email.toLowerCase();
    const userByEmail = await User.findOne({
      where: { email: sanitizedEmail },
    });
    if (userByEmail) {
      result = await userByEmail.get();
      passwordCorrect = await comparePassword(password, result.hash);
    }

    if (passwordCorrect) {
      userByEmail?.update({ token: createToken(result.userId, result.email) });
      const { hash: _, ...userData } = result;
      res.status(200).send({
        status: "success",
        user: userData,
      });
    } else {
      throw new IncorrectPasswordError();
    }
  }
);

export { router as signinRouter };
