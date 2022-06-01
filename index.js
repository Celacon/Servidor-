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

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
    console.log(users);
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};




io.on("connection", (socket) => {

 console.log("a user connected.");

    //take userId and socketId from user
    socket.on("addUser", (idUsu) => {
        addUser(idUsu, socket.id);
        io.emit("getUsers", users);
    });

    //send and get message
    socket.on("sendMessage", ({ userId, message, idUsu }) => {
        const user = getUser(userId);

        console.log(user.socketId);
        io.to(user.socketId).emit("getMessage", {
            idUsu,
            message,

        });
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
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





/*
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
* */