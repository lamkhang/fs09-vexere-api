const { Ticket } = require("../../../../models/Ticket");
const _ = require("lodash");
const { Seat } = require("../../../../models/Seat");
const { Trip } = require("../../../../models/Trip");
const { sendBookTicketEmail } = require("./../../../../services/email/bookTicket");
// book ticket
const createTicket = (req, res, next) => {
  const { tripId, seatCodes } = req.body;
  // userId lay tu token
  const { _id: userId } = req.user;
  Trip.findById(tripId)
    .populate("fromStation")
    .populate("toStation")
    .then((trip) => {
      if (!trip)
        return Promise.reject({
          status: 404,
          message: "trip not found",
        });
      const avaiableSeatCodes = trip.seats
        .filter((seat) => !seat.isBooked)
        .map((seat) => seat.code);
      const errSeatCodes = [];
      seatCodes.forEach((code) => {
        if (avaiableSeatCodes.indexOf(code) === -1) {
          errSeatCodes.push(code);
        }
      });
      if (!_.isEmpty(errSeatCodes))
        return Promise.reject({
          status: 400,
          message: `${errSeatCodes.join(", ")} are not avaiable`,
        });
      const newTicket = new Ticket({
        userId,
        tripId,
        seats: seatCodes.map((code) => new Seat({ code })),
        totalPrice: seatCodes.length * trip.price
      });

      seatCodes.forEach((code) => {
        const seatIndex = trip.seats.findIndex((seat) => seat.code === code);
        trip.seats[seatIndex].isBooked = true;
      });
      return Promise.all([newTicket.save(), trip.save()]);
    })
    .then(([ticket, trip]) => {
      res.status(200).json(ticket);
      sendBookTicketEmail(req.user, trip, ticket);
    })
    .catch((err) => {
      if (err.status) return res.status(400).json({message: err.message});
      return res.json(err);
    });
};

module.exports = {
  createTicket,
};
