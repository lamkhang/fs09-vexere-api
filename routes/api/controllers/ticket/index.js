const express = require("express");
const ticketController = require("./ticket.controller");
const { authenticate, authorize } = require("./../../../../middlewares/auth");

const router = express.Router();

router.post("/", authenticate, authorize(["client"]), ticketController.createTicket);
router.delete("/:id", authenticate, authorize(["client"]), ticketController.deleteTicket);
module.exports = router;