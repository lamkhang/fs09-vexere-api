const mongoose = require("mongoose");
const { SeatSchema } = require("./Seat");

const TicketSchema = new mongoose.Schema({
  tripId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Trip" 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  seats: [SeatSchema],
  totalPrice: Number,
  nameUserGo: { type: String, required: true },
  emailUserGo: { type: String, required: true },
  phoneUserGo: { type: String, required: true },
  noteUserGo: { type: String, default: "" }

});
const Ticket = mongoose.model("Ticket", TicketSchema, "Ticket");
module.exports = { TicketSchema, Ticket };