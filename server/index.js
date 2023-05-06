const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const chats = require("./data/data");
const userRoutes = require("./Routes/userRoutes");
const { notFound, errorHandler } = require("./Middlewares/errorMiddleware");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
dotenv.config();
const app = express();

app.use(express.json()); //TO ACCEPT JSON DATA------------

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.log(`${error} did not connect`));

const server = app.listen(PORT, () =>
  console.log(`Server is running on Port: ${PORT}`)
);
// CONNECTION ESTABILISHED-----------
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("Connected to Socket.io");
  // TO CONNECTED TO USER DATA AS THEY CAN JOIN OUR APPLICATION-----------
  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });
  // CONNECTION ESTABILISHED WHEN USER JOIN THE CHAT ROOM------------
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room" + room);
  });

  // THIS SETUP IS FOR SHOW TYPING WHEN OTHER MEMBER TYPE SOMETHING-----
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // CREATING SEND MESSAGE FUNCTIONALITY--------------

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      // SENDING THE MESSAGE INSIDE THAT USER ROOM----------------
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
