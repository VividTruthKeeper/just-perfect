import User, { IUserDocument, IUserInput } from "../models/user.model";
import { FilterQuery, Query, QueryOptions } from "mongoose";

export const createUser = async (input: any) => {
  return User.create(input);
};

export const findUser = async (
  query: FilterQuery<IUserDocument>,
  options: QueryOptions = { lean: true }
) => {
  return User.findOne(query, null, options);
};

export const loginUser = async ({
  email,
  password,
}: {
  email: IUserDocument["email"];
  password: IUserDocument["password"];
}) => {
  const user = await findUser({ email }, { lean: false });

  if (!user) {
    throw new Error("User does not exist");
  }

  return user.comparePassword(password);
};

export const deleteAllUsers = async () => {
  return User.deleteMany({});
};
