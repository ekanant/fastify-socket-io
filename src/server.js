// Require the framework and instantiate it
const app = require("fastify")({ logger: true });
const { join } = require('path')
const { readFile } = require("fs").promises;
// Socket IO
app.register(require("fastify-socket.io"), {
  // put your options here
});

// Declare a route
app.get("/", async (request, reply) => {
  return { hello: "world" };
});

app.get("/chat", async (req, reply) => {
  const data = await readFile(join(__dirname, "chat.html"));
  reply.header("content-type", "text/html; charset=utf-8");
  reply.send(data);
});

app.get("/ws", async (request, reply) => {
    app.io.emit("hello");
});

app.ready((err) => {
  if (err) throw err;

  app.io.on("connect", (socket) =>
    console.info("Socket connected!", socket.id)
  );

  app.io.on("connection", (socket) =>{
        socket.on("message", function (args) {
            console.log("message args", args)
            socket.broadcast.emit("gotMessage", args);
        });
  });
});

// Run the server!
const start = async () => {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
