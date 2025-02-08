var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const port = 5000;
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { ConnectDB } = require("./config/db.js");
const { authRoutes } = require("./routes/authRoute.js");
const { uploadRoutes } = require("./routes/resumeRoutes.js");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// connecting to db
ConnectDB();

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

app.use("/auth", authRoutes); //auth routes
app.use("/resume", uploadRoutes); //auth routes

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// listening to port
app.listen(port, () => {
  console.log(`server starts at${port}`);
});
