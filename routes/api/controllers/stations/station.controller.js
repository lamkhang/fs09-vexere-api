const { Station } = require("./../../../../models/Station");
const _ = require("lodash");

const getStations = (req, res, next) => {
  Station.find()
    .then((stations) => {
      res.status(200).json(stations);
    })
    .catch((err) => res.json(err));
};

const postStations = (req, res, next) => {
  const { name, address, province } = req.body;
  const newStation = new Station(req.body);
  newStation
    .save()
    .then((station) => res.status(201).json(station))
    .catch((err) => res.json(err));
};

const getStationById = (req, res, next) => {
  const id = req.params;
  Station.findById(id)
    .then((station) => res.status(200).json(station))
    .catch(console.log);
};

// replace
const putStationById = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then((station) => {
      if (!station)
        return Promise.reject({
          status: 404,
          message: "Station not found",
        });
      const { name, address, province } = req.body;
      // station.doc = { ...station.doc, ...req.body };
      const keys = ["name", "address", "province"];
      keys.forEach(key => {
        station[key] = req.body[key];
      });
      // station.doc = { ...station.doc, ..._.pick(req.body, ) };
      // station.name = name;
      // station.address = address;
      // station.province = province;
      return station.save();
    })
    .then(station => res.status(200).json(station))
    .catch((err) => res.json(err));
};

// update
const patchStationId = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then((station) => {
      if (!station)
        return Promise.reject({
          status: 404,
          message: "Station not found"
        });
      // const { name, address, province } = req.body;
      // station.name = name ? name : station.name;
      // station.address = address ? address : station.address;
      // station.province = province ? province : station.province;
      Object.keys(req.body).forEach(key => {
        station[key] = req.body[key];
      });
      return station.save();
    })
    .then(station => res.status(200).json(station))
    .catch(err=> res.json(err))
};

const deleteStationId = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then((station) => {
      if(!station)
        return Promise.reject({
          status: 404, 
          message: "Station not found"
        })
      return Promise.all([Station.deleteOne({_id: id}), station]) 
    })
    .then(result => res.status(200).json(result[1]))
    .catch(err => res.json(err))
}

module.exports = {
  getStations,
  postStations,
  getStationById,
  putStationById,
  patchStationId,
  deleteStationId
};
