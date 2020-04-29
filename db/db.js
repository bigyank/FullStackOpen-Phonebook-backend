const mongoose = require("mongoose");
require("dotenv").config();

url = process.env.MONGODB_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to MONGODB"))
  .catch((e) => console.log(e));
