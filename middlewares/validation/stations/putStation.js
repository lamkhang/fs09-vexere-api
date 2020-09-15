const validator = require("validator");
const _ = require("lodash");
module.exports.validatePutStation = async(req, res, next) => {
  let error = {};
  let name = _.get(req, "body.name", "");
  let address = _.get(req, "body.address", "");
  let province =  _.get(req, "body.province", ""); 
  if(validator.isEmpty(name)) {
    error.name = "Name is require";
  }
  if(validator.isEmpty(address)){
    error.address = "Address is require"
  }
  if(validator.isEmpty(province)){
    error.province = "Province is require"
  }
  if(_.isEmpty(error)) return next();
  return res.status(400).json(error)
}