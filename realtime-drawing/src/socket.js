export default (io) => {
  let data = [];
  let users = 0;
  let color = "#FFFFFF";

  io.on("connection", (socket) => {

    for (let i = 0; i < data.length; i++) {
      io.emit("everyone/client/show-drawing", data[i]);
    }

    users = users + 1;
    io.emit("everyone/client/users", users);

    // delete canvas
    socket.on("everyone/server/delete", () => {
      data = [];
      io.emit("everyone/client/show-drawing", null);
    });

    // drawing process on canvas
    socket.on("everyone/server/drawing", (drawing) => {
      data.push(drawing);
      io.emit("everyone/client/show-drawing", drawing);
    });

    // disconnect user
    socket.on("disconnect", () => {
      users = users - 1;
      io.emit("everyone/client/users", users);
    });

    // set color for everyone
    socket.on("everyone/server/set-color", (data) => {
      console.log("everyone/server/set-color", data);
      color = data.color;
      io.emit("everyone/client/set-color", data);
    });
  });
};
