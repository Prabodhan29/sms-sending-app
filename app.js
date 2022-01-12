const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const Nexmo = require("nexmo");
const socketio = require("socket.io");
const app = express();
require("dotenv").config();

const nexmo = new Nexmo(
  {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  },
  { debug: true }
);

// Set view engine
app.set("view engine", "ejs");

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static assets
app.use(express.static("public"));

// Root route
app.get("/", function (req, res) {
  res.render("index.ejs");
});

// Catch form submit
app.post("/", function (req, res) {
  const number = req.body.number;
  const text = req.body.text;

  nexmo.message.sendSms(
    process.env.REGISTERED_NUMBER,
    number,
    text,
    { type: "unicode" },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);

        // Get data from response
        const data = {
          id: responseData.messages[0]["message-id"],
          number: responseData.messages[0]["to"],
        };

        // Emit to the client
        io.emit("smsStatus", data);
      }
    }
  );
});

const server = app.listen(process.env.PORT, function () {
  console.log("This server is running on port " + process.env.PORT);
});

// Connect to socket.io
const io = socketio(server);
io.on("connection", function (socket) {
  console.log("Connected...");
  io.on("disconnect", function () {
    console.log("Disconnect");
  });
});
