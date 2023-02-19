import express from "express";
import { TokenRequiredError } from "../../errors/user/token-required-error";
import { UserNotFound } from "../../errors/user/user-not-found";
import { authVerify } from "../../functions/auth-verify";
import { User } from "../../models/user";

const router = express.Router();

router.get("/api/users/currentUser", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new TokenRequiredError();
  }

  const decodedToken = await authVerify(token);
  const { userId } = decodedToken;

  const userByUserId = await User.findOne({ where: { userId: userId } });
  if (userByUserId) {
    const { hash: _, ...userData } = userByUserId.get();
    res.status(200).send({
      status: "success",
      user: userData,
    });
  } else {
    throw new UserNotFound();
  }
});

export { router as currentUserRouter };
