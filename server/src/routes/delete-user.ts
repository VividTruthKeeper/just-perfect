import express, { Request, Response } from "express";
import { body } from "express-validator";
import { comparePassword } from "../functions/comparePassword";
import { TokenRequiredError } from "../errors/user/token-required-error";
import { UserNotFound } from "../errors/user/user-not-found";
import { authVerify } from "../functions/auth-verify";
import { User } from "../models/user";
import { IncorrectPasswordError } from "../errors/user/incorrect-password-error";

const router = express.Router();

router.delete(
  "/api/users/deleteUser",
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
    const { token } = req.query;
    const { password } = req.body;

    if (!token) {
      throw new TokenRequiredError();
    }

    const decodedToken = await authVerify(token);
    const { userId } = decodedToken;

    const userByUserId = await User.findOne({ where: { userId: userId } });
    if (userByUserId) {
      if (!(await comparePassword(password, userByUserId.get().hash))) {
        throw new IncorrectPasswordError();
      }
      userByUserId.destroy();
      res.status(200).send({
        status: "success",
        message: "User deleted successfuly",
      });
    } else {
      throw new UserNotFound();
    }
  }
);

export { router as deleteUserRouter };
