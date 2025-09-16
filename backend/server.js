// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const {connectDB} = require("./config/db");

// // Import routes
// const authRoutes = require("./routes/auth");
// const busRoutes = require("./routes/bus");
// const routeRoutes = require("./routes/route");
// const ticketRoutes = require("./routes/ticket");
// const alertRoutes = require("./routes/alert");
// const userRoutes = require("./routes/user");
// const analyticsRoutes = require("./routes/analytics");
// const accessRoutes = require("./routes/access");

// dotenv.config();
// connectDB();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   credentials: true
// }));
// app.use(express.json());

// // Routes
// app.use("/api/access", accessRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/buses", busRoutes);
// app.use("/api/routes", routeRoutes);
// app.use("/api/tickets", ticketRoutes);
// app.use("/api/alerts", alertRoutes);
// app.use("/api/users", userRoutes);

// // Health check endpoint
// app.get("/api/health", (req, res) => {
//   res.json({ message: "Server is running", timestamp: new Date().toISOString() });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong!" });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const busRoutes = require("./routes/bus");
const routeRoutes = require("./routes/route");
const ticketRoutes = require("./routes/ticket");
const alertRoutes = require("./routes/alert");
const userRoutes = require("./routes/user");
const analyticsRoutes = require("./routes/analytics");
const accessRoutes = require("./routes/access");

// Twilio
const twilio = require("twilio");
const { VoiceResponse } = twilio.twiml;

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 👈 important for Twilio

// Routes
app.use("/api/access", accessRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running", timestamp: new Date().toISOString() });
});

// ---------------- Twilio IVR + SMS ----------------

// Twilio Client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Temporary in-memory sessions (replace with DB in production)
const sessions = {};

// Entry point
app.post("/ivr", (req, res) => {
  const callSid = req.body.CallSid;
  sessions[callSid] = { step: "language" };

  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    numDigits: 1,
    action: "/ivr/language",
    method: "POST",
  });
  gather.say("Welcome. Press 1 for English. Press 2 for Hindi.");

  res.type("text/xml");
  res.send(twiml.toString());
});

// Language selection
app.post("/ivr/language", (req, res) => {
  const callSid = req.body.CallSid;
  const digit = req.body.Digits;
  const twiml = new VoiceResponse();

  if (digit === "1") sessions[callSid].language = "en";
  else if (digit === "2") sessions[callSid].language = "hi";
  else {
    twiml.say("Invalid input. Try again.");
    twiml.redirect("/ivr");
    res.type("text/xml");
    return res.send(twiml.toString());
  }

  // Ask for source stop
  const gather = twiml.gather({
    input: "speech",
    action: "/ivr/source",
    method: "POST",
  });
  gather.say("Please say your source bus stop name or ID.");

  res.type("text/xml");
  res.send(twiml.toString());
});

// Capture source
app.post("/ivr/source", (req, res) => {
  const callSid = req.body.CallSid;
  const speech = req.body.SpeechResult;
  sessions[callSid].source = speech;

  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    input: "speech",
    action: "/ivr/destination",
    method: "POST",
  });
  gather.say("Got it. Now say your destination stop.");

  res.type("text/xml");
  res.send(twiml.toString());
});

// Capture destination
app.post("/ivr/destination", (req, res) => {
  const callSid = req.body.CallSid;
  const speech = req.body.SpeechResult;
  sessions[callSid].destination = speech;

  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    numDigits: 1,
    action: "/ivr/confirm",
    method: "POST",
  });
  gather.say(
    `You selected ${sessions[callSid].source} to ${speech}. ` +
      "Press 1 to confirm. Press 2 to change source. " +
      "Press 3 to change destination. Press 4 to change language."
  );

  res.type("text/xml");
  res.send(twiml.toString());
});

// Confirm & send SMS
app.post("/ivr/confirm", async (req, res) => {
  const callSid = req.body.CallSid;
  const digit = req.body.Digits;
  const callerNumber = req.body.From;
  const session = sessions[callSid];
  const twiml = new VoiceResponse();

  if (digit === "1") {
    // Example ETA (replace with real DB/API logic)
    const eta = 12;
    const message = `Bus from ${session.source} to ${session.destination} will arrive in ${eta} minutes.`;

    twiml.say(
      `Confirmed. ${message}. You will also receive this info as SMS.`
    );

    // Send SMS
    try {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: callerNumber,
      });
      console.log("SMS sent to", callerNumber);
    } catch (err) {
      console.error("SMS error:", err);
      twiml.say("Could not send SMS.");
    }

    twiml.hangup();
  } else if (digit === "2") {
    session.step = "source";
    twiml.redirect("/ivr/source");
  } else if (digit === "3") {
    session.step = "destination";
    twiml.redirect("/ivr/destination");
  } else if (digit === "4") {
    session.step = "language";
    twiml.redirect("/ivr");
  } else {
    twiml.say("Invalid input.");
    twiml.redirect("/ivr/confirm");
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

// --------------------------------------------------

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
