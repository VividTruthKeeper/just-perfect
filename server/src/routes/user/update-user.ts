import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../../models/user";
import { RequestValidationError } from "../../errors/request-validation-error";
import { authVerify } from "../../functions/auth-verify";
import { TokenRequiredError } from "../../errors/user/token-required-error";
import { UserNotFound } from "../../errors/user/user-not-found";
import { OldNameError } from "../../errors/user/old-name-error";

const router = express.Router();

router.put(
  "/api/users/updateUser",
  [
    body("name")
      .isLength({ min: 3, max: 20 })
      .withMessage("Name must be between 3 and 20 characters"),
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
    const { userId } = decodedToken;
    const { name } = req.body;

    const userByUserId = await User.findOne({ where: { userId: userId } });
    if (name === userByUserId?.get().name) {
      throw new OldNameError();
    }
    if (userByUserId) {
      const updatedUser = await userByUserId?.update({
        name: name,
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

export { router as updateUserRouter };
