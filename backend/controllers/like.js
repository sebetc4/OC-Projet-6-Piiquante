// Import
const Sauce = require("../models/Sauce");


// Contrôleur de like de sauce
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ error: new Error("Objet non trouvé!") });
            }
            const likeStatut = req.body.like;
            let includesInArrays =
                sauce.usersLiked.includes(req.body.userId) ||
                sauce.usersDisliked.includes(req.body.userId);
            switch (likeStatut) {
                case 1:
                    if (!includesInArrays) {
                        sauce.likes++;
                        sauce.usersLiked.push(req.body.userId);
                        break;
                    } else {
                        return res.status(401).json({ error: new Error("Requête non autorisée!") });
                    }
                case -1:
                    if (!includesInArrays) {
                        sauce.dislikes++;
                        sauce.usersDisliked.push(req.body.userId);
                        break;
                    } else {
                        return res.status(401).json({ error: new Error("Requête non autorisée!") });
                    }
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauce.likes--;
                        sauce.usersLiked.splice(
                            sauce.usersDisliked.indexOf(req.body.userId)
                        );
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.dislikes--;
                        sauce.usersDisliked.splice(
                            sauce.usersDisliked.indexOf(req.body.userId)
                        );
                    } else {
                        return res.status(401).json({ error: new Error("Requête non autorisée!") });
                    }
            }
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    likes: sauce.likes,
                    dislikes: sauce.dislikes,
                    usersLiked: sauce.usersLiked,
                    usersDisliked: sauce.usersDisliked,
                    _id: req.params.id,
                }
            )
                .then(() =>
                    res.status(200).json({ message: "Modification Like / Dislike effectuée!" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(404).json({ error }));
};
