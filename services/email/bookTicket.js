const nodemailer = require("nodemailer");
const fs = require("fs"); //built-in-NodeJS (NodeAPI)
const hogan = require("hogan.js");
const { TripSchema } = require("../../models/Trip");

const template = fs.readFileSync("services/email/bookingTicketEmailTemplate.hjs", "utf-8");
const compiledTemplate = hogan.compile(template);
module.exports.sendBookTicketEmail = (user, trip, ticket) => {
  const transport = {
    host: "smtp.gmail.com",
    port: 587,
    sucure: true,
    requireTLS: true,
    requireSSL: true,
    auth: {
      user: "lbkhang1196@gmail.com",
      pass: "khang!1234"
    }
  }
  const transporter = nodemailer.createTransport(transport);

  const mailOptions = {
    from: "lbkhang1196@gmail.com",
    to: "lbkhang102@gmail.com",
    subject: "Mai xac nhan mua ve thanh cong",
    html: compiledTemplate.render({
      email:"lbkhang102@gmail.com",
      fromStation: trip.fromStationId.name,
      toStation: trip.toStationId.name,
      price: trip.price,
      amount: ticket.seats.length,
      total: trip.price * ticket.seats.length,
      seatCodes: ticket.seats
        .map(m => m.code)
        .join("", "")
    })
  };
  transporter.sendMail(mailOptions, (error) => {
    if(error) return console.log(error);
    console.log("send email successfully")
  })
}