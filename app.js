const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const randomString = require("randomstring");
const Sequelize = require("sequelize");

const SequelizeStore = require("connect-session-sequelize")(session.Store);

//const PostgreSqlStore = require("connect-pg-simple")(session);

const AppError = require("./utils/AppError");
const userRoute = require("./routes/usersRoute");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  console.log(process.env.NODE_ENV);
  app.use(morgan("dev"));
}

const sequelize = new Sequelize(
  process.env.DB,
  process.envDB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
  }
);
const store = new SequelizeStore({ db: sequelize });

//passport authentication
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());
//app.use(session(configSession));
app.use(
  session({
    secret: randomString.generate({ length: 14, charset: "alphanumeric" }),
    store,

    saveUninitialized: false,
    resave: false,
    proxy: true,
    cookie: {
      //save jwt in cookie here means you are saving jwt in session
      maxAge: 1000 * 60 * 60 * 24, //one day
    },
  })
);

store.sync({ alter: true });

app.use("/api/v1/users", userRoute);
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`));
});
app.use(globalErrorHandler);
module.exports = app;
