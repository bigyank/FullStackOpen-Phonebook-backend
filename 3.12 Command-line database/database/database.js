require("dotenv").config();
const { connect } = require("mongoose");

const url = `mongodb+srv://fullstack:${process.env.MONGODB_ATLAS}@cluster0-edmhn.mongodb.net/test?retryWrites=true&w=majority`;
connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
