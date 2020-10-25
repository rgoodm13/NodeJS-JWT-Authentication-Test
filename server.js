const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const exjwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const secretKey = "My key";
const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

const PORT = 3000;

let users = [
  {
    id: 1,
    username: "ryan",
    password: "123",
  },
  {
    id: 2,
    username: "goodman",
    password: "456",
  },
];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Origin", "Content-type,Authorization");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  for (let user of users) {
    if (username == user.username && password == user.password) {
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "7d" }
      );
      res.json({
        success: true,
        err: null,
        token,
      });
      break;
    } else {
      res.status(401).json({
        success: false,
        token: null,
        err: "Username or password is incorrect",
      });
    }
  }
});

app.get("/api/dashboard", jwtMW, (req, res) => {
  console.log(req);
  res.json({
    success: true,
    myContent: "secret content",
  });
});

app.get("/api/settings", jwtMW, (req, res) => {
  console.log(req);
  res.json({
    success: true,
    myContent: "settings content",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "username or password incorrect 2",
    });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`serving on port ${PORT}`);
});
