const express = require("express");
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const os = require("os");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


// MongoDB connection
mongoose.connect('mongodb+srv://admin:root@yadhukrishnasm.hklj5a3.mongodb.net/p2p')
.then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

// MongoDB session store
const store = new MongoDBStore({
  uri: 'mongodb+srv://admin:root@yadhukrishnasm.hklj5a3.mongodb.net/',
  collection: 'sessions'
});

store.on('error', function(error) {
  console.log(error);
});

// User schema
const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true }
});

userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// User model
const User = mongoose.model('User', userSchema);

app.use(express.static("public"));
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false }
}));

app.use(express.json());

// Register a new user
app.get('/reg', (req, res) => {
  res.render("reg.ejs");
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    console.log(user);

    res.status(201).send('User registered successfully');
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send('Username already exists');
    }
    res.status(400).send('Registration failed');
  }
});

app.get('/', (req, res) => {
  res.render("login.ejs");
});

// Login a user
app.post('/login', async (req, res) => {
  console.log(req.body);
  const { password, username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send('Invalid password');
    }
    req.session.username = username;
    res.send('Login successful');
  } catch (error) {
    res.status(500).send('Login failed');
  }
});

app.get("/chat", function (req, res) {
  if (!req.session.username) {
    return res.status(401).send('You must be logged in to access the chat');
  }

  res.render("index.ejs", { username: req.session.username });
});

const server = http.createServer(app);

server.listen(process.env.PORT || 4000, () => {
  console.log('Server is listening on port 4000');
});

const io = socketIO(server);

io.sockets.on("connection", function (socket) {
  function log() {
    var array = ["Message from server:"];
    array.push.apply(array, arguments);
    socket.emit("log", array);
  }

  // Defining Socket Connections
  socket.on("message", function (message, room) {
    log("Client said: ", message);
    // for a real app, would be room-only (not broadcast)
    socket.in(room).emit("message", message, room);
  });

  socket.on("create or join", function (room, clientName) {
    log("Received request to create or join room " + room);

    var clientsInRoom = io.sockets.adapter.rooms.get(room);

    var numClients = clientsInRoom ? clientsInRoom.size : 0;
    log("Room " + room + " now has " + numClients + " client(s)");

    if (numClients === 0) {
      socket.join(room);
      log("Client ID " + socket.id + " created room " + room);
      socket.emit("created", room, socket.id);
    } else if (numClients === 1) {
      log("Client ID " + socket.id + " joined room " + room);
      // this message ("join") will be received only by the first client since the client has not joined the room yet
      io.sockets.in(room).emit("join", room, clientName); // this client name is the name of the second client who wants to join
      socket.join(room);
      // this message will be received by the second client
      socket.emit("joined", room, socket.id);
      // this message will be received by two clients after the join of the second client
      io.sockets.in(room).emit("ready");
    } else {
      // max two clients
      socket.emit("full", room);
    }
  });

  socket.on("creatorname", (room, client) => {
    // to all clients in room except the sender
    socket.to(room).emit("mynameis", client);
  });

  socket.on("ipaddr", function () {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function (details) {
        if (details.family === "IPv4" && details.address !== "127.0.0.1") {
          socket.emit("ipaddr", details.address);
        }
      });
    }
  });

  socket.on("bye", function () {
    console.log("received bye");
  });
});
