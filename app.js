const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: "6542bb625bc6103409577893"
  };

  next();
});

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(router);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
