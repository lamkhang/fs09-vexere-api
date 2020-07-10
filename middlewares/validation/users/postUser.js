const  validator  = require("validator");
const _ = require("lodash");
const { User } = require("./../../../models/User");
const { min } = require("lodash");
module.exports.validatePostUser = async(req, res, next) => {
  let error = {}
  const email = _.get(req, "body.email", "");
  const password = _.get(req, "body.password", "");
  const password2 = _.get(req, "body.password2", "");
  const fullName = _.get(req, "body.fullName", "");
  const userType = _.get(req, "body.userType", "");
  // validate email (email empty, email valid. email exist);
  if (validator.isEmpty(email)) {
    error.email = "Email is require"
  }
  else if(!validator.isEmail(email)){
    error.email = "Email in valid";
  }
  else{
    const user = await User.findOne({ email });
    if(user) error.email = "User exist";
  }

  // validate password (password empty, password lenght);
  if (validator.isEmpty(password)) {
    error.password = "passsword is require"
  }
  else if(!validator.isLength(password, { min: 6 })){
    error.password = "Password must have 6 character";
  }

  // validate password2 (password empty, password lenght);
  if (validator.isEmpty(password2)) {
    error.password = "passsword2 is require";
  }
  else if(!validator.equals(password, password2)){
    error.password = "Password2 must match password";
  }

  // validate fullname (fullname empty);
  console.log(validator.isEmpty(fullName))
  if (validator.isEmpty(fullName)) {
    error.fullName = "fullname is require";
  }

  if(_.isEmpty(error)) return next();
  return res.status(400).json(error)
  // validate password;
}

