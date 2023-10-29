const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((films) => res.send({ data: films }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  User.create({ name: req.body.name, about: req.body.about, avatar: req.body.avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
