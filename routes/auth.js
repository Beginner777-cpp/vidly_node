const express = require("express");
const Joi = require("joi");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { User } = require("../models/user");
const _ = require("lodash");
const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const result = validate(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send("Invalid email or password.");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            return res.status(400).send("Invalid email or password.");
        }
        res.send(true)
    } catch (error) {
        res.status(400).send(error.message);
    }
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email({
            minDomainSegments: 2,
        }),
        password: Joi.string().required(),
    });

    return schema.validate(req);
}

module.exports = router;