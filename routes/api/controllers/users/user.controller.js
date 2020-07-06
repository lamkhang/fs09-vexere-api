const {User} = require("./../../../../models/User");
const bcrypt = require("bcrypt");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const _ = require("lodash")
// register
const createUser = (req, res, next) => {
  const { email, fullname, password } = req.body;
  newUser = new User({email, password, fullname});
  newUser
    .save()
    .then(user => res.status(200).json(user))
    .catch(err => {
      return res.json(err);
  })
}
const jwtSign = promisify(jwt.sign);

const login = (req, res, next) => {
  const { email, password } = req.body;
  let _user;
  User.findOne({email})
    .then(user => {
      if(!user) return Promise.reject({
        status: 404,
        message: "Email not found"
      });
      _user = user;
      // const jsonwebtoken = 
      return bcrypt.compare(password, user.password);
    })
    .then(isMatched => {
      if(!isMatched) return Promise.reject({
        status: 400,
        message: "Wrong password"
      });
      const payload = _.pick(_user, ["_id", "email", "fullname", "userType"]);
      return jwtSign(
        payload,
        "abc",
        {expiresIn: "1h"}
      )
      
      
    })
    .then(token => {
      return res.status(200).json({message: "login success", token})
    })
    .catch(err => {
      if(err.status === 400) return res.status(err.status).json({message: err.message})
      return res.json(err);
    })
}

const uploadAvatar = (req, res, next) => {
  const { email } = req.user;
  User.findOne({ email })
  .then(user => {
    if(!email) return Promise.reject({
      status: 404,
      message: "Email not exist"
    })
    user.avatar = req.file.path;
    return user.save()
  })
  
  .then(user => res.status(200).json(user))
  .catch(err => {
    if(err.status === 400) return res.status(err.status).json({message: err.message})
    return res.json(err);
  })
}
module.exports = {
  createUser,
  login,
  uploadAvatar
}