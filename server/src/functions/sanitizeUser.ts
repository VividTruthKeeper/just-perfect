export default (user: any) => {
  const userJSON = user.toJSON();
  delete userJSON.firstName;
  delete userJSON.lastName;
  delete userJSON.password;
  delete userJSON.__v;

  return userJSON;
};
