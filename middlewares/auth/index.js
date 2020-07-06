const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const jwtVerify = promisify(jwt.verify)

module.exports.authenticate = (req, res, next) => {
  const token = req.header("token");
  if(!token) return res.status(401).json({message: "token is required"})
  jwtVerify(token, "abc")
    .then(decoded => {
      req.user = decoded;
      next();
    })
    .catch(err => res.status(401).json({message: "token invalid"}))
}
module.exports.authorize = (userTypeArr) => {
  return (req, res, next) => {
    const { user } = req;
    if(userTypeArr.indexOf(user.userType) === -1) return res.status(403).json({message: "user do not have right permission to access"});
    next();
  }
}