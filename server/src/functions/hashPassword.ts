import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
};
