/* eslint-disable no-param-reassign */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const jwtAuth = require("./lib/jwtAuthMiddleware");
const i18n = require("./lib/i18nConfigure");
const LangController = require("./controllers/LangController");
const LoginController = require("./controllers/LoginController");

const langController = new LangController();
const loginController = new LoginController();

// test running microservices
// const thumbnailReq = require('./microservices/reqThumbnail');
// const thumbnailResp = require('./microservices/resThumbnail');

require("./lib/connectMongoose");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/**
 * Middlewares
 */

app.locals.title = "NodePop";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Rutas de la API
 */
app.post("/api/authenticate", loginController.postAPIJWT);
app.use("/api/tags/", require("./routes/api/tags"));
app.use("/api/anuncios/", jwtAuth, require("./routes/api/anuncios"));

/**
 * Rutas del website
 */
app.use(i18n.init);
app.use((req, res, next) => {
  res.locals.currentLocale = req.getLocale(); // pasamos el idioma actual a las vistas
  next();
});
app.use("/tags/", require("./routes/tags"));
app.use("/", require("./routes/index"));
app.get("/change-locale/:locale", langController.changeLocale);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // errores de validación
  if (err.array) {
    const errInfo = err.array({})[0];
    err.message = `NOT VALID - ${errInfo.type} '${errInfo.path}' en ${errInfo.location}: ${errInfo.msg}`;
    err.status = 422;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // si el fallo es en el API
  // responder en formato JSON
  res.status(err.status || 500);
  if (req.originalUrl.startsWith("/api/")) {
    res.json({ error: err.message });
    return;
  }

  // render the error page
  res.render("error");
});

module.exports = app;
