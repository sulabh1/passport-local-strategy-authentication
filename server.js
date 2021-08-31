require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const port = 4040 | process.env.PORT;
// sequel.sync({ alter: true }).then(() => {
//   console.log("db 2 connection successful");
// });
app.listen(port, () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("db connection successful");
    })
    .catch((err) => console.log(err));
  console.log(`listening to the port ${port}`);
});
