const express = require('express');
const user = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const User = new user({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            User.save()
                .then(result => {
                    res.status(201)
                        .json({
                            message: 'Account Has Been Created Successfully!',
                            result: result
                        });
                })
                .catch(error => {
                    res.status(500)
                        .json({ 
                            message: 'Error: Account was not created',
                            error: error
                        });
                });
        });
});

module.exports = router;