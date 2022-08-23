const express = require("express");
const app = express();
const authRouter = require("./routes/authRouter.js");
const tasksRouter = require("./routes/taskListRouter.js");
const timesheetRouter = require("./routes/timeSheetRouter.js");
const { serverConfig } = require("./config");
const path = require("path")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(express.json());


app.use(
  express.urlencoded({
     extended: true,
   })
);

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));

app.use(bodyParser.urlencoded({extended:true}))

app.use(cookieParser())

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/timesheet", timesheetRouter);

app.get("/*", (req, res) => {  
  res.sendFile(path.resolve("frontend", "index.html"))
});


app.listen({host, port} = serverConfig, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});