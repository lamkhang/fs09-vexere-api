const validator = require("validator");
const _ = require("lodash");
module.exports.validatePostTrip = async(req, res, next) => {
  let error = {};
  let fromStationId = _.get(req, "body.fromStationId", "");
  let toStationId = _.get(req, "body.toStationId", "");
  let startTime = _.get(req, "body.startTime", "");

  if(validator.isEmpty(fromStationId)) {
    error.fromStationId = "fromStationId is require"
  }
  if(validator.isEmpty(toStationId)) {
    error.toStationId = "toStationId is require"
  }
  if(validator.isEmpty(startTime)) {
    error.startTime = "startTime is require"
  } else if(!validator.isDate(validator.toDate(startTime, "YYYY/MM/DD"))) {
    error.startTime = "Incorrect startTime format"
  }
  if(_.isEmpty(error)) return next();
  return res.status(400).json(error);
}
