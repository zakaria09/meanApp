const express = require('express');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.post('/signin', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401)
                    .json({ message: 'Login failed! No User found.' })
            }
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Login failed!'
                })
            }
            const token = jwt.sign({ 
                userId: user._id,
                name: user.name,
                email: user.email,
                password: user.password
            }, 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiw', {
                expiresIn: '20m'
            })
        })
        .catch(error => {
            return res.status(401).json({
                message: 'Login failed!'
            })
        });
});

module.exports = router;