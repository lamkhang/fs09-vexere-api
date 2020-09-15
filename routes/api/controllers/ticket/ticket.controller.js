const { Ticket } = require("../../../../models/Ticket");
const _ = require("lodash");
const { Seat } = require("../../../../models/Seat");
const { Trip } = require("../../../../models/Trip");
const { User } = require("../../../../models/User");
const {
  sendBookTicketEmail,
} = require("./../../../../services/email/bookTicket");
const { result } = require("lodash");
// book ticket
const createTicket = (req, res, next) => {
  const { tripId, seatCodes } = req.body;
  // userId lay tu token
  const { _id: userId } = req.user;
  User.findById(userId)
    .then((user) =>
      Promise.all([
        Trip.findById(tripId).populate("fromStation").populate("toStation"),
        user,
      ])
    )
    .then((result) => {
      let trip = result[0];
      let user = result[1];
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
        seats: seatCodes.map((code) => new Seat({ code, isBooked: true })),
        totalPrice: seatCodes.length * trip.price,
      });

      seatCodes.forEach((code) => {
        const seatIndex = trip.seats.findIndex((seat) => seat.code === code);
        if (seatIndex !== -1) {
          trip.seats[seatIndex].isBooked = true;
        }
      });
      user.tickets.push(newTicket._id);
      return Promise.all([newTicket.save(), trip.save(), user.save()]);
    })
    .then(([ticket, trip, user]) => {
      console.log(ticket);
      res.status(200).json(ticket);
      // sendBookTicketEmail(req.user, trip, ticket);
    })
    .catch((err) => {
      if (err.status)
        return res.status(err.status).json({ message: err.message });
      return res.json(err);
    });
};

// delete ticket
const deleteTicket = (req, res, next) => {
  const { _id: userId } = req.user;
  const { id: _id } = req.params;
  User.findById(userId)
    .then((user) => Promise.all([user, Ticket.findById(_id)]))
    .then((result) => {
      let user = result[0];
      let ticket = result[1];
      if (!ticket)
        return Promise.reject({
          status: 404,
          message: "ticket not found",
        });
      return Promise.all([
        user,
        ticket,
        Trip.findById(ticket.tripId).populate("fromStation").populate("toStation")
      ]);
    })
    .then((result) => {
      let user = result[0];
      let ticket = result[1];
      let trip = result[2];
      const { tripId, userId, seats } = ticket;
      if (!trip)
        return Promise.reject({
          status: 404,
          message: "trip not found",
        });
      seats.forEach((seatTicket) => {
        const seatIndex = trip.seats.findIndex(
          (seatTrip) => seatTrip.code === seatTicket.code
        );
        if (seatIndex !== -1) {
          trip.seats[seatIndex].isBooked = false;
        }
      });
      let bookedTicketIndex = -1;
      for(let i = 0; i < user.tickets.length; i++){
        if(user.tickets[i].equals(_id)) 
          bookedTicketIndex = i;
      }
      if(bookedTicketIndex === -1){
        return Promise.reject({
          status: 404,
          message: "user not buy this ticket",
        });
      }
      user.tickets.splice(bookedTicketIndex, 1);
      return Promise.all([user.save(), Ticket.deleteOne({ _id }), trip.save(), `ticket ${ticket._id} is cancel successfully`]);
    })
    .then((result) => {
      return res.status(200).json(result[3]);
    })
    .catch((err) => {
      if (err.status)
        return res.status(err.status).json({ message: err.message });
      return res.json(err);
    })
    .catch((err) => res.json(err));
};
module.exports = {
  createTicket,
  deleteTicket,
};
