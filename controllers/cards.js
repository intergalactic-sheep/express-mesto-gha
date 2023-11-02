const Card = require("../models/card");

let statusCode = 500;
let errorMessage = "Ошибка на стороне сервера";

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    if (err.name === "ValidationError") {
      statusCode = 400;
      errorMessage = "Переданы некорректные данные";
    }

    return res.status(statusCode).send({ message: errorMessage });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const newCard = await new Card(req.body);
    newCard.owner = req.user._id;
    return res.status(201).send(await newCard.save());
  } catch (err) {
    if (err.name === "ValidationError") {
      statusCode = 400;
      errorMessage = "Переданы некорректные данные";
    }

    return res.status(statusCode).send({ message: errorMessage });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const cardToDelete = await Card.findByIdAndRemove(req.params.id);
    return res.status(200).send(cardToDelete);
  } catch (err) {
    if (err.name === "ValidationError") {
      statusCode = 400;
      errorMessage = "Переданы некорректные данные";
    }

    return res.status(statusCode).send({ message: errorMessage });
  }
};

module.exports.likeCard = (req, res) => {
  try {
    const likeMethod = req.method === "PUT" ? "$addToSet" : "$pull";
    const likedCard = Card.findByIdAndUpdate(
      req.params.cardId,
      { [likeMethod]: { likes: req.user._id } },
      { new: true }
    );
    return res.status(200).send(likedCard);
  } catch (err) {
    if (err.name === "ValidationError") {
      statusCode = 400;
      errorMessage = "Переданы некорректные данные";
    }

    return res.status(statusCode).send({ message: errorMessage });
  }
};
