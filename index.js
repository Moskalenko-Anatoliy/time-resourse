const express = require("express");
const app = express();
const tasksRouter = require("./routes/tasks");

const port = 3000;

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



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
