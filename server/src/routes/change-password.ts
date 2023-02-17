import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user";
import { RequestValidationError } from "../errors/request-validation-error";
import { authVerify } from "../functions/auth-verify";
import { TokenRequiredError } from "../errors/user/token-required-error";
import { UserNotFound } from "../errors/user/user-not-found";
import { hashPassword } from "../functions/hashPassword";
import { createToken } from "../functions/createToken";
import { comparePassword } from "../functions/comparePassword";
import { OldPasswordError } from "../errors/user/old-password-error";

const router = express.Router();

router.put(
  "/api/users/changePassword",
  [
    body("password")
      .trim()
      .isLength({ min: 8, max: 64 })
      .matches(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$`)
      .withMessage(
        "Password must be between 8 and 64 characters, must contain 1 number, 1 uppercase and 1 lowercase letters, and 1 special character"
      ),
  ],
  async (req: Request, res: Response) => {
    // req params error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { token } = req.query;

    if (!token) {
      throw new TokenRequiredError();
    }

    const decodedToken = await authVerify(token);
    const { userId, email } = decodedToken;

    const userByUserId = await User.findOne({ where: { userId: userId } });
    const { password } = req.body;
    if (await comparePassword(password, userByUserId?.get().hash)) {
      throw new OldPasswordError();
    }

    if (userByUserId) {
      const updatedUser = await userByUserId?.update({
        hash: await hashPassword(password),
        token: createToken(userId, email),
        updatedAt: Date.now(),
      });

      const { hash: _, ...userData } = updatedUser.get();

      res.status(200).send({
        status: "success",
        user: await userData,
      });
    } else {
      throw new UserNotFound();
    }
  }
);

export { router as changePasswordRouter };
