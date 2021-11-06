const express = require('express');
const Joi = require('joi');

const router = express.Router();
const genres = [
    { id: 1, name: 'action' },
    { id: 2, name: 'comedy' },
    { id: 3, name: 'drama' },
    { id: 4, name: 'thriller' },
];


router.get('/', (req, res) => {
    res.send(genres)
})
router.get('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) {
        return res.status(404).send('Genre with given ID was not found')
    }
    res.send(genre)
})
router.post('/', (req, res) => {
    const result = validateGenre(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message)
    }
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }
    genres.push(genre);
    res.send(genre);
})

router.put('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) {
        return res.status(404).send('Genre with given ID was not found')
    }
    const result = validateGenre(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message)
    }
    genre.name = req.body.name;

    res.send(genre);
})

router.delete('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) {
        return res.status(404).send('Genre with given ID was not found')
    }
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
})


function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().required().min(3)

    })
    return schema.validate(genre);
}

module.exports = router;