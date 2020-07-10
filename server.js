const express = require("express");
const mongoose = require("mongoose");
// const stations = require("./routes/stations");
const dotenv = require("dotenv");
const config = require("./config");
dotenv.config();
// let PORT;
// if(process.env.NODE_ENV = "staging") {
//   PORT = process.env.STAGING_PORT;
// }
// else {
//   PORT = process.env.PORT || process.env.LOCAL_PORT;
// }


mongoose.connect(process.env.STAGING_MONGO_URi, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("connect to mongodb successfully"))
.catch(console.log)
// mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => console.log("connect to mongodb successfully"))
// .catch(console.log)
const app = express();
// const PORT = 5000
app.use(express.json());
app.use("/uploads", express.static("./uploads"));

// app.get("/api/stations", stations.getStations);
// app.get("/api/stations/:_id", stations.getStationById);
// app.post("/api/stations", stations.postStations);
// app.put("/api/stations/:id", stations.putStationById);
// app.patch("/api/stations/:id", stations.patchStationId)
// app.delete("/api/stations/:id", stations.deleteStationId)

app.use("/api/stations", require("./routes/api/controllers/stations/index"));
app.use("/api/trips", require("./routes/api/controllers/trip/index"));
app.use("/api/users", require("./routes/api/controllers/users/index"));
app.use("/api/tickets", require("./routes/api/controllers/ticket/index"));

const PORT = process.env.PORT || config.port;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

app.use(express.json())