import $express from "express";
import $http from "http";
import { Server } from "socket.io";
import $cors from "cors";
import path from "path";
import socket from "./socket";

const PORT = process.env.PORT || 3000;

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = $express();

app.use($express.static(path.join(__dirname, "public")));
app.use($cors());
const http = $http.createServer(app);
const io = new Server(http);
socket(io);

http.listen(PORT, "localhost", (error) => {
  if (error) console.log(error);

  console.log("Server started on port: " + PORT);
});
