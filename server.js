const express = require("express"),
  app = express(),
  server = require("http").createServer(app);
io = require("socket.io")(server);
(mongoose = require("mongoose")), (cors = require("cors"));
require("express-async-errors");
const fileUpload = require("express-fileupload");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { logger, logEvents } = require("./app/access/middleware/logger");
const errorHandler = require("./app/access/middleware/errorHandler");
const corsOptions = require("./app/config/corsOption");
const connectDB = require("./app/config/dbConnection");
const loginLimiter = require("./app/access/middleware/loginLimiter");

require("dotenv").config();
app.use(logger);
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(loginLimiter);


connectDB();
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});

mongoose.connection.on("error", err => {
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

app.use("/auth", require("./app/router/auth_route"));

const helper = require("./app/helper/helper");
io
  .of("/chat")
  .use(async (socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY1, async (err, decoded) => {
        if (err) return next(new Error("Token Error!"));
        if (!decoded) return next(new Error("Token Error 2"));
        let user = await helper.getRedis(decoded._id)
        if (!user) return next(new Error("Token Error 3"));
        socket.user_data = { user_id: user._id, user_name: user.user_name };
        next();
      });
    } else {
      next(new Error("Token Error"));
    }
  })
  .on("connection", socket => {
    require("./app/access/controller/chat_controller").initialize(io,socket)
  });

io.on("connection", socket => {
  socket.on("test",data=>{
    console.log("user data :" ,data);
    socket.emit("success",{"greet" : "hello Client"})
  })
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "app/views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);
// app.use((err, req, res, next) => {
//   err.status = err.status || 500;
//   res.status(err.status).json({ con: false, msg: err.message });
// });

// app.listen(process.env.PORT, () =>
//   console.log(`Server is running on  http://localhost:${process.env.PORT}`)
// );
