const express = require("express");
const { getRandomSentence, getResponseInterval } = require("./utils");

const PORT = process.env.PORT || 5000;
const app = express();
const server = app.listen(PORT, () => console.log("Server running..."));

const io = require("socket.io")(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
	// Health Check
	res.send("This service is up and running...");
});

io.on("connection", (socket) => {

 console.log("a user connected.");

	socket.on("fetch_response", (data) => {
		const { userId, sender2, content } = data;
	console.log(userId,sender2);
		const responseInterval = getResponseInterval(1000, 4000);

		setTimeout(() => {
			socket.emit("start_typing", { userId });

			setTimeout(() => {
				socket.emit("stop_typing", { userId });
				socket.emit("fetch_response", {
					response: content,
					userId, sender2,
				});
			}, responseInterval);
		}, 1500);
	});
});

/*
//send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });*/