const { Trip } = require("./../../../../models/Trip");
const { Seat } = require("../../../../models/Seat");
const { Station } = require("../../../../models/Station");
const _ = require("lodash");
const codeArr = [
  "A01",
  "A02",
  "A03",
  "A04",
  "A05",
  "A06",
  "A07",
  "A08",
  "A09",
  "A10",
  "A11",
  "A12",
  "B01",
  "B02",
  "B03",
  "B04",
  "B05",
  "B06",
  "B07",
  "B08",
  "B09",
  "B10",
  "B11",
  "B12",
];

const getTrip = (req, res, next) => {
  // hien thi them so luong get avaiable
  Trip.find()
    // .select("-seats")
    .then((trips) => {
      const _trips = trips.map((trip) => {
        // const modifiedTrip =  {
        //   ...trips._doc,
        //   avaiableSeatNumber: trip.seats.filter(seat => !seat.isBooked).length
        // };
        // delete modifiedTrip.seats;
        // return modifiedTrip;

        // return {
        //   ..._.omit(trip._doc, ["seats"]),
        //   avaiableSeatNumber: trip.seats.filter(seat => !seat.isBooked).length
        // }

        // return _.assign(
        //   _.omit(trip._doc, ["seats"]),
        //   {avaiableSeatNumber: trip.seats.filter(seat => !seat.isBooked).length}
        // )
        // console.log(
        //   _.chain(trip)
        //   .get("_doc")
        //   .omit(["seats"])
        // )
        return _.chain(trip)
          .get("_doc")
          // .omit(["seats"])
          .assign({
            avaiableSeatNumber: trip.seats.filter((seat) => !seat.isBooked)
              .length,
          })
          .value();
      });
      res.status(200).json(_trips);
    })
    .catch(console.log());
};

const getTripById = (req, res, next) => {
  const { id } = req.params;
  Trip.findById(id)
    .then((trip) => {
      if (!trip)
        return Promise.reject({
          status: 404,
          message: "Trip not found",
        });
      res.status(200).json(trip);
    })
    .catch(console.log());
};

const postTrip = (req, res, next) => {
  const { fromStationId, toStationId, startTime, price } = req.body;
  const fromStation = 
    Station.findById(fromStationId)
      .then((station) => {
        if (!station)
          return Promise.reject({
            status: 404,
            message: "Station from not found",
          });
        res.status(200).json(station);
      })
  .catch(console.log());
  const toStation = 
    Station.findById(toStationId)
      .then((station) => {
        if (!station)
          return Promise.reject({
            status: 404,
            message: "Station to not found",
          });
        res.status(200).json(station);
      })
  .catch(console.log());
  const seats = codeArr.map((code) => {
    return new Seat({ code });
  });
  const newTrip = new Trip({
    fromStationId,
    toStationId,
    fromStation,
    toStation,
    startTime,
    price,
    seats,
  });
  newTrip
    .save()
    .then((trip) => res.status(201).json(trip))
    .catch((err) => res.json(err));
};

const patchTripById = (req, res, next) => {
  const { id } = req.params;
  Trip.findById(id).then((trip) => {
    if (!trip)
      return Promise.reject({
        status: 404,
        message: "Trip not found",
      });
    Object.keys(req.body).forEach((key) => {
      trip[key] = req.body[key];
    });
    return trip.save();
  });
};

const deleteTripById = (req, res, next) => {
  const { id: _id } = req.params;
  let _trip;
  Trip.findById(_id)
    .then((trip) => {
      _trip = trip;
      if (!trip)
        return Promise.reject({
          status: 404,
          message: "Trip not found",
        });
      return Trip.deleteOne({ _id });
    })
    .then(() => res.status(200).json(_trip))
    .catch(res.json);
};

module.exports = {
  getTrip,
  getTripById,
  postTrip,
  patchTripById,
  deleteTripById,
};
