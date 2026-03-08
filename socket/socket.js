const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinProject", (projectId) => {
      if (projectId) {
        socket.join(String(projectId));
        console.log(`Socket ${socket.id} joined project ${projectId}`);
      }
    });

    socket.on("leaveProject", (projectId) => {
      if (projectId) socket.leave(String(projectId));
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;
