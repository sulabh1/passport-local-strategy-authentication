const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");
const { User } = require("./../models");
exports.register = catchAsync(async (req, res, next) => {
  try {
    const existedUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existedUser) {
      return next(new AppError("user already exist please try login", 401));
    }
    const user = User.build({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    res.status(201).json({
      status: "success",
      user,
    });
  } catch (err) {
    console.log(err, err.message, err.stackTrace);
  }
});
//exports.login = () => {};
