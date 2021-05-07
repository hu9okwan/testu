const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

let flashcardsController = {
    list: async(req, res) => {
        let userId = req.session.passport.user
        let allFlashcards = await prisma.flashcardsSet.findMany({
            where: { userId: userId },
            include: {
                _count: { 
                    select: { 
                        flashcards: true
                    }
                }
            }
        })
        res.render("flashcards/index", { flashcardsSets: allFlashcards });
    },


    new: (req, res) => {
        res.render("flashcards/create");
    },

    listOne: async (req, res) => {

    },

    create: async (req, res) => {
        let userId = req.session.passport.user

        flashcards = []
        let keys = req.body.flashcards.term;
        let values = req.body.flashcards.definition;

        if (Array.isArray(keys)) {
            keys.forEach((currentKey, i) => {
                newFlashcard = {term: currentKey, definition: values[i]};
                flashcards.push(newFlashcard)});
        } else {
            flashcards.push({term: keys, definition: values})
        }

        // format tags into a string of tags separated with a comma
        let tags = req.body.tags
        let tagString = ""
        if (tags[0] !== "") {
            tagString += tags[0]
        }
        if (tags[0] !== "" && tags [1] !== "") {
            tagString += ","
        }
        if (tags[1] !== "") {
            tagString += tags[1]
        }


        // creates a new flashcardset and creates related flashcards
        await prisma.flashcardsSet.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                userId: userId,
                flashcards: {
                    create: flashcards
                },
                tags: tagString
            }
        })

        res.redirect("/flashcards");
    },

    edit: async (req, res) => {

    },

    update: async (req, res) => {

    },

    delete: async (req, res) => {

    },

};

module.exports = flashcardsController;