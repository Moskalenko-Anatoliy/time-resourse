const express = require("express");
const app = express();
const tasksRouter = require("./routes/tasks");
const { serverConfig } = require('./config');
const path = require("path")

app.use(express.json());

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/tasks", tasksRouter);

app.get("/", (req, res) => {  
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen({host, port} = serverConfig, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});
