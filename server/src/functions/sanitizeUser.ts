export default (user: any, noJson?: boolean) => {
  let userJSON;
  if (!noJson) userJSON = user.toJSON();
  else userJSON = user;
  delete userJSON.password;
  delete userJSON.__v;

  return userJSON;
};
