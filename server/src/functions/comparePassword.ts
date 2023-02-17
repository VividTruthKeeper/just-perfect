import bcrypt from "bcrypt";

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
