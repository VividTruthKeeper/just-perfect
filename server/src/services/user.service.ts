import User, { IUserDocument } from "../models/user.model";
import { FilterQuery, QueryOptions } from "mongoose";
import { UserError } from "../errors/user-error";

export const createUser = async (input: any) => {
  return User.create(input);
};

export const findUser = async (
  query: FilterQuery<IUserDocument>,
  options: QueryOptions = { lean: true }
) => {
  return User.findOne(query, null, options);
};

export const assignToken = (user: IUserDocument, token: string) => {
  user.update({ token: token });
};

interface ILoginUserReturn {
  passwordCorrect: Promise<boolean>;
  user: IUserDocument;
}

export const loginUser = async ({
  email,
  password,
}: {
  email: IUserDocument["email"];
  password: IUserDocument["password"];
}): Promise<ILoginUserReturn> => {
  const user = await findUser({ email }, { lean: false });

  if (!user) {
    throw new UserError("User not found");
  }

  return { passwordCorrect: user.comparePassword(password), user: user };
};

export const deleteAllUsers = async () => {
  return User.deleteMany({});
};
