const mongoose = require("mongoose");

const { SeatSchema }  = require("./Seat");

const TripSchema = new mongoose.Schema({
  fromStationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Station" 
  },
  fromStation: { type: String, required: true },
  toStationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Station" 
  },
  toStation: { type: String, required: true },
  startTime: { type: Date, required: true },
  seats: [SeatSchema],
  price: { type: Number, default: 0}
});
const Trip = mongoose.model("Trip", TripSchema, "Trip");
module.exports = { TripSchema, Trip };