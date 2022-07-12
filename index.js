const express = require("express");
const app = express();
const tasksRouter = require("./routes/tasks");

const { serverConfig } = require('./config')

app.use(express.json());

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

app.use("/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});


app.listen({host, port} = serverConfig, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});
