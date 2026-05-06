import http from "http";
import { Server } from "socket.io";
import { app } from "./src/app.js";
import { config } from "./src/config.js";
import { connectDatabase } from "./src/db.js";
import { seedDatabase } from "./src/services/seedService.js";
import { corsOriginCallback } from "./src/utils/corsOptions.js";

await connectDatabase();
await seedDatabase();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOriginCallback,
    methods: ["GET", "POST", "PATCH"]
  }
});

io.on("connection", (socket) => {
  console.log(`Realtime client connected: ${socket.id}`);
});

app.set("io", io);

server.listen(config.port, () => {
  console.log(`Smart road API running on http://localhost:${config.port}`);
});