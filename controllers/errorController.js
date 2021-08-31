const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
};
const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  //err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    //console.log(res.status(err.statusCode));
    sendDevError(err, res);
    next();
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    sendProdError(error, res);
    next();
  }
};
