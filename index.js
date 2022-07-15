const express = require("express");
const app = express();
const tasksRouter = require("./routes/api/tasks");
const loginRouter = require("./routes/pages/login");
const { serverConfig } = require('./config');
const path = require("path")
const passport = require('passport');

app.use(express.json());

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use("/api/tasks", tasksRouter);
app.use('/pages/login', loginRouter);
app.get("/", (req, res) => {  
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen({host, port} = serverConfig, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});
