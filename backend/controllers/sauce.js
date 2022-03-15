// Imports
const fs = require("fs");

const Sauce = require("../models/Sauce");

// Contrôleur de Création de sauce
exports.creatSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        userDisliked: [],
    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: "Objet enregistré !!" }))
        .catch((error) => res.status(400).json({ error }));
};

// Contrôleur de récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

// Contrôleur de récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

// Contrôleur de modification de sauce
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (!sauce) {
            return res.status(404).json({ error: new Error("Objet non trouvé!") });
        }
        if (sauce.userId !== req.auth.userId) {
            return res.status(401).json({ error: new Error("Requête non autorisée!") });
        }
        let sauceObject = {};
        if (req.file) {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, (err) => {
                if (err) {
                    throw err;
                }
            });
            sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            };
        } else {
            sauceObject = { ...req.body };
        }
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet modifié !!" }))
            .catch((error) => res.status(400).json({ error }));
    });
};

// Contrôleur de suppression de sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet suprimmé!" }))
                    .catch((error) => res.status(404).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};
